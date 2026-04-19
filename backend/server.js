import http from "node:http";
import { existsSync, createReadStream } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  isMailerConfigured,
  sendNewsletterBroadcast,
  sendNewsletterWelcomeEmail,
} from "./mailer.js";
import {
  addContactSubmission,
  addNewsletterSubscriber,
  addSpeakerNomination,
  getContactSubmissions,
  getAllContent,
  getContactSubjects,
  getEventById,
  getEvents,
  getHealthSummary,
  getNewsletterSubscribers,
  getOrgTreesBySeason,
  getSpeakerNominations,
  getSponsors,
  getTalks,
  getUpcomingContent,
} from "./database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3001);
const HOST = process.env.HOST || "0.0.0.0";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";
const frontendDir = path.join(__dirname, "..", "frontend");
const distDir = path.join(frontendDir, "dist");
const publicDir = path.join(frontendDir, "public");
const CORS_ALLOW_HEADERS = "Content-Type,Authorization,x-admin-token";

const sendJson = (res, statusCode, payload) => {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": CORS_ALLOW_HEADERS,
  });
  res.end(JSON.stringify(payload));
};

const sendText = (res, statusCode, body, contentType = "text/plain; charset=utf-8") => {
  res.writeHead(statusCode, {
    "Content-Type": contentType,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": CORS_ALLOW_HEADERS,
  });
  res.end(body);
};

const readBody = async (req) => {
  const chunks = [];
  let size = 0;

  for await (const chunk of req) {
    size += chunk.length;
    if (size > 1024 * 1024) {
      throw new Error("Request body too large");
    }

    chunks.push(chunk);
  }

  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw);
  } catch {
    throw new Error("Invalid JSON payload");
  }
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isAuthorized = (req) => {
  if (!ADMIN_TOKEN) {
    return false;
  }

  const headerToken = req.headers["x-admin-token"];
  if (typeof headerToken === "string" && headerToken === ADMIN_TOKEN) {
    return true;
  }

  const authHeader = req.headers.authorization;
  if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
    const bearerToken = authHeader.slice(7);
    return bearerToken === ADMIN_TOKEN;
  }

  return false;
};

const requireAdmin = (req, res) => {
  if (!ADMIN_TOKEN) {
    sendJson(res, 503, {
      ok: false,
      error: "ADMIN_TOKEN is not configured on the server.",
    });
    return false;
  }

  if (!isAuthorized(req)) {
    sendJson(res, 401, {
      ok: false,
      error: "Unauthorized.",
    });
    return false;
  }

  return true;
};

