export interface Talk {
  id: string;
  title: string;
  speaker: string;
  speakerBio: string;
  topic: string;
  year: number;
  duration: string;
  thumbnail: string;
  videoUrl: string;
  socialLinks: { platform: string; url: string }[];
}

export interface OrgNode {
  id: string;
  title: string;
  name: string;
  level: 1 | 2 | 3;
  description: string;
  children?: OrgNode[];
}

export interface TEDxEvent {
  id: string;
  year: number;
  season: string;
  theme: string;
  date: string;
  venue: string;
  recap: string;
  speakers: { name: string; talkTitle: string; topic: string }[];
  gallery: string[];
  sponsors: string[];
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface ScheduleItem {
  time: string;
  title: string;
  description: string;
  type: "talk" | "break" | "activity";
}

export const talks: Talk[] = [
  {
    id: "1",
    title: "The Power of Vulnerability",
    speaker: "Amira Hassan",
    speakerBio: "Amira is a psychologist and researcher focused on emotional resilience and human connection at the German University in Cairo.",
    topic: "Psychology",
    year: 2024,
    duration: "18:04",
    thumbnail: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=640&h=360&fit=crop",
    videoUrl: "https://www.youtube.com/embed/iCvmsMzlF7o",
    socialLinks: [
      { platform: "LinkedIn", url: "#" },
      { platform: "Twitter", url: "#" },
    ],
  },
  {
    id: "2",
    title: "Rethinking Education in the AI Era",
    speaker: "Omar El-Sayed",
    speakerBio: "Omar is an AI researcher and education advocate pushing for curriculum reform in MENA universities.",
    topic: "Technology",
    year: 2024,
    duration: "14:22",
    thumbnail: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=640&h=360&fit=crop",
    videoUrl: "https://www.youtube.com/embed/iCvmsMzlF7o",
    socialLinks: [{ platform: "LinkedIn", url: "#" }],
  },
  {
    id: "3",
    title: "Design Thinking for Social Impact",
    speaker: "Layla Mansour",
    speakerBio: "Layla is a UX designer who uses human-centered design to solve community challenges in underserved areas.",
    topic: "Design",
    year: 2023,
    duration: "16:45",
    thumbnail: "https://images.unsplash.com/photo-1559223607-a43c990c692c?w=640&h=360&fit=crop",
    videoUrl: "https://www.youtube.com/embed/iCvmsMzlF7o",
    socialLinks: [
      { platform: "Instagram", url: "#" },
      { platform: "LinkedIn", url: "#" },
    ],
  },
  {
    id: "4",
    title: "Breaking the Silence on Mental Health",
    speaker: "Karim Nabil",
    speakerBio: "Karim is a clinical psychologist and mental health advocate working to destigmatize therapy in Egyptian society.",
    topic: "Health",
    year: 2023,
    duration: "20:10",
    thumbnail: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=640&h=360&fit=crop",
    videoUrl: "https://www.youtube.com/embed/iCvmsMzlF7o",
    socialLinks: [{ platform: "Twitter", url: "#" }],
  },
  {
    id: "5",
    title: "Sustainable Cities: A Blueprint",
    speaker: "Nour Abdelrahman",
    speakerBio: "Nour is an urban planner envisioning sustainable cities across North Africa with green infrastructure.",
    topic: "Environment",
    year: 2024,
    duration: "15:30",
    thumbnail: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=640&h=360&fit=crop",
    videoUrl: "https://www.youtube.com/embed/iCvmsMzlF7o",
    socialLinks: [
      { platform: "LinkedIn", url: "#" },
      { platform: "Instagram", url: "#" },
    ],
  },
  {
    id: "6",
    title: "The Art of Storytelling",
    speaker: "Yasmin Farouk",
    speakerBio: "Yasmin is an author and narrative designer who believes stories can reshape cultures and drive change.",
    topic: "Culture",
    year: 2022,
    duration: "12:58",
    thumbnail: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=640&h=360&fit=crop",
    videoUrl: "https://www.youtube.com/embed/iCvmsMzlF7o",
    socialLinks: [
      { platform: "Twitter", url: "#" },
      { platform: "LinkedIn", url: "#" },
    ],
  },
  {
    id: "7",
    title: "Entrepreneurship in Emerging Markets",
    speaker: "Ahmed Soliman",
    speakerBio: "Ahmed is a serial entrepreneur who has built three startups across fintech and edtech in Egypt.",
    topic: "Business",
    year: 2022,
    duration: "17:33",
    thumbnail: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=640&h=360&fit=crop",
    videoUrl: "https://www.youtube.com/embed/iCvmsMzlF7o",
    socialLinks: [{ platform: "LinkedIn", url: "#" }],
  },
  {
    id: "8",
    title: "Music as Medicine",
    speaker: "Salma Khaled",
    speakerBio: "Salma is a music therapist exploring how sound and rhythm can heal trauma and foster emotional growth.",
    topic: "Health",
    year: 2024,
    duration: "13:47",
    thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=640&h=360&fit=crop",
    videoUrl: "https://www.youtube.com/embed/iCvmsMzlF7o",
    socialLinks: [{ platform: "Instagram", url: "#" }],
  },
];

export const topics = [...new Set(talks.map((t) => t.topic))];
export const years = [...new Set(talks.map((t) => t.year))].sort((a, b) => b - a);

// Org trees by season
const orgTree2025: OrgNode = {
  id: "chairman",
  title: "Chairman",
  name: "Dr. Mohamed Ashraf",
  level: 1,
  description:
    "The Chairman oversees the entire TEDxGUC operation, ensuring the event aligns with TED's mission of spreading ideas worth sharing. Responsible for strategic direction and external partnerships.",
  children: [
    {
      id: "curator-talks",
      title: "Curator — Talks",
      name: "Sara Youssef",
      level: 2,
      description: "Leads the Talks division, curating speakers and ensuring content quality aligns with the event's theme.",
      children: [
        { id: "exec-coaching", title: "Coaching", name: "Mariam Adel", level: 3, description: "Coaches and mentors speakers through rehearsals, presentation skills workshops, and talk refinement sessions." },
        { id: "exec-research", title: "Research & Production", name: "Hassan Tarek", level: 3, description: "Conducts in-depth research to support speakers and manages the production pipeline from script to stage." },
      ],
    },
    {
      id: "curator-operations",
      title: "Curator — Operations",
      name: "Khaled Mostafa",
      level: 2,
      description: "Manages all operational logistics, event planning, and day-of execution to ensure seamless delivery.",
      children: [
        { id: "exec-events", title: "Events Management", name: "Dina Sherif", level: 3, description: "Plans and executes all event activities including venue management, scheduling, and on-site coordination." },
        { id: "exec-partnerships", title: "Partnerships", name: "Ali Mahmoud", level: 3, description: "Builds and maintains relationships with sponsors, partners, and stakeholders." },
        { id: "exec-logistics", title: "Logistics", name: "Rana Hossam", level: 3, description: "Handles all logistical operations including transportation, equipment, catering, and venue setup." },
      ],
    },
    {
      id: "curator-od",
      title: "Curator — Organizational Development",
      name: "Mona Ibrahim",
      level: 2,
      description: "Focuses on team growth, internal culture, and organizational excellence across all divisions.",
      children: [
        { id: "exec-assoc-dev", title: "Associate Development", name: "Youssef Gamal", level: 3, description: "Develops training programs and growth pathways for new associates joining the TEDxGUC team." },
        { id: "exec-assoc-exp", title: "Associate Experience", name: "Farida Nasser", level: 3, description: "Ensures a positive and engaging experience for all team members through events, feedback systems, and team bonding." },
      ],
    },
    {
      id: "curator-marketing",
      title: "Curator — Marketing & Coordination",
      name: "Tamer Wael",
      level: 2,
      description: "Directs all marketing, branding, and communication strategies to amplify the TEDxGUC message.",
      children: [
        { id: "exec-media", title: "Media & Design", name: "Nada Emad", level: 3, description: "Creates all visual content including graphics, videos, and social media assets that define the TEDxGUC brand." },
        { id: "exec-campaigns", title: "Campaigns & Copywriting", name: "Ziad Ayman", level: 3, description: "Develops marketing campaigns, writes compelling copy, and manages content calendars across all channels." },
      ],
    },
  ],
};

const orgTree2026: OrgNode = {
  id: "chairman",
  title: "Chairman",
  name: "Laila Mahmoud",
  level: 1,
  description:
    "Leading TEDxGUC into 2026 with a renewed vision for cross-disciplinary dialogue and community impact.",
  children: [
    {
      id: "curator-talks",
      title: "Curator — Talks",
      name: "Yara Fathi",
      level: 2,
      description: "Curating a diverse lineup of speakers who challenge conventional thinking.",
      children: [
        { id: "exec-coaching", title: "Coaching", name: "Nabil Samir", level: 3, description: "Guiding speakers through intensive coaching to deliver impactful talks." },
        { id: "exec-research", title: "Research & Production", name: "Hana Mostafa", level: 3, description: "Researching cutting-edge topics and managing production workflows." },
      ],
    },
    {
      id: "curator-operations",
      title: "Curator — Operations",
      name: "Tarek Adel",
      level: 2,
      description: "Ensuring flawless event execution from planning to post-event wrap-up.",
      children: [
        { id: "exec-events", title: "Events Management", name: "Salma Reda", level: 3, description: "Coordinating all event logistics and attendee experience." },
        { id: "exec-partnerships", title: "Partnerships", name: "Mahmoud Karim", level: 3, description: "Securing strategic partnerships and sponsor relations." },
        { id: "exec-logistics", title: "Logistics", name: "Lina Gamal", level: 3, description: "Managing all on-ground logistics and vendor coordination." },
      ],
    },
    {
      id: "curator-od",
      title: "Curator — Organizational Development",
      name: "Dalia Essam",
      level: 2,
      description: "Building a stronger, more connected team culture.",
      children: [
        { id: "exec-assoc-dev", title: "Associate Development", name: "Omar Hossam", level: 3, description: "Creating growth opportunities and mentorship programs for associates." },
        { id: "exec-assoc-exp", title: "Associate Experience", name: "Menna Ahmed", level: 3, description: "Designing engaging team experiences and well-being initiatives." },
      ],
    },
    {
      id: "curator-marketing",
      title: "Curator — Marketing & Coordination",
      name: "Rami Sherif",
      level: 2,
      description: "Amplifying TEDxGUC's reach through innovative marketing strategies.",
      children: [
        { id: "exec-media", title: "Media & Design", name: "Jana Wael", level: 3, description: "Producing visual storytelling content across all platforms." },
        { id: "exec-campaigns", title: "Campaigns & Copywriting", name: "Kareem Nour", level: 3, description: "Crafting compelling narratives and managing multi-channel campaigns." },
      ],
    },
  ],
};

export const orgTreesBySeason: Record<string, OrgNode> = {
  "2025": orgTree2025,
  "2026": orgTree2026,
};

// Keep backward compat
export const orgTree = orgTree2025;

// Events archive
export const events: TEDxEvent[] = [
  {
    id: "2024-spring",
    year: 2024,
    season: "Spring",
    theme: "Redefining Tomorrow",
    date: "April 12, 2024",
    venue: "GUC Main Auditorium, New Cairo",
    recap: "Our 2024 Spring event brought together 8 speakers across technology, health, design, and culture to explore how we can redefine the future. With over 400 attendees, the event featured immersive experiences, networking sessions, and thought-provoking talks that challenged conventional thinking.",
    speakers: [
      { name: "Amira Hassan", talkTitle: "The Power of Vulnerability", topic: "Psychology" },
      { name: "Omar El-Sayed", talkTitle: "Rethinking Education in the AI Era", topic: "Technology" },
      { name: "Nour Abdelrahman", talkTitle: "Sustainable Cities: A Blueprint", topic: "Environment" },
      { name: "Salma Khaled", talkTitle: "Music as Medicine", topic: "Health" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&h=500&fit=crop",
    ],
    sponsors: ["TED", "GUC", "Vodafone Egypt", "Microsoft Egypt"],
  },
  {
    id: "2023-fall",
    year: 2023,
    season: "Fall",
    theme: "Uncharted",
    date: "November 18, 2023",
    venue: "GUC Conference Center, New Cairo",
    recap: "TEDxGUC 'Uncharted' explored the unknown territories of human potential. From design thinking to mental health advocacy, our speakers pushed audiences to venture beyond their comfort zones.",
    speakers: [
      { name: "Layla Mansour", talkTitle: "Design Thinking for Social Impact", topic: "Design" },
      { name: "Karim Nabil", talkTitle: "Breaking the Silence on Mental Health", topic: "Health" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1559223607-a43c990c692c?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=500&fit=crop",
    ],
    sponsors: ["TED", "GUC", "Orange Egypt"],
  },
  {
    id: "2022-spring",
    year: 2022,
    season: "Spring",
    theme: "Mosaic",
    date: "March 25, 2022",
    venue: "GUC Main Auditorium, New Cairo",
    recap: "Our 'Mosaic' event celebrated the beauty of diverse perspectives coming together. Speakers shared stories of entrepreneurship, storytelling, and cultural preservation.",
    speakers: [
      { name: "Yasmin Farouk", talkTitle: "The Art of Storytelling", topic: "Culture" },
      { name: "Ahmed Soliman", talkTitle: "Entrepreneurship in Emerging Markets", topic: "Business" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=500&fit=crop",
    ],
    sponsors: ["TED", "GUC", "Etisalat Egypt"],
  },
];

export const eventYears = [...new Set(events.map((e) => e.year))].sort((a, b) => b - a);

// Upcoming event data
export const upcomingEvent = {
  theme: "Catalyst",
  date: "October 18, 2026",
  venue: "GUC Main Auditorium, New Cairo",
  description: "Ideas that ignite change. TEDxGUC 'Catalyst' will bring together innovators, artists, and thinkers who spark transformation in their communities.",
};

export const upcomingSchedule: ScheduleItem[] = [
  { time: "09:00", title: "Doors Open & Registration", description: "Check-in, grab your badge, and enjoy coffee.", type: "activity" },
  { time: "10:00", title: "Opening Remarks", description: "Welcome by the TEDxGUC Chairman.", type: "talk" },
  { time: "10:15", title: "Session 1 — Spark", description: "Three talks exploring the origins of transformative ideas.", type: "talk" },
  { time: "11:30", title: "Networking Break", description: "Connect with fellow attendees over refreshments.", type: "break" },
  { time: "12:00", title: "Session 2 — Ignite", description: "Three talks on turning ideas into action.", type: "talk" },
  { time: "13:15", title: "Lunch Break", description: "Catered lunch and interactive experience booths.", type: "break" },
  { time: "14:30", title: "Session 3 — Transform", description: "Three closing talks on lasting impact and legacy.", type: "talk" },
  { time: "16:00", title: "Closing & Networking", description: "Closing remarks followed by open networking.", type: "activity" },
];

export const upcomingFAQs: FAQ[] = [
  { question: "What is the dress code?", answer: "Smart casual is recommended. Please dress comfortably as the event runs for a full day. Avoid overly casual attire like shorts or flip-flops." },
  { question: "Are refunds available?", answer: "Tickets are non-refundable but transferable. If you can't attend, you may transfer your ticket to someone else by contacting us at least 48 hours before the event." },
  { question: "What is the filming policy?", answer: "Professional filming will take place throughout the event. By attending, you consent to being photographed or filmed. Personal recording of talks is not permitted." },
  { question: "Is parking available?", answer: "Free parking is available at the GUC campus. We recommend arriving early as spaces fill up quickly." },
  { question: "Can I bring a guest?", answer: "Each ticket admits one person. If you'd like to bring a guest, they will need their own ticket." },
];

export const upcomingSpeakers = [
  { name: "To Be Announced", topic: "Innovation & Technology" },
  { name: "To Be Announced", topic: "Social Impact" },
  { name: "To Be Announced", topic: "Arts & Culture" },
  { name: "To Be Announced", topic: "Science & Health" },
  { name: "To Be Announced", topic: "Entrepreneurship" },
  { name: "To Be Announced", topic: "Education" },
];
