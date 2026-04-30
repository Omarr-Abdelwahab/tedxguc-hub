import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedContentPath = path.join(__dirname, "seed-content.json");
const localDbPath = path.join(__dirname, "data", "tedxguc.sqlite");

const readSeedContent = () => JSON.parse(fs.readFileSync(seedContentPath, "utf8"));

const writeSeedContent = async (seedContent, syncKeys = []) => {
  fs.writeFileSync(seedContentPath, JSON.stringify(seedContent, null, 2), "utf8");
  await syncLocalDatabase(seedContent, syncKeys);
  return seedContent;
};

const normalize = (value) => String(value || "").trim().toLowerCase();

const parseDateScore = (dateText) => {
  const timestamp = new Date(dateText).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const syncLocalDatabase = async (seedContent, keys) => {
  if (!fs.existsSync(localDbPath)) {
    return;
  }

  let Database;
  try {
    ({ default: Database } = await import("better-sqlite3"));
  } catch {
    return;
  }

  const db = new Database(localDbPath);
  db.exec(`
    CREATE TABLE IF NOT EXISTS content_items (
      key TEXT PRIMARY KEY,
      payload TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  const upsertContentItem = db.prepare(`
    INSERT INTO content_items (key, payload, updated_at)
    VALUES (@key, @payload, @updatedAt)
    ON CONFLICT(key) DO UPDATE SET
      payload = excluded.payload,
      updated_at = excluded.updated_at
  `);

  const selectedKeys = keys.length > 0 ? keys : ["talks", "events"];
  const updatedAt = new Date().toISOString();

  for (const key of selectedKeys) {
    if (seedContent[key] === undefined) {
      continue;
    }

    upsertContentItem.run({
      key,
      payload: JSON.stringify(seedContent[key]),
      updatedAt,
    });
  }

  db.close();
};

const replaceTalks = async (mutator) => {
  const seedContent = readSeedContent();
  const nextSeed = mutator(seedContent) || seedContent;
  return writeSeedContent(nextSeed, ["talks", "events"]);
};

const replaceEvents = async (mutator) => {
  const seedContent = readSeedContent();
  const nextSeed = mutator(seedContent) || seedContent;
  return writeSeedContent(nextSeed, ["events"]);
};

const removeTalksByTitle = (seedContent, titles) => {
  const titleSet = new Set(titles.map(normalize));
  seedContent.talks = seedContent.talks.filter((talk) => !titleSet.has(normalize(talk.title)));
};

const removeTalksById = (seedContent, ids) => {
  const idSet = new Set(ids.map(String));
  seedContent.talks = seedContent.talks.filter((talk) => !idSet.has(String(talk.id)));
};

const removeSpeakersFromEvents = (seedContent, speakerNames) => {
  const nameSet = new Set(speakerNames.map(normalize));

  seedContent.events = seedContent.events.map((event) => {
    event.speakers = (event.speakers || []).filter((speaker) => !nameSet.has(normalize(speaker.name)));
    return event;
  });
};

const getWhitespaceEvent = (seedContent) =>
  seedContent.events.find((event) => normalize(event.theme) === "whitespace");

const getUnderConstructionEvent = (seedContent) =>
  seedContent.events.find((event) => normalize(event.theme) === "underconstruction");

const newWhitespaceTalks = [
  {
    id: "18",
    title: "Beyond limits, different is beautiful",
    speaker: "Rania Abdelaziz & Alaa El Masry",
    speakerBio:
      "Rania Abdelaziz and Alaa El Masry are advocates for inclusion and accessibility. Their work focuses on challenging perceptions about disability and celebrating human diversity.",
    topic: "Social Impact",
    year: 2025,
    duration: "13:21",
    thumbnail: "https://i.ytimg.com/vi/mOudPoFxALk/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/mOudPoFxALk",
    socialLinks: [],
  },
  {
    id: "19",
    title: "Reclaiming Egypt's narrative",
    speaker: "Mahmoud Hawary",
    speakerBio:
      "Mahmoud Hawary is a cultural historian and filmmaker dedicated to preserving and promoting Egypt's rich historical narratives.",
    topic: "Culture",
    year: 2025,
    duration: "12:45",
    thumbnail: "https://i.ytimg.com/vi/bq29u6RAp1k/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/bq29u6RAp1k",
    socialLinks: [],
  },
  {
    id: "20",
    title: "From machines to bodies",
    speaker: "Yahya Hefnawi",
    speakerBio:
      "Yahya Hefnawi is an engineer and innovator exploring the intersection of technology and human physiology.",
    topic: "Technology",
    year: 2025,
    duration: "14:07",
    thumbnail: "https://i.ytimg.com/vi/for_-b3LyNI/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/for_-b3LyNI",
    socialLinks: [],
  },
  {
    id: "21",
    title: "Getting companies racing to hire you",
    speaker: "Youssef El Akkari",
    speakerBio:
      "Youssef El Akkari is a career coach and talent development specialist helping young professionals stand out.",
    topic: "Business",
    year: 2025,
    duration: "13:52",
    thumbnail: "https://i.ytimg.com/vi/odX9FKx23lI/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/odX9FKx23lI",
    socialLinks: [],
  },
  {
    id: "22",
    title: "Bridging the professional gap: The transformative power of network",
    speaker: "Ahmed El Helaly",
    speakerBio:
      "Ahmed El Helaly is a professional development coach emphasizing the transformative impact of strategic professional relationships.",
    topic: "Business",
    year: 2025,
    duration: "12:34",
    thumbnail: "https://i.ytimg.com/vi/Qbi4DUmDzcM/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/Qbi4DUmDzcM",
    socialLinks: [],
  },
  {
    id: "23",
    title: "It didn't start with you",
    speaker: "Shereen Rizk",
    speakerBio: "Shereen Rizk is a psychotherapist exploring generational trauma and healing.",
    topic: "Psychology",
    year: 2025,
    duration: "14:19",
    thumbnail: "https://i.ytimg.com/vi/Bx3yPK0YdJw/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/Bx3yPK0YdJw",
    socialLinks: [],
  },
  {
    id: "24",
    title: "Creating movie magic!",
    speaker: "Dibo",
    speakerBio: "Dibo is a filmmaker and visual effects artist passionate about bringing stories to life.",
    topic: "Arts, Media & Design",
    year: 2025,
    duration: "11:58",
    thumbnail: "https://i.ytimg.com/vi/hAVXYHQQyj8/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/hAVXYHQQyj8",
    socialLinks: [],
  },
  {
    id: "25",
    title: "Bringing the past to life",
    speaker: "Rowan El Selmy",
    speakerBio: "Rowan El Selmy is an archaeologist dedicated to uncovering and preserving historical narratives.",
    topic: "Culture",
    year: 2025,
    duration: "13:16",
    thumbnail: "https://i.ytimg.com/vi/Po9XC1c06Mw/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/Po9XC1c06Mw",
    socialLinks: [],
  },
];

const missingEventsTalks = {
  pillars: [
    { speaker: "Menna El Naggar", title: "The Human Experience : Stories that heal, inspire and transform", topic: "Human Sciences", year: 2025 },
    { speaker: "Nancy Maher", title: "The pillars within : simulated connection, real disconnection", topic: "Psychology", year: 2025 },
    { speaker: "Moaz Akram", title: "The points you never knew you were scoring", topic: "Personal Development", year: 2025 },
    { speaker: "Gohar Said", title: "Entrepreneurship's silent battles: the unfiltered truth", topic: "Business", year: 2025 },
    { speaker: "Roberto Joseph", title: "Signed out to sign in", topic: "Technology & Society", year: 2025 },
  ],
  glitch: [
    { speaker: "Mohamed Mohab", title: "From 1 to 8 Billion: How a single idea evolved into a global tech ecosystem", topic: "Technology", year: 2024 },
    { speaker: "Amir Roushdy", title: "From skepticism to Reality", topic: "Science", year: 2024 },
    { speaker: "Yara Hesham", title: "The unspoken impact of our commuting choices", topic: "Environment & Society", year: 2024 },
    { speaker: "Sherif El-Sayed", title: "Not just words: Language and Emotions, a Complex Relationship that affects our daily life", topic: "Psychology", year: 2024 },
    { speaker: "Yassin Mahgoub", title: "Cracking the code: How technology is driving medical progress", topic: "Health & Technology", year: 2024 },
    { speaker: "Haitham Gheita", title: "Grow through what you go through", topic: "Personal Development", year: 2024 },
    { speaker: "Sohaila Omar", title: "Ancient Traditions in modern lives: A journey through time", topic: "Culture & Society", year: 2024 },
    { speaker: "Manal Olama", title: "The white T-shirt crisis: Exploring the fashion revolution", topic: "Sustainability & Fashion", year: 2024 },
  ],
  echo: [
    { speaker: "Hanaa Medhat", title: "Words That Matter", topic: "Communication", year: 2024 },
    { speaker: "Menna Metwally", title: "The Echo of Our Choices", topic: "Philosophy", year: 2024 },
    { speaker: "Raghda Moataz", title: "Narratives That Shape Us", topic: "Culture", year: 2024 },
    { speaker: "Mamdouh Saud", title: "Resonance in a Noisy World", topic: "Human Connection", year: 2024 },
  ],
  allThatGlitters: [
    { speaker: "Carmine Cortolano", title: "Not All That Glitters: Seeing Through Illusions", topic: "Philosophy", year: 2021 },
    { speaker: "Youssef Mohsen", title: "The Hidden Value in Overlooked Things", topic: "Personal Development", year: 2021 },
  ],
  backAndForth: [
    { speaker: "Ali Aboulnasr", title: "Goal Of Equality", topic: "Social Justice", year: 2015 },
    { speaker: "Mohamed Rizkallah", title: "STEM-ED", topic: "Education & Technology", year: 2015 },
    { speaker: "Sue Ellen Hassouna", title: "Criminals in Suits", topic: "Business Ethics", year: 2015 },
    { speaker: "Carol Hammal", title: "Art therapy: a world beyond creative expression", topic: "Health & Arts", year: 2015 },
  ],
};

export const addWhitespaceVideos = async () =>
  replaceTalks((seedContent) => {
    seedContent.talks = seedContent.talks.concat(newWhitespaceTalks);

    const underConstructionEvent = getUnderConstructionEvent(seedContent);
    if (underConstructionEvent) {
      const newSpeakers = newWhitespaceTalks.map((talk) => ({
        name: talk.speaker,
        talkTitle: talk.title,
        topic: talk.topic,
      }));
      underConstructionEvent.speakers = (underConstructionEvent.speakers || []).concat(newSpeakers);
    }

    return seedContent;
  });

export const addMissingEvents = async () =>
  replaceTalks((seedContent) => {
    const maxId = Math.max(...seedContent.talks.map((talk) => parseInt(talk.id, 10)));
    let talkId = Number.isNaN(maxId) ? 1 : maxId + 1;
    const talkIdMap = {};

    Object.entries(missingEventsTalks).forEach(([eventKey, talks]) => {
      talkIdMap[eventKey] = [];
      talks.forEach((talkData) => {
        const newTalk = {
          id: String(talkId),
          title: talkData.title,
          speaker: talkData.speaker,
          speakerBio: `${talkData.speaker} is a thought leader and speaker at TEDxGUC.`,
          topic: talkData.topic,
          year: talkData.year,
          duration: "14:00",
          thumbnail: `https://images.unsplash.com/photo-${Math.random().toString(36).slice(2, 14)}?w=640&h=360&fit=crop`,
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          socialLinks: [],
        };

        seedContent.talks.push(newTalk);
        talkIdMap[eventKey].push(newTalk);
        talkId += 1;
      });
    });

    const genEventId = (theme, year) => `${year}-${theme.toLowerCase().replace(/\s+/g, "")}`;

    const newEvents = [
      {
        id: genEventId("The Pillars of Everything", 2025),
        year: 2025,
        season: "Spring",
        theme: "The Pillars of Everything",
        date: "May 17, 2025",
        venue: "GUC Main Auditorium, New Cairo",
        recap:
          'TEDxGUC "The Pillars of Everything" explored the silent convictions, formative experiences, and moments that hold us together when everything else shifts. In a world obsessed with outcomes, we often overlook what lies beneath.',
        speakers: talkIdMap.pillars.map((talk) => ({ name: talk.speaker, talkTitle: talk.title, topic: talk.topic })),
        gallery: [
          "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop",
          "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=500&fit=crop",
        ],
        sponsors: ["TED", "GUC"],
      },
      {
        id: genEventId("Glitch", 2024),
        year: 2024,
        season: "Fall",
        theme: "Glitch",
        date: "September 28, 2024",
        venue: "GUC Conference Center, New Cairo",
        recap:
          'TEDxGUC "Glitch" explored unexpected disruptions in our digital and physical worlds. From technological malfunctions to societal upheavals, glitches can be both destructive and transformative.',
        speakers: talkIdMap.glitch.map((talk) => ({ name: talk.speaker, talkTitle: talk.title, topic: talk.topic })),
        gallery: [
          "https://images.unsplash.com/photo-1519915212116-7cfef71f1b0a?w=800&h=500&fit=crop",
          "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop",
        ],
        sponsors: ["TED", "GUC"],
      },
      {
        id: genEventId("ECHO", 2024),
        year: 2024,
        season: "Spring",
        theme: "ECHO",
        date: "May 17, 2024",
        venue: "GUC Main Auditorium, New Cairo",
        recap:
          'Beyond the echoes of faint whispers and symphonies of words lies a million untold narratives. TEDxGUC ECHO explores the impact of words and opinions, posing the question: Will we separate the souls, artists and personalities from the opinions or will cancel culture thrive?',
        speakers: talkIdMap.echo.map((talk) => ({ name: talk.speaker, talkTitle: talk.title, topic: talk.topic })),
        gallery: [
          "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=500&fit=crop",
          "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=500&fit=crop",
        ],
        sponsors: ["TED", "GUC"],
      },
      {
        id: genEventId("All that glitters", 2021),
        year: 2021,
        season: "Fall",
        theme: "All that glitters",
        date: "September 18, 2021",
        venue: "GUC Main Auditorium, New Cairo",
        recap:
          "All that glitters is not gold. This event challenged perspectives on appearances and true value, exploring the lessons learned from both shiny surfaces and overlooked treasures.",
        speakers: talkIdMap.allThatGlitters.map((talk) => ({ name: talk.speaker, talkTitle: talk.title, topic: talk.topic })),
        gallery: [
          "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop",
          "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=500&fit=crop",
        ],
        sponsors: ["TED", "GUC"],
      },
      {
        id: genEventId("Back & forth", 2015),
        year: 2015,
        season: "Summer",
        theme: "Back & forth",
        date: "August 15, 2015",
        venue: "GUC Main Auditorium, New Cairo",
        recap:
          'Our world operates in a dynamic design of opposite yet complementary forces. TEDxGUC "Back & Forth" explores how life exists in constant motion between opposing yet complementary states.',
        speakers: talkIdMap.backAndForth.map((talk) => ({ name: talk.speaker, talkTitle: talk.title, topic: talk.topic })),
        gallery: [
          "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop",
          "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=500&fit=crop",
        ],
        sponsors: ["TED", "GUC"],
      },
    ];

    seedContent.events = seedContent.events.filter((event) => event.id !== "2024-echo");
    seedContent.events.push(...newEvents, {
      id: "2024-echo-corrected",
      year: 2024,
      season: "Spring",
      theme: "ECHO",
      date: "May 17, 2024",
      venue: "GUC Main Auditorium, New Cairo",
      recap:
        'Beyond the echoes of faint whispers and symphonies of words lies a million untold narratives. TEDxGUC ECHO explores the impact of words and opinions, posing the question: Will we separate the souls, artists and personalities from the opinions or will cancel culture thrive?',
      speakers: talkIdMap.echo.map((talk) => ({ name: talk.speaker, talkTitle: talk.title, topic: talk.topic })),
      gallery: [
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=500&fit=crop",
      ],
      sponsors: ["TED", "GUC"],
    });

    if (!seedContent.events.some((event) => normalize(event.theme) === "alloy")) {
      seedContent.events.push({
        id: "2017-alloy",
        year: 2017,
        season: "Fall",
        theme: "ALLOY",
        date: "September 2017",
        venue: "GUC Conference Center, New Cairo",
        recap:
          "An alloy is a compound mixture or union of distinct parties that exchange characteristics to optimize a desired outcome. TEDxGUC ALLOY explored how diverse elements combine to create stronger solutions.",
        speakers: seedContent.talks
          .filter((talk) => [9, 10, 11, 12, 13, 14, 15, 16, 17].includes(parseInt(talk.id, 10)))
          .map((talk) => ({ name: talk.speaker, talkTitle: talk.title, topic: talk.topic })),
        gallery: [
          "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop",
          "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=500&fit=crop",
        ],
        sponsors: ["TED", "GUC"],
      });
    }

    return seedContent;
  });

