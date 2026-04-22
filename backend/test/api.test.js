import test from "node:test";
import assert from "node:assert/strict";

process.env.ADMIN_TOKEN = "test-admin-token";

const { startServer } = await import("../index.js");

const server = await startServer({ port: 0, host: "127.0.0.1" });
const address = server.address();

if (!address || typeof address === "string") {
  throw new Error("Unable to determine test server address.");
}

const baseUrl = `http://127.0.0.1:${address.port}`;

const requestJson = async (path, options = {}) => {
  const response = await fetch(`${baseUrl}${path}`, options);
  const body = await response.json();
  return { response, body };
};

test("health endpoint returns database summary", async () => {
  const { response, body } = await requestJson("/api/health");

  assert.equal(response.status, 200);
  assert.equal(body.ok, true);
  assert.ok(body.database);
  assert.ok(body.counts.talks > 0);
});

test("content endpoint returns talks and events", async () => {
  const { response, body } = await requestJson("/api/content");

  assert.equal(response.status, 200);
  assert.ok(Array.isArray(body.talks));
  assert.ok(Array.isArray(body.events));
});

test("protected submissions endpoints require admin token", async () => {
  const { response } = await requestJson("/api/submissions/contact");
  assert.equal(response.status, 401);
});

test("contact submission is persisted and listable", async () => {
  const unique = Date.now();
  const email = `contact-${unique}@example.com`;

  const create = await requestJson("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Test User",
      email,
      subject: "General Inquiry",
      message: "Hello from test",
    }),
  });

  assert.equal(create.response.status, 201);
  assert.equal(create.body.ok, true);

  const list = await requestJson("/api/submissions/contact", {
    headers: { "x-admin-token": "test-admin-token" },
  });

  assert.equal(list.response.status, 200);
  assert.equal(list.body.submissions.some((submission) => submission.email === email), true);
});

test("newsletter submission is persisted and listable", async () => {
  const unique = Date.now();
  const email = `newsletter-${unique}@example.com`;

  const create = await requestJson("/api/newsletter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  assert.equal(create.response.status, 200);
  assert.equal(create.body.ok, true);

  const list = await requestJson("/api/submissions/newsletter", {
    headers: { "x-admin-token": "test-admin-token" },
  });

  assert.equal(list.response.status, 200);
  assert.equal(list.body.subscribers.some((subscriber) => subscriber.email === email), true);
});

test.after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
});
