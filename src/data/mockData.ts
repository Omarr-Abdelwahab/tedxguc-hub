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
  imageUrl: string;
  committeeDescription: string;
  memberBio?: string;
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
  title: "Chairwoman",
  name: "Sama El-Badrawy",
  level: 1,
  imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
  description: "The Chairman oversees the entire TEDxGUC operation, ensuring the event aligns with TED's mission of spreading ideas worth sharing.",
  committeeDescription: "The Chairman's office sets the strategic direction for the entire TEDxGUC organization. Responsible for external partnerships, TED licensing compliance, and ensuring every division works in harmony toward delivering a world-class event.",
  memberBio: "Sama is a senior engineering student at GUC with a passion for community building and public speaking. She has led TEDxGUC through its most ambitious season yet.",
  children: [
    {
      id: "curator-talks",
      title: "Curator — Talks",
      name: "Yehia Amr",
      level: 2,
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
      description: "Leads the Talks division, curating speakers and ensuring content quality aligns with the event's theme.",
      committeeDescription: "The Talks division is the heart of TEDxGUC. This team scouts, selects, and develops speakers — ensuring every talk is compelling, well-researched, and delivered with impact.",
      memberBio: "Yehia is a media and communications major who believes in the transformative power of storytelling.",
      children: [
        { id: "exec-coaching", title: "Coaching", name: "Mariam Adel", level: 3, imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face", description: "Coaches speakers through rehearsals and presentation skills workshops.", committeeDescription: "The Coaching committee works one-on-one with speakers to refine their narratives, improve delivery, and ensure every talk resonates with the audience.", memberBio: "Mariam is a psychology student with experience in public speaking coaching and debate." },
        { id: "exec-research", title: "Research & Production", name: "Hassan Tarek", level: 3, imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face", description: "Conducts research to support speakers and manages the production pipeline.", committeeDescription: "Research & Production ensures every talk is backed by solid research and produced to the highest standards — from script development to stage design.", memberBio: "Hassan is a political science student with a keen eye for detail and a love for investigative research." },
      ],
    },
    {
      id: "curator-operations",
      title: "Curator — Operations",
      name: "Kareem Shawish",
      level: 2,
      imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
      description: "Manages all operational logistics, event planning, and day-of execution.",
      committeeDescription: "Operations is the backbone of TEDxGUC. From venue logistics to vendor management, this division ensures every detail is accounted for so the event runs flawlessly.",
      memberBio: "Kareem is a business administration student known for his meticulous planning and calm leadership under pressure.",
      children: [
        { id: "exec-events", title: "Events Management", name: "Dina Sherif", level: 3, imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face", description: "Plans and executes all event activities.", committeeDescription: "Events Management handles venue coordination, scheduling, and on-site attendee experience from doors-open to closing remarks.", memberBio: "Dina is an architecture student who brings her spatial awareness and creativity to event design." },
        { id: "exec-partnerships", title: "Partnerships", name: "Ali Mahmoud", level: 3, imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face", description: "Builds relationships with sponsors and stakeholders.", committeeDescription: "Partnerships secures sponsorships and strategic alliances that fund and elevate the TEDxGUC experience.", memberBio: "Ali is a finance student with strong networking skills and a talent for negotiation." },
        { id: "exec-logistics", title: "Logistics", name: "Rana Hossam", level: 3, imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face", description: "Handles transportation, equipment, catering, and venue setup.", committeeDescription: "Logistics manages the physical infrastructure of the event — from equipment rental and catering to transportation and setup.", memberBio: "Rana is an industrial engineering student who thrives on solving complex logistical puzzles." },
      ],
    },
    {
      id: "curator-od",
      title: "Curator — OD",
      name: "Hazem Talhawy",
      level: 2,
      imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face",
      description: "Focuses on team growth, internal culture, and organizational excellence.",
      committeeDescription: "Organizational Development nurtures the TEDxGUC team itself — running training programs, building culture, and ensuring every member grows alongside the organization.",
      memberBio: "Hazem is a management student passionate about leadership development and team dynamics.",
      children: [
        { id: "exec-assoc-dev", title: "Associate Development", name: "Youssef Gamal", level: 3, imageUrl: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&h=200&fit=crop&crop=face", description: "Develops training programs for new associates.", committeeDescription: "Associate Development creates onboarding programs, workshops, and mentorship tracks for new team members.", memberBio: "Youssef is an HR management student who believes in investing in people as the key to organizational success." },
        { id: "exec-assoc-exp", title: "Associate Experience", name: "Farida Nasser", level: 3, imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face", description: "Ensures a positive experience for all team members.", committeeDescription: "Associate Experience designs team-bonding activities, feedback systems, and wellness initiatives to keep morale high.", memberBio: "Farida is a psychology student dedicated to creating inclusive and supportive team environments." },
      ],
    },
    {
      id: "curator-marketing",
      title: "Curator — Marketing",
      name: "Jana Nader",
      level: 2,
      imageUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face",
      description: "Directs all marketing, branding, and communication strategies.",
      committeeDescription: "Marketing & Coordination amplifies the TEDxGUC brand through social media, content creation, and integrated campaigns that drive engagement and ticket sales.",
      memberBio: "Jana is a graphic design student with a flair for visual storytelling and brand strategy.",
      children: [
        { id: "exec-media", title: "Media & Design", name: "Nada Emad", level: 3, imageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop&crop=face", description: "Creates all visual content and social media assets.", committeeDescription: "Media & Design produces the visual identity of TEDxGUC — from social posts and event branding to video content and stage graphics.", memberBio: "Nada is a digital media student with a portfolio spanning photography, motion graphics, and UI design." },
        { id: "exec-campaigns", title: "Campaigns & Copy", name: "Ziad Ayman", level: 3, imageUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&h=200&fit=crop&crop=face", description: "Develops marketing campaigns and writes compelling copy.", committeeDescription: "Campaigns & Copywriting crafts the voice of TEDxGUC — writing copy, planning content calendars, and executing multi-channel marketing campaigns.", memberBio: "Ziad is a journalism student who combines data-driven strategy with creative storytelling." },
      ],
    },
  ],
};

const orgTree2026: OrgNode = {
  id: "chairman",
  title: "Chairman",
  name: "Kareem Shawish",
  level: 1,
  imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
  description: "Leading TEDxGUC into 2026 with a renewed vision for cross-disciplinary dialogue and community impact.",
  committeeDescription: "The Chairman's office sets the strategic direction for the entire TEDxGUC organization, overseeing all divisions and maintaining TED licensing standards.",
  memberBio: "Kareem previously served as Curator of Operations and brings deep operational expertise to his new role as Chairman.",
  children: [
    {
      id: "curator-talks",
      title: "Curator — Talks",
      name: "Moaz Akram",
      level: 2,
      imageUrl: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=200&h=200&fit=crop&crop=face",
      description: "Curating a diverse lineup of speakers who challenge conventional thinking.",
      committeeDescription: "The Talks division scouts, selects, and develops speakers to deliver compelling, well-researched talks that align with the season's theme.",
      memberBio: "Moaz is a computer science student with a deep interest in philosophy and cross-disciplinary discourse.",
      children: [
        { id: "exec-coaching", title: "Coaching", name: "Ammar Ibrahim", level: 3, imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=face", description: "Guiding speakers through intensive coaching.", committeeDescription: "Coaching works closely with each speaker to refine their narrative arc, improve delivery, and build confidence for the stage.", memberBio: "Ammar is a theater arts minor who brings performance coaching expertise to the team." },
        { id: "exec-research", title: "Research & Production", name: "Abdulrahman Waleed", level: 3, imageUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&h=200&fit=crop&crop=face", description: "Researching cutting-edge topics and managing production.", committeeDescription: "Research & Production ensures every talk is backed by credible sources and produced with professional-grade quality.", memberBio: "Abdulrahman is a data science student who excels at finding compelling stories in complex information." },
      ],
    },
    {
      id: "curator-operations",
      title: "Curator — Operations",
      name: "Kareem Roshdy",
      level: 2,
      imageUrl: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=200&h=200&fit=crop&crop=face",
      description: "Ensuring flawless event execution from planning to post-event wrap-up.",
      committeeDescription: "Operations coordinates all logistical elements of the event — from venue booking and vendor contracts to day-of execution and post-event teardown.",
      memberBio: "Kareem is a mechanical engineering student who applies systems thinking to event management.",
      children: [
        { id: "exec-events", title: "Events Management", name: "Laila El-Hadidy", level: 3, imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face", description: "Coordinating all event logistics and attendee experience.", committeeDescription: "Events Management designs the full attendee journey from registration to closing, including interactive experiences and networking sessions.", memberBio: "Laila is a hospitality management student with experience organizing large-scale university events." },
        { id: "exec-partnerships", title: "Partnerships", name: "Hamza El-Khobby", level: 3, imageUrl: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=200&h=200&fit=crop&crop=face", description: "Securing strategic partnerships and sponsor relations.", committeeDescription: "Partnerships builds and maintains relationships with corporate sponsors, media partners, and community organizations.", memberBio: "Hamza is a marketing student with a gift for building professional relationships." },
        { id: "exec-logistics", title: "Logistics", name: "Abdallah Nazih", level: 3, imageUrl: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200&h=200&fit=crop&crop=face", description: "Managing all on-ground logistics and vendor coordination.", committeeDescription: "Logistics handles the physical infrastructure — equipment, catering, transportation, signage, and venue preparation.", memberBio: "Abdallah is an industrial engineering student passionate about supply chain optimization." },
      ],
    },
    {
      id: "curator-od",
      title: "Curator — OD",
      name: "Nour Ayman",
      level: 2,
      imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face",
      description: "Building a stronger, more connected team culture.",
      committeeDescription: "Organizational Development focuses on internal team health — running training workshops, mentorship programs, and culture-building initiatives.",
      memberBio: "Nour is an organizational psychology student who is passionate about building high-performing teams.",
      children: [
        { id: "exec-assoc-dev", title: "Associate Development", name: "Rohanda Ahmed", level: 3, imageUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=face", description: "Creating growth opportunities and mentorship programs.", committeeDescription: "Associate Development designs onboarding tracks, skill-building workshops, and career mentorship for all new associates.", memberBio: "Rohanda is a human resources student focused on talent development and organizational learning." },
        { id: "exec-assoc-exp", title: "Associate Experience", name: "Abdullah Abosamra", level: 3, imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face", description: "Designing engaging team experiences and well-being initiatives.", committeeDescription: "Associate Experience ensures every team member feels valued through social events, recognition programs, and well-being support.", memberBio: "Abdullah is a business student who believes happy teams build better events." },
      ],
    },
    {
      id: "curator-marketing",
      title: "Curator — Marketing",
      name: "Laila Eid",
      level: 2,
      imageUrl: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=200&h=200&fit=crop&crop=face",
      description: "Amplifying TEDxGUC's reach through innovative marketing strategies.",
      committeeDescription: "Marketing & Coordination drives brand awareness, manages social channels, and creates integrated campaigns to engage the TEDxGUC community.",
      memberBio: "Laila is a mass communications student with a track record in digital marketing and content strategy.",
      children: [
        { id: "exec-media", title: "Media & Design", name: "Farida Sabrah", level: 3, imageUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&h=200&fit=crop&crop=face", description: "Producing visual storytelling content across all platforms.", committeeDescription: "Media & Design creates the visual identity of TEDxGUC — social media graphics, event branding, video production, and stage visuals.", memberBio: "Farida is a graphic design student whose work spans photography, animation, and brand identity." },
        { id: "exec-campaigns", title: "Campaigns & Copy", name: "Malak Hatem", level: 3, imageUrl: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&h=200&fit=crop&crop=face", description: "Crafting compelling narratives and managing multi-channel campaigns.", committeeDescription: "Campaigns & Copywriting develops the voice of TEDxGUC — from taglines and social captions to email newsletters and press releases.", memberBio: "Malak is a creative writing student who combines analytical thinking with evocative prose." },
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
    id: "2025-spring",
    year: 2025,
    season: "Winter",
    theme: "UnderConstruction",
    date: "September 27 2025",
    venue: "GUC Green Area, New Cairo",
    recap: "Our 2025 Spring event brought together 8 speakers across technology, health, design, and culture to explore how we can redefine the future. With over 1000 attendees, the event featured immersive experiences, networking sessions, and thought-provoking talks that challenged conventional thinking.",
    speakers: [
      { name: "Abdelrahman Ghareeb", talkTitle: "The Game Of Numbers", topic: "Engineering & Technology" },
      { name: "Aida Shaaban", talkTitle: "Reading Our Relationship With Food", topic: "Human Sciences" },
      { name: "Rami Hamdi", talkTitle: "A Story Called Beauty", topic: "Arts, Media & Design" },
      
    ],
    gallery: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&h=500&fit=crop",
    ],
    sponsors: ["TED", "GUC", "Krispy Kreme"],
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
  date: "May 18, 2026",
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