const getFilePath = (urlPath) => {
  if (urlPath === "/") {
    return path.join(distDir, "index.html");
  }

  const candidate = path.join(distDir, urlPath);
  if (existsSync(candidate) && !candidate.endsWith(path.sep)) {
    return candidate;
  }

  const publicCandidate = path.join(publicDir, urlPath.replace(/^\//, ""));
  if (existsSync(publicCandidate) && !publicCandidate.endsWith(path.sep)) {
    return publicCandidate;
  }

  return null;
};

const serveStatic = async (res, urlPath) => {
  const filePath = getFilePath(urlPath);

  if (!filePath) {
    const indexPath = path.join(distDir, "index.html");
    if (existsSync(indexPath)) {
      const html = await readFile(indexPath, "utf8");
      return sendText(res, 200, html, "text/html; charset=utf-8");
    }

    return sendText(res, 404, "Not found");
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType =
    ext === ".html"
      ? "text/html; charset=utf-8"
      : ext === ".js"
        ? "application/javascript; charset=utf-8"
        : ext === ".css"
          ? "text/css; charset=utf-8"
          : ext === ".svg"
            ? "image/svg+xml"
            : ext === ".png"
              ? "image/png"
              : ext === ".jpg" || ext === ".jpeg"
                ? "image/jpeg"
                : ext === ".webp"
                  ? "image/webp"
                  : "application/octet-stream";

  res.writeHead(200, {
    "Content-Type": contentType,
    "Access-Control-Allow-Origin": "*",
  });

  createReadStream(filePath).pipe(res);
};

const requestHandler = async (req, res) => {
  const requestUrl = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

  if (requestUrl.pathname.startsWith("/api/")) {
    if (req.method === "OPTIONS") {
      res.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Headers": CORS_ALLOW_HEADERS,
      });
      res.end();
      return;
    }

    if (req.method === "GET" && requestUrl.pathname === "/api/health") {
      sendJson(res, 200, getHealthSummary());
      return;
    }

    if (req.method === "GET" && requestUrl.pathname === "/api/config") {
      sendJson(res, 200, {
        contactSubjects: getContactSubjects(),
        brand: "TEDxGUC",
        waitlistLabel: "Join Waitlist",
        newsletterEmailEnabled: isMailerConfigured(),
      });
      return;
    }

    if (req.method === "GET" && requestUrl.pathname === "/api/content") {
      sendJson(res, 200, getAllContent());
      return;
    }

    if (req.method === "GET" && requestUrl.pathname.startsWith("/api/content/")) {
      const contentKey = requestUrl.pathname.replace("/api/content/", "");
      const content = getAllContent()[contentKey];

      if (!content) {
        sendJson(res, 404, { ok: false, error: "Content item not found." });
        return;
      }

      sendJson(res, 200, { key: contentKey, data: content });
      return;
    }

    if (req.method === "GET" && requestUrl.pathname === "/api/talks") {
      sendJson(res, 200, { talks: getTalks() });
      return;
    }

    if (req.method === "GET" && requestUrl.pathname === "/api/events") {
      sendJson(res, 200, { events: getEvents() });
      return;
    }

    if (req.method === "GET" && requestUrl.pathname === "/api/sponsors") {
      sendJson(res, 200, { sponsors: getSponsors() });
      return;
    }

    if (req.method === "GET" && requestUrl.pathname.startsWith("/api/events/")) {
      const eventId = requestUrl.pathname.replace("/api/events/", "");
      const event = getEventById(eventId);

      if (!event) {
        sendJson(res, 404, { ok: false, error: "Event not found." });
        return;
      }

      sendJson(res, 200, { event });
      return;
    }

    if (req.method === "GET" && requestUrl.pathname === "/api/org-trees") {
      sendJson(res, 200, { orgTreesBySeason: getOrgTreesBySeason() });
      return;
    }

    if (req.method === "GET" && requestUrl.pathname === "/api/upcoming") {
      sendJson(res, 200, getUpcomingContent());
      return;
    }

    if (req.method === "POST" && requestUrl.pathname === "/api/contact") {
      try {
        const body = await readBody(req);
        const name = String(body.name || "").trim();
        const email = String(body.email || "").trim();
        const subject = String(body.subject || "").trim();
        const message = String(body.message || "").trim();

        if (!name || !email || !message) {
          sendJson(res, 400, {
            ok: false,
            error: "Name, email, and message are required.",
          });
          return;
        }

        if (!isValidEmail(email)) {
          sendJson(res, 400, {
            ok: false,
            error: "Please provide a valid email address.",
          });
          return;
        }

        const submission = addContactSubmission({
          name,
          email,
          subject: subject || getContactSubjects()[0],
          message,
        });

        sendJson(res, 201, {
          ok: true,
          message: "Message received. We'll get back to you soon.",
          submission,
        });
      } catch (error) {
        sendJson(res, 400, {
          ok: false,
          error: error instanceof Error ? error.message : "Unable to process request.",
        });
      }
      return;
    }

    if (req.method === "POST" && requestUrl.pathname === "/api/newsletter") {
      try {
        const body = await readBody(req);
        const email = String(body.email || "").trim();

        if (!email) {
          sendJson(res, 400, { ok: false, error: "Email is required." });
          return;
        }

        if (!isValidEmail(email)) {
          sendJson(res, 400, { ok: false, error: "Please provide a valid email address." });
          return;
        }

        const { alreadySubscribed } = addNewsletterSubscriber(email);

        if (!alreadySubscribed && isMailerConfigured()) {
          try {
            await sendNewsletterWelcomeEmail(email);
          } catch (error) {
            console.error("Failed to send welcome newsletter email:", error);
          }
        }

        sendJson(res, 200, {
          ok: true,
          message: alreadySubscribed
            ? "You're already subscribed."
            : "Thanks for subscribing. We'll keep you updated.",
        });
      } catch (error) {
        sendJson(res, 400, {
          ok: false,
          error: error instanceof Error ? error.message : "Unable to process request.",
        });
      }
      return;
    }

    if (req.method === "POST" && requestUrl.pathname === "/api/newsletter/broadcast") {
      if (!requireAdmin(req, res)) {
        return;
      }

      if (!isMailerConfigured()) {
        sendJson(res, 503, {
          ok: false,
          error: "SMTP is not configured on the server.",
        });
        return;
      }

      try {
        const body = await readBody(req);
        const subject = String(body.subject || "").trim();
        const message = String(body.message || "").trim();

        if (!subject || !message) {
          sendJson(res, 400, {
            ok: false,
            error: "Subject and message are required.",
          });
          return;
        }

        const subscribers = getNewsletterSubscribers();
        if (subscribers.length === 0) {
          sendJson(res, 200, {
            ok: true,
            sentCount: 0,
            failedCount: 0,
            failures: [],
            message: "No subscribers to notify.",
          });
          return;
        }

        const result = await sendNewsletterBroadcast({
          subscribers,
          subject,
          message,
        });

        sendJson(res, 200, {
          ok: true,
          ...result,
        });
      } catch (error) {
        sendJson(res, 400, {
          ok: false,
          error: error instanceof Error ? error.message : "Unable to send broadcast.",
        });
      }
      return;
    }

    if (req.method === "POST" && requestUrl.pathname === "/api/nominations/speaker") {
      try {
        const body = await readBody(req);
        const nominatorName = String(body.nominatorName || "").trim();
        const nominatorEmail = String(body.nominatorEmail || "").trim();
        const speakerName = String(body.speakerName || "").trim();
        const speakerEmail = String(body.speakerEmail || "").trim();
        const speakerTopic = String(body.speakerTopic || "").trim();
        const speakerBio = String(body.speakerBio || "").trim();
        const whyNominate = String(body.whyNominate || "").trim();
        const speakerSocialLinks = String(body.speakerSocialLinks || "").trim();

        if (!nominatorName || !nominatorEmail || !speakerName || !speakerEmail || !speakerTopic || !speakerBio || !whyNominate) {
          sendJson(res, 400, {
            ok: false,
            error: "All required fields must be provided.",
          });
          return;
        }

        if (!isValidEmail(nominatorEmail)) {
          sendJson(res, 400, {
            ok: false,
            error: "Please provide a valid nominator email address.",
          });
          return;
        }

        if (!isValidEmail(speakerEmail)) {
          sendJson(res, 400, {
            ok: false,
            error: "Please provide a valid speaker email address.",
          });
          return;
        }

        const nomination = addSpeakerNomination({
          nominatorName,
          nominatorEmail,
          speakerName,
          speakerEmail,
          speakerTopic,
          speakerBio,
          whyNominate,
          speakerSocialLinks: speakerSocialLinks || null,
        });

        sendJson(res, 201, {
          ok: true,
          message: "Thank you for nominating a speaker! We will review their profile and get back to you soon.",
          nomination,
        });
      } catch (error) {
        sendJson(res, 400, {
          ok: false,
          error: error instanceof Error ? error.message : "Unable to process nomination.",
        });
      }
      return;
    }

    if (req.method === "GET" && requestUrl.pathname === "/api/submissions/contact") {
      if (!requireAdmin(req, res)) {
        return;
      }

      sendJson(res, 200, { submissions: getContactSubmissions() });
      return;
    }

    if (req.method === "GET" && requestUrl.pathname === "/api/submissions/newsletter") {
      if (!requireAdmin(req, res)) {
        return;
      }

      sendJson(res, 200, { subscribers: getNewsletterSubscribers() });
      return;
    }

    if (req.method === "GET" && requestUrl.pathname === "/api/submissions/nominations") {
      if (!requireAdmin(req, res)) {
        return;
      }

      sendJson(res, 200, { nominations: getSpeakerNominations() });
      return;
    }

    sendJson(res, 404, {
      ok: false,
      error: "API route not found.",
    });
    return;
  }

  if (req.method === "GET") {
    const assetPath = getFilePath(requestUrl.pathname);
    if (assetPath) {
      await serveStatic(res, requestUrl.pathname);
      return;
    }

    const indexPath = path.join(distDir, "index.html");
    if (existsSync(indexPath)) {
      const html = await readFile(indexPath, "utf8");
      sendText(res, 200, html, "text/html; charset=utf-8");
      return;
    }
  }

  sendText(res, 404, "Not found");
};

export const createServer = () => http.createServer(requestHandler);

export const startServer = ({ port = PORT, host = HOST } = {}) => {
  const server = createServer();
  return new Promise((resolve) => {
    server.listen(port, host, () => {
      resolve(server);
    });
  });
};

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  startServer().then(() => {
    console.log(`TEDxGUC backend listening on http://${HOST}:${PORT}`);
  });
}