export const removeEmptyTalks = async () =>
  replaceTalks((seedContent) => {
    seedContent.talks = seedContent.talks.filter((talk) => parseInt(talk.id, 10) < 26);
    removeSpeakersFromEvents(seedContent, [
      "Menna El Naggar",
      "Nancy Maher",
      "Moaz Akram",
      "Gohar Said",
      "Roberto Joseph",
      "Mohamed Mohab",
      "Amir Roushdy",
      "Yara Hesham",
      "Sherif El-Sayed",
      "Yassin Mahgoub",
      "Haitham Gheita",
      "Sohaila Omar",
      "Manal Olama",
      "Hanaa Medhat",
      "Menna Metwally",
      "Raghda Moataz",
      "Mamdouh Saud",
      "Carmine Cortolano",
      "Youssef Mohsen",
      "Ali Aboulnasr",
      "Mohamed Rizkallah",
      "Sue Ellen Hassouna",
      "Carol Hammal",
    ]);
    return seedContent;
  });

export const removeEvents = async () =>
  replaceEvents((seedContent) => {
    seedContent.events = seedContent.events.filter((event) => {
      if (normalize(event.theme) === "uncharted") return false;
      if (normalize(event.theme) === "mosaic") return false;
      return event.id !== "2024-echo-corrected";
    });
    return seedContent;
  });

