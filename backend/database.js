import Database from "better-sqlite3";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import { loadSiteContent } from "./seedData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, "data");
const dbPath = path.join(dataDir, "tedxguc.sqlite");

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
`);

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

const upsertContent = db.prepare(`
  INSERT INTO content_items (key, payload, updated_at)
  VALUES (@key, @payload, @updatedAt)
  ON CONFLICT(key) DO UPDATE SET
    payload = excluded.payload,
    updated_at = excluded.updated_at
`);

const countRows = (tableName) => db.prepare(`SELECT COUNT(*) AS count FROM ${tableName}`).get().count;

for (const [key, value] of Object.entries(contentEntries)) {
  upsertContent.run({
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

export const getContentItem = (key) => {
  const row = getContentRow.get(key);
  return row ? JSON.parse(row.payload) : null;
};

export const getAllContent = () => {
  const rows = getAllContentRows.all();
  return rows.reduce((accumulator, row) => {
    accumulator[row.key] = JSON.parse(row.payload);
    return accumulator;
  }, {});
};

export const getContactSubjects = () => getContentItem("contactSubjects") || siteContent.contactSubjects;

export const getTalks = () => getContentItem("talks") || [];

export const getEvents = () => getContentItem("events") || [];

export const getEventById = (eventId) => getEvents().find((event) => event.id === eventId) || null;

export const getOrgTreesBySeason = () => getContentItem("orgTreesBySeason") || {};

export const getSponsors = () => getContentItem("sponsors") || [];

export const getUpcomingContent = () => ({
  upcomingEvent: getContentItem("upcomingEvent"),
  upcomingSchedule: getContentItem("upcomingSchedule") || [],
  upcomingFAQs: getContentItem("upcomingFAQs") || [],
  upcomingSpeakers: getContentItem("upcomingSpeakers") || [],
});

export const addContactSubmission = ({ name, email, subject, message }) => {
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
};

export const addNewsletterSubscriber = (email) => {
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
};

export const getContactSubmissions = () => listContacts.all();

export const getNewsletterSubscribers = () => listNewsletter.all();

export const getHealthSummary = () => ({
  ok: true,
  service: "TEDxGUC Hub API",
  database: existsSync(dbPath) ? dbPath : null,
  counts: {
    talks: getTalks().length,
    events: getEvents().length,
    contacts: countRows("contact_submissions"),
    newsletterSubscribers: countRows("newsletter_subscribers"),
  },
});
