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
import { reloadSeedContent } from "./adminTasks.js";
import { loadRawSeedContent } from "./seedData.js";
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
const isProduction = Boolean(process.env.NODE_ENV === "production" || process.env.VERCEL);
const frontendDir = path.join(__dirname, "..", "frontend");
const distDir = path.join(frontendDir, "dist");
const publicDir = path.join(frontendDir, "public");
const CORS_ALLOW_HEADERS = "Content-Type,Authorization,x-admin-token";
const getApiCacheControl = () => (isProduction ? "public, max-age=300, stale-while-revalidate=600" : "no-store");

const sendJson = (res, statusCode, payload) => {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": CORS_ALLOW_HEADERS,
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(payload));
};

const sendJsonCached = (res, statusCode, payload, cacheControl) => {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": CORS_ALLOW_HEADERS,
    "Cache-Control": cacheControl,
  });
  res.end(JSON.stringify(payload));
};

const sendText = (res, statusCode, body, contentType = "text/plain; charset=utf-8", cacheControl = "no-store") => {
  res.writeHead(statusCode, {
    "Content-Type": contentType,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": CORS_ALLOW_HEADERS,
    "Cache-Control": cacheControl,
  });
  res.end(body);
};

const sendPrettyJson = (res, statusCode, payload) => {
  sendText(res, statusCode, JSON.stringify(payload, null, 2), "application/json; charset=utf-8");
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

const getStaticCacheControl = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();

  if (filePath.includes(`${path.sep}assets${path.sep}`)) {
    return "public, max-age=31536000, immutable";
  }

  if (ext === ".html") {
    return "no-cache";
  }

  if ([".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif", ".ico"].includes(ext)) {
    return "public, max-age=86400";
  }

  return "public, max-age=3600";
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
    "Cache-Control": getStaticCacheControl(filePath),
  });

  createReadStream(filePath).pipe(res);
};

export const requestHandler = async (req, res) => {
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
      sendJson(res, 200, await getHealthSummary());
      return;
    }

    if (req.method === "GET" && requestUrl.pathname === "/api/config") {
      const contactSubjects = await getContactSubjects();

      sendJsonCached(res, 200, {
        contactSubjects,
        brand: "TEDxGUC",
        waitlistLabel: "Join Waitlist",
        newsletterEmailEnabled: isMailerConfigured(),
      }, getApiCacheControl());
      return;
    }

    if (req.method === "GET" && requestUrl.pathname === "/api/content") {
      sendJsonCached(res, 200, await getAllContent(), getApiCacheControl());
      return;
    }

    if (req.method === "GET" && requestUrl.pathname === "/api/seed-content") {
      sendPrettyJson(res, 200, loadRawSeedContent());
      return;
    }

    if (req.method === "GET" && requestUrl.pathname.startsWith("/api/seed-content/")) {
      const contentKey = decodeURIComponent(requestUrl.pathname.replace("/api/seed-content/", "")).trim();
      const content = loadRawSeedContent()[contentKey];

      if (content === undefined) {
        sendJson(res, 404, { ok: false, error: "Seed content item not found." });
        return;
      }

      sendPrettyJson(res, 200, content);
      return;
    }

    if (req.method === "GET" && requestUrl.pathname.startsWith("/api/content/")) {
      const contentKey = requestUrl.pathname.replace("/api/content/", "");
      const content = (await getAllContent())[contentKey];

      if (!content) {
        sendJson(res, 404, { ok: false, error: "Content item not found." });
        return;
      }

      sendJsonCached(res, 200, { key: contentKey, data: content }, getApiCacheControl());
      return;
    }

    if (req.method === "GET" && requestUrl.pathname === "/api/talks") {
      sendJsonCached(res, 200, { talks: await getTalks() }, getApiCacheControl());
      return;
    }

    if (req.method === "GET" && requestUrl.pathname === "/api/events") {
      sendJsonCached(res, 200, { events: await getEvents() }, getApiCacheControl());
      return;
    }

    if (req.method === "GET" && requestUrl.pathname === "/api/sponsors") {
      sendJsonCached(res, 200, { sponsors: await getSponsors() }, getApiCacheControl());
      return;
    }

    if (req.method === "GET" && requestUrl.pathname.startsWith("/api/events/")) {
      const eventId = decodeURIComponent(requestUrl.pathname.replace("/api/events/", ""));
      const event = await getEventById(eventId);

      if (!event) {
        sendJson(res, 404, { ok: false, error: "Event not found." });
        return;
      }

      sendJsonCached(res, 200, { event }, getApiCacheControl());
      return;
    }

    if (req.method === "GET" && requestUrl.pathname === "/api/org-trees") {
      sendJsonCached(res, 200, { orgTreesBySeason: await getOrgTreesBySeason() }, getApiCacheControl());
      return;
    }

    if (req.method === "GET" && requestUrl.pathname === "/api/upcoming") {
      sendJsonCached(res, 200, await getUpcomingContent(), getApiCacheControl());
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

        const submission = await addContactSubmission({
          name,
          email,
          subject: subject || (await getContactSubjects())[0],
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

        const { alreadySubscribed } = await addNewsletterSubscriber(email);

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

        const subscribers = await getNewsletterSubscribers();
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

        const nomination = await addSpeakerNomination({
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

      sendJson(res, 200, { submissions: await getContactSubmissions() });
      return;
    }
    if (req.method === "POST" && requestUrl.pathname === "/api/admin/reload-seed-content") {
      if (!requireAdmin(req, res)) {
        return;
      }

      try {
        const result = await reloadSeedContent();
        sendJson(res, 200, result);
      } catch (error) {
        sendJson(res, 500, {
          ok: false,
          error: error instanceof Error ? error.message : "Failed to reload seed content.",
        });
      }
      return;
    }
    if (req.method === "GET" && requestUrl.pathname === "/api/submissions/newsletter") {
      if (!requireAdmin(req, res)) {
        return;
      }

      sendJson(res, 200, { subscribers: await getNewsletterSubscribers() });
      return;
    }

    if (req.method === "GET" && requestUrl.pathname === "/api/submissions/nominations") {
      if (!requireAdmin(req, res)) {
        return;
      }

      sendJson(res, 200, { nominations: await getSpeakerNominations() });
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

export default requestHandler;