export const removeMusicMedicine = async () =>
  replaceTalks((seedContent) => {
    removeTalksByTitle(seedContent, ["Music as Medicine"]);
    removeSpeakersFromEvents(seedContent, ["Salma Khaled"]);
    return seedContent;
  });

export const removeTalks = async () =>
  replaceTalks((seedContent) => {
    removeTalksByTitle(seedContent, [
      "The Power of Vulnerability",
      "Rethinking Education in the AI Era",
      "Design Thinking for Social Impact",
      "Breaking the Silence on Mental Health",
      "Sustainable Cities: A Blueprint",
      "The Art of Storytelling",
      "Entrepreneurship in Emerging Markets",
    ]);

    removeSpeakersFromEvents(seedContent, [
      "Amira Hassan",
      "Omar El-Sayed",
      "Layla Mansour",
      "Karim Nabil",
      "Nour Abdelrahman",
      "Yasmin Farouk",
      "Ahmed Soliman",
    ]);

    return seedContent;
  });

export const removeWhitespaceSpeakers = async () =>
  replaceEvents((seedContent) => {
    const whitespaceEvent = getWhitespaceEvent(seedContent);
    if (whitespaceEvent) {
      whitespaceEvent.speakers = (whitespaceEvent.speakers || []).filter(
        (speaker) => !["Abdelrahman Ghareeb", "Aida Shaaban", "Rami Hamdi"].includes(speaker.name),
      );
    }

    return seedContent;
  });

