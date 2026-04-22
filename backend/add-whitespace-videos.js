import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedContentPath = path.join(__dirname, "seed-content.json");
let seedContent = JSON.parse(fs.readFileSync(seedContentPath, "utf8"));

// New talks to add
const newTalks = [
  {
    "id": "18",
    "title": "Beyond limits, different is beautiful",
    "speaker": "Rania Abdelaziz & Alaa El Masry",
    "speakerBio": "Rania Abdelaziz and Alaa El Masry are advocates for inclusion and accessibility. Their work focuses on challenging perceptions about disability and celebrating human diversity.",
    "topic": "Social Impact",
    "year": 2025,
    "duration": "13:21",
    "thumbnail": "https://i.ytimg.com/vi/mOudPoFxALk/maxresdefault.jpg",
    "videoUrl": "https://www.youtube.com/embed/mOudPoFxALk",
    "socialLinks": []
  },
  {
    "id": "19",
    "title": "Reclaiming Egypt's narrative",
    "speaker": "Mahmoud Hawary",
    "speakerBio": "Mahmoud Hawary is a cultural historian and filmmaker dedicated to preserving and promoting Egypt's rich historical narratives.",
    "topic": "Culture",
    "year": 2025,
    "duration": "12:45",
    "thumbnail": "https://i.ytimg.com/vi/bq29u6RAp1k/maxresdefault.jpg",
    "videoUrl": "https://www.youtube.com/embed/bq29u6RAp1k",
    "socialLinks": []
  },
  {
    "id": "20",
    "title": "From machines to bodies",
    "speaker": "Yahya Hefnawi",
    "speakerBio": "Yahya Hefnawi is an engineer and innovator exploring the intersection of technology and human physiology.",
    "topic": "Technology",
    "year": 2025,
    "duration": "14:07",
    "thumbnail": "https://i.ytimg.com/vi/for_-b3LyNI/maxresdefault.jpg",
    "videoUrl": "https://www.youtube.com/embed/for_-b3LyNI",
    "socialLinks": []
  },
  {
    "id": "21",
    "title": "Getting companies racing to hire you",
    "speaker": "Youssef El Akkari",
    "speakerBio": "Youssef El Akkari is a career coach and talent development specialist helping young professionals stand out.",
    "topic": "Business",
    "year": 2025,
    "duration": "13:52",
    "thumbnail": "https://i.ytimg.com/vi/odX9FKx23lI/maxresdefault.jpg",
    "videoUrl": "https://www.youtube.com/embed/odX9FKx23lI",
    "socialLinks": []
  },
  {
    "id": "22",
    "title": "Bridging the professional gap: The transformative power of network",
    "speaker": "Ahmed El Helaly",
    "speakerBio": "Ahmed El Helaly is a professional development coach emphasizing the transformative impact of strategic professional relationships.",
    "topic": "Business",
    "year": 2025,
    "duration": "12:34",
    "thumbnail": "https://i.ytimg.com/vi/Qbi4DUmDzcM/maxresdefault.jpg",
    "videoUrl": "https://www.youtube.com/embed/Qbi4DUmDzcM",
    "socialLinks": []
  },
  {
    "id": "23",
    "title": "It didn't start with you",
    "speaker": "Shereen Rizk",
    "speakerBio": "Shereen Rizk is a psychotherapist exploring generational trauma and healing.",
    "topic": "Psychology",
    "year": 2025,
    "duration": "14:19",
    "thumbnail": "https://i.ytimg.com/vi/Bx3yPK0YdJw/maxresdefault.jpg",
    "videoUrl": "https://www.youtube.com/embed/Bx3yPK0YdJw",
    "socialLinks": []
  },
  {
    "id": "24",
    "title": "Creating movie magic!",
    "speaker": "Dibo",
    "speakerBio": "Dibo is a filmmaker and visual effects artist passionate about bringing stories to life.",
    "topic": "Arts, Media & Design",
    "year": 2025,
    "duration": "11:58",
    "thumbnail": "https://i.ytimg.com/vi/hAVXYHQQyj8/maxresdefault.jpg",
    "videoUrl": "https://www.youtube.com/embed/hAVXYHQQyj8",
    "socialLinks": []
  },
  {
    "id": "25",
    "title": "Bringing the past to life",
    "speaker": "Rowan El Selmy",
    "speakerBio": "Rowan El Selmy is an archaeologist dedicated to uncovering and preserving historical narratives.",
    "topic": "Culture",
    "year": 2025,
    "duration": "13:16",
    "thumbnail": "https://i.ytimg.com/vi/Po9XC1c06Mw/maxresdefault.jpg",
    "videoUrl": "https://www.youtube.com/embed/Po9XC1c06Mw",
    "socialLinks": []
  }
];

// Add new talks to talks array
seedContent.talks = seedContent.talks.concat(newTalks);

// Add speakers to UnderConstruction event
const eventIndex = seedContent.events.findIndex(e => e.theme === "UnderConstruction");
if (eventIndex !== -1) {
  const newSpeakers = [
    { name: "Rania Abdelaziz & Alaa El Masry", talkTitle: "Beyond limits, different is beautiful", topic: "Social Impact" },
    { name: "Mahmoud Hawary", talkTitle: "Reclaiming Egypt's narrative", topic: "Culture" },
    { name: "Yahya Hefnawi", talkTitle: "From machines to bodies", topic: "Technology" },
    { name: "Youssef El Akkari", talkTitle: "Getting companies racing to hire you", topic: "Business" },
    { name: "Ahmed El Helaly", talkTitle: "Bridging the professional gap: The transformative power of network", topic: "Business" },
    { name: "Shereen Rizk", talkTitle: "It didn't start with you", topic: "Psychology" },
    { name: "Dibo", talkTitle: "Creating movie magic!", topic: "Arts, Media & Design" },
    { name: "Rowan El Selmy", talkTitle: "Bringing the past to life", topic: "Culture" }
  ];
  
  seedContent.events[eventIndex].speakers = seedContent.events[eventIndex].speakers.concat(newSpeakers);
  
  // Save updated seed content
  fs.writeFileSync(seedContentPath, JSON.stringify(seedContent, null, 2));
  
  console.log("✓ Added 8 new talks to seed-content.json");
  console.log("✓ Added 8 speakers to UnderConstruction event");
  console.log("\nNew speakers added:");
  newSpeakers.forEach((s, i) => {
    console.log(`  ${i+1}. ${s.name} - "${s.talkTitle}"`);
  });
} else {
  console.log("Error: UnderConstruction event not found");
}
