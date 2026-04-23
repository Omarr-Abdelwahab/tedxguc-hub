import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import { loadSiteContent } from "./seedData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, "data");
const dbPath = path.join(dataDir, "tedxguc.sqlite");

const normalizeSupabaseUrl = (value) => value.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");

const supabaseUrl = normalizeSupabaseUrl(process.env.SUPABASE_URL || process.env.SUPABASE_PROJECT_URL || "");
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || "";
const useSupabase = Boolean(supabaseUrl && supabaseKey);

const siteContent = loadSiteContent();
const contentEntries = {
  talks: siteContent.talks,
  orgTreesBySeason: siteContent.orgTreesBySeason,
  events: siteContent.events,
  sponsors: siteContent.sponsors,
  upcomingEvent: siteContent.upcomingEvent,
  upcomingSchedule: siteContent.upcomingSchedule,
  upcomingFAQs: siteContent.upcomingFAQs,
  upcomingSpeakers: siteContent.upcomingSpeakers,
  contactSubjects: siteContent.contactSubjects,
};

const parsePayload = (payload) => {
  if (payload == null) {
    return null;
  }

  if (typeof payload === "string") {
    return JSON.parse(payload);
  }

  return payload;
};

const createLocalStore = async () => {
  const { default: Database } = await import("better-sqlite3");

  mkdirSync(dataDir, { recursive: true });

  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");

  db.exec(`
    CREATE TABLE IF NOT EXISTS content_items (
      key TEXT PRIMARY KEY,
      payload TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS contact_submissions (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS speaker_nominations (
      id TEXT PRIMARY KEY,
      nominator_name TEXT NOT NULL,
      nominator_email TEXT NOT NULL,
      speaker_name TEXT NOT NULL,
      speaker_email TEXT NOT NULL,
      speaker_topic TEXT NOT NULL,
      speaker_bio TEXT NOT NULL,
      why_nominate TEXT NOT NULL,
      speaker_social_links TEXT,
      created_at TEXT NOT NULL
    );
  `);

  const insertContentIfMissing = db.prepare(`
    INSERT INTO content_items (key, payload, updated_at)
    VALUES (@key, @payload, @updatedAt)
    ON CONFLICT(key) DO NOTHING
  `);

  for (const [key, value] of Object.entries(contentEntries)) {
    insertContentIfMissing.run({
      key,
      payload: JSON.stringify(value),
      updatedAt: new Date().toISOString(),
    });
  }

  const getContentRow = db.prepare("SELECT payload FROM content_items WHERE key = ?");
  const getAllContentRows = db.prepare("SELECT key, payload FROM content_items");
  const listContacts = db.prepare("SELECT id, name, email, subject, message, created_at FROM contact_submissions ORDER BY created_at DESC");
  const insertContact = db.prepare(`
    INSERT INTO contact_submissions (id, name, email, subject, message, created_at)
    VALUES (@id, @name, @email, @subject, @message, @createdAt)
  `);
  const listNewsletter = db.prepare("SELECT id, email, created_at FROM newsletter_subscribers ORDER BY created_at DESC");
  const insertNewsletter = db.prepare(`
    INSERT INTO newsletter_subscribers (id, email, created_at)
    VALUES (@id, @email, @createdAt)
  `);
  const getNewsletterByEmail = db.prepare("SELECT id, email, created_at FROM newsletter_subscribers WHERE email = ?");
  const listNominations = db.prepare("SELECT id, nominator_name, nominator_email, speaker_name, speaker_email, speaker_topic, speaker_bio, why_nominate, speaker_social_links, created_at FROM speaker_nominations ORDER BY created_at DESC");
  const insertNomination = db.prepare(`
    INSERT INTO speaker_nominations (id, nominator_name, nominator_email, speaker_name, speaker_email, speaker_topic, speaker_bio, why_nominate, speaker_social_links, created_at)
    VALUES (@id, @nominatorName, @nominatorEmail, @speakerName, @speakerEmail, @speakerTopic, @speakerBio, @whyNominate, @speakerSocialLinks, @createdAt)
  `);
  const countRows = (tableName) => db.prepare(`SELECT COUNT(*) AS count FROM ${tableName}`).get().count;

  const localStore = {
    kind: "local",
    databaseLabel: existsSync(dbPath) ? dbPath : null,
    getContentItem: async (key) => {
      const row = getContentRow.get(key);
      return row ? parsePayload(row.payload) : null;
    },
    getAllContent: async () => {
      const rows = getAllContentRows.all();
      return rows.reduce((accumulator, row) => {
        accumulator[row.key] = parsePayload(row.payload);
        return accumulator;
      }, {});
    },
    getContactSubjects: async () => (await localStore.getContentItem("contactSubjects")) || siteContent.contactSubjects,
    getTalks: async () => (await localStore.getContentItem("talks")) || [],
    getEvents: async () => (await localStore.getContentItem("events")) || [],
    getEventById: async (eventId) => (await localStore.getEvents()).find((event) => event.id === eventId) || null,
    getOrgTreesBySeason: async () => (await localStore.getContentItem("orgTreesBySeason")) || {},
    getSponsors: async () => (await localStore.getContentItem("sponsors")) || [],
    getUpcomingContent: async () => ({
      upcomingEvent: await localStore.getContentItem("upcomingEvent"),
      upcomingSchedule: (await localStore.getContentItem("upcomingSchedule")) || [],
      upcomingFAQs: (await localStore.getContentItem("upcomingFAQs")) || [],
      upcomingSpeakers: (await localStore.getContentItem("upcomingSpeakers")) || [],
    }),
    addContactSubmission: async ({ name, email, subject, message }) => {
      const submission = {
        id: `contact-${randomUUID()}`,
        name,
        email,
        subject,
        message,
        createdAt: new Date().toISOString(),
      };

      insertContact.run(submission);
      return submission;
    },
    addNewsletterSubscriber: async (email) => {
      const existing = getNewsletterByEmail.get(email);
      if (existing) {
        return { alreadySubscribed: true, subscriber: existing };
      }

      const subscriber = {
        id: `newsletter-${randomUUID()}`,
        email,
        createdAt: new Date().toISOString(),
      };

      insertNewsletter.run(subscriber);
      return { alreadySubscribed: false, subscriber };
    },
    getContactSubmissions: async () => listContacts.all(),
    getNewsletterSubscribers: async () => listNewsletter.all(),
    addSpeakerNomination: async ({ nominatorName, nominatorEmail, speakerName, speakerEmail, speakerTopic, speakerBio, whyNominate, speakerSocialLinks }) => {
      const nomination = {
        id: `nomination-${randomUUID()}`,
        nominatorName,
        nominatorEmail,
        speakerName,
        speakerEmail,
        speakerTopic,
        speakerBio,
        whyNominate,
        speakerSocialLinks: speakerSocialLinks || null,
        createdAt: new Date().toISOString(),
      };

      insertNomination.run(nomination);
      return nomination;
    },
    getSpeakerNominations: async () => listNominations.all(),
    getHealthSummary: async () => ({
      ok: true,
      service: "TEDxGUC Hub API",
      database: existsSync(dbPath) ? dbPath : null,
      counts: {
        talks: (await localStore.getTalks()).length,
        events: (await localStore.getEvents()).length,
        contacts: countRows("contact_submissions"),
        newsletterSubscribers: countRows("newsletter_subscribers"),
        speakerNominations: countRows("speaker_nominations"),
      },
    }),
  };

  return localStore;
};