export const sortEventsByDate = async () =>
  replaceEvents((seedContent) => {
    seedContent.events.sort((left, right) => parseDateScore(left.date) - parseDateScore(right.date));
    return seedContent;
  });

export const syncEvents = async () => {
  const seedContent = readSeedContent();
  await syncLocalDatabase(seedContent, ["events"]);
  return { updated: true, events: seedContent.events.length };
};

export const updateTalks = async () => {
  const seedContent = readSeedContent();
  await syncLocalDatabase(seedContent, ["talks"]);
  return { updated: true, talks: seedContent.talks.length };
};

export const verifyData = async () => {
  const seedContent = readSeedContent();
  const report = {
    duplicateEchoEvents: [],
    talkCount: seedContent.talks.length,
    eventCount: seedContent.events.length,
  };

  const echoEvents = seedContent.events.filter((event) => normalize(event.theme) === "echo");
  if (echoEvents.length > 1) {
    report.duplicateEchoEvents = echoEvents.map((event) => ({ id: event.id, date: event.date, speakers: (event.speakers || []).length }));
    const firstEchoId = echoEvents[0].id;
    seedContent.events = seedContent.events.filter((event) => normalize(event.theme) !== "echo" || event.id === firstEchoId);
    await writeSeedContent(seedContent, ["events", "talks"]);
    report.cleanedDuplicateEchoEvents = true;
  }

  return report;
};

export const checkTalks = async () => {
  const seedContent = readSeedContent();
  const talks = seedContent.talks.filter((talk) => {
    const numericId = parseInt(talk.id, 10);
    return numericId >= 26 && numericId <= 48;
  });

  return talks.map((talk) => ({
    id: talk.id,
    speaker: talk.speaker,
    title: talk.title,
    hasVideoUrl: Boolean(talk.videoUrl),
    hasThumbnail: Boolean(talk.thumbnail),
  }));
};

export const cleanPlaceholderVideos = async () =>
  replaceTalks((seedContent) => {
    const replacements = {
      mOudPoFxALk: { title: "Beyond limits, different is beautiful", speaker: "Rania Abdelaziz & Alaa El Masry" },
      bq29u6RAp1k: { title: "Reclaiming Egypt's narrative", speaker: "Mahmoud Hawary" },
      "for_-b3LyNI": { title: "From machines to bodies", speaker: "Yahya Hefnawi" },
      odX9FKx23lI: { title: "Getting companies racing to hire you", speaker: "Youssef El Akkari" },
      Qbi4DUmDzcM: { title: "Bridging the professional gap: The transformative power of network", speaker: "Ahmed El Helaly" },
      Bx3yPK0YdJw: { title: "It didn't start with you", speaker: "Shereen Rizk" },
      hAVXYHQQyj8: { title: "Creating movie magic!", speaker: "Dibo" },
      Po9XC1c06Mw: { title: "Bringing the past to life", speaker: "Rowan El Selmy" },
    };

    seedContent.talks = seedContent.talks.map((talk) => {
      const match = replacements[talk.videoId];
      if (!match) {
        return talk;
      }

      return {
        ...talk,
        title: talk.title || match.title,
        speaker: talk.speaker || match.speaker,
      };
    });

    return seedContent;
  });

export const inspectWhitespaceEvent = async () => {
  const seedContent = readSeedContent();
  const whitespaceEvent = getWhitespaceEvent(seedContent);

  return {
    found: Boolean(whitespaceEvent),
    event: whitespaceEvent || null,
    availableEvents: seedContent.events.map((event) => ({ theme: event.theme, season: event.season, year: event.year })),
  };
};

export const reloadSeedContent = async () => {
  const seedContent = readSeedContent();
  const allKeys = [
    "talks",
    "events",
    "sponsors",
    "orgTreesBySeason",
    "upcomingEvent",
    "upcomingSchedule",
    "upcomingFAQs",
    "upcomingSpeakers",
    "contactSubjects",
  ];
  await syncLocalDatabase(seedContent, allKeys);
  return { ok: true, message: "Seed content reloaded successfully from seed-content.json" };
};

export default {
  addWhitespaceVideos,
  addMissingEvents,
  removeEmptyTalks,
  removeEvents,
  removeMusicMedicine,
  removeTalks,
  removeWhitespaceSpeakers,
  sortEventsByDate,
  syncEvents,
  updateTalks,
  verifyData,
  checkTalks,
  cleanPlaceholderVideos,
  inspectWhitespaceEvent,
  reloadSeedContent,
};