const createSupabaseRequestError = async (response) => {
  const detail = await response.text();
  const error = new Error(`Supabase request failed (${response.status}): ${detail || response.statusText}`);
  error.status = response.status;
  error.body = detail;
  return error;
};

const createSupabaseStore = async () => {
  const headers = {
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`,
    Accept: "application/json",
  };

  const request = async (tableName, { method = "GET", query = {}, body, prefer } = {}) => {
    const url = new URL(`${supabaseUrl}/rest/v1/${tableName}`);

    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, value);
      }
    }

    const requestHeaders = { ...headers };
    if (prefer) {
      requestHeaders.Prefer = prefer;
    }

    let requestBody;
    if (body !== undefined) {
      requestHeaders["Content-Type"] = "application/json";
      requestBody = JSON.stringify(body);
    }

    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: requestBody,
    });

    if (!response.ok) {
      throw await createSupabaseRequestError(response);
    }

    if (response.status === 204) {
      return [];
    }

    const text = await response.text();
    return text ? JSON.parse(text) : [];
  };

  const getRows = (tableName, query = {}) => request(tableName, { query });
  const insertRows = (tableName, rows) => request(tableName, { method: "POST", body: rows, prefer: "return=representation" });

  const existingContentRows = await getRows("content_items", { select: "key" });
  const existingKeys = new Set(existingContentRows.map((row) => row.key));
  const missingContentRows = Object.entries(contentEntries)
    .filter(([key]) => !existingKeys.has(key))
    .map(([key, value]) => ({
      key,
      payload: JSON.stringify(value),
      updated_at: new Date().toISOString(),
    }));

  if (missingContentRows.length > 0) {
    await insertRows("content_items", missingContentRows);
  }

  const remoteStore = {
    kind: "supabase",
    databaseLabel: supabaseUrl,
    getContentItem: async (key) => {
      const rows = await getRows("content_items", {
        select: "payload",
        key: `eq.${key}`,
        limit: "1",
      });

      return rows[0] ? parsePayload(rows[0].payload) : null;
    },
    getAllContent: async () => {
      const rows = await getRows("content_items", {
        select: "key,payload",
        order: "key.asc",
      });

      return rows.reduce((accumulator, row) => {
        accumulator[row.key] = parsePayload(row.payload);
        return accumulator;
      }, {});
    },
    getContactSubjects: async () => (await remoteStore.getContentItem("contactSubjects")) || siteContent.contactSubjects,
    getTalks: async () => (await remoteStore.getContentItem("talks")) || [],
    getEvents: async () => (await remoteStore.getContentItem("events")) || [],
    getEventById: async (eventId) => (await remoteStore.getEvents()).find((event) => event.id === eventId) || null,
    getOrgTreesBySeason: async () => (await remoteStore.getContentItem("orgTreesBySeason")) || {},
    getSponsors: async () => (await remoteStore.getContentItem("sponsors")) || [],
    getUpcomingContent: async () => ({
      upcomingEvent: await remoteStore.getContentItem("upcomingEvent"),
      upcomingSchedule: (await remoteStore.getContentItem("upcomingSchedule")) || [],
      upcomingFAQs: (await remoteStore.getContentItem("upcomingFAQs")) || [],
      upcomingSpeakers: (await remoteStore.getContentItem("upcomingSpeakers")) || [],
    }),
    addContactSubmission: async ({ name, email, subject, message }) => {
      const submission = {
        id: `contact-${randomUUID()}`,
        name,
        email,
        subject,
        message,
        created_at: new Date().toISOString(),
      };

      await insertRows("contact_submissions", [submission]);
      return submission;
    },
    addNewsletterSubscriber: async (email) => {
      const existing = await getRows("newsletter_subscribers", {
        select: "id,email,created_at",
        email: `eq.${email}`,
        limit: "1",
      });

      if (existing[0]) {
        return { alreadySubscribed: true, subscriber: existing[0] };
      }

      const subscriber = {
        id: `newsletter-${randomUUID()}`,
        email,
        created_at: new Date().toISOString(),
      };

      try {
        await insertRows("newsletter_subscribers", [subscriber]);
        return { alreadySubscribed: false, subscriber };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        const duplicateEntry = error?.status === 409 || message.includes("duplicate") || message.includes("23505");

        if (!duplicateEntry) {
          throw error;
        }

        const rows = await getRows("newsletter_subscribers", {
          select: "id,email,created_at",
          email: `eq.${email}`,
          limit: "1",
        });

        return { alreadySubscribed: true, subscriber: rows[0] || subscriber };
      }
    },
    getContactSubmissions: async () => getRows("contact_submissions", {
      select: "id,name,email,subject,message,created_at",
      order: "created_at.desc",
    }),
    getNewsletterSubscribers: async () => getRows("newsletter_subscribers", {
      select: "id,email,created_at",
      order: "created_at.desc",
    }),
    addSpeakerNomination: async ({ nominatorName, nominatorEmail, speakerName, speakerEmail, speakerTopic, speakerBio, whyNominate, speakerSocialLinks }) => {
      const nomination = {
        id: `nomination-${randomUUID()}`,
        nominator_name: nominatorName,
        nominator_email: nominatorEmail,
        speaker_name: speakerName,
        speaker_email: speakerEmail,
        speaker_topic: speakerTopic,
        speaker_bio: speakerBio,
        why_nominate: whyNominate,
        speaker_social_links: speakerSocialLinks || null,
        created_at: new Date().toISOString(),
      };

      await insertRows("speaker_nominations", [nomination]);
      return nomination;
    },
    getSpeakerNominations: async () => getRows("speaker_nominations", {
      select: "id,nominator_name,nominator_email,speaker_name,speaker_email,speaker_topic,speaker_bio,why_nominate,speaker_social_links,created_at",
      order: "created_at.desc",
    }),
    getHealthSummary: async () => ({
      ok: true,
      service: "TEDxGUC Hub API",
      database: supabaseUrl,
      counts: {
        talks: (await remoteStore.getTalks()).length,
        events: (await remoteStore.getEvents()).length,
        contacts: (await remoteStore.getContactSubmissions()).length,
        newsletterSubscribers: (await remoteStore.getNewsletterSubscribers()).length,
        speakerNominations: (await remoteStore.getSpeakerNominations()).length,
      },
    }),
  };

  return remoteStore;
};

const storePromise = useSupabase ? createSupabaseStore() : createLocalStore();

const getStore = async () => storePromise;

export const getContentItem = async (key) => (await getStore()).getContentItem(key);

export const getAllContent = async () => (await getStore()).getAllContent();

export const getContactSubjects = async () => (await getStore()).getContactSubjects();

export const getTalks = async () => (await getStore()).getTalks();

export const getEvents = async () => (await getStore()).getEvents();

export const getEventById = async (eventId) => (await getStore()).getEventById(eventId);

export const getOrgTreesBySeason = async () => (await getStore()).getOrgTreesBySeason();

export const getSponsors = async () => (await getStore()).getSponsors();

export const getUpcomingContent = async () => (await getStore()).getUpcomingContent();

export const addContactSubmission = async ({ name, email, subject, message }) => (await getStore()).addContactSubmission({ name, email, subject, message });

export const addNewsletterSubscriber = async (email) => (await getStore()).addNewsletterSubscriber(email);

export const getContactSubmissions = async () => (await getStore()).getContactSubmissions();

export const getNewsletterSubscribers = async () => (await getStore()).getNewsletterSubscribers();

export const addSpeakerNomination = async ({ nominatorName, nominatorEmail, speakerName, speakerEmail, speakerTopic, speakerBio, whyNominate, speakerSocialLinks }) => (await getStore()).addSpeakerNomination({ nominatorName, nominatorEmail, speakerName, speakerEmail, speakerTopic, speakerBio, whyNominate, speakerSocialLinks });

export const getSpeakerNominations = async () => (await getStore()).getSpeakerNominations();

export const getHealthSummary = async () => (await getStore()).getHealthSummary();
