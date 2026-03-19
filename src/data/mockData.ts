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
    socialLinks: [
      { platform: "LinkedIn", url: "#" },
    ],
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
    socialLinks: [
      { platform: "Twitter", url: "#" },
    ],
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
    socialLinks: [
      { platform: "LinkedIn", url: "#" },
    ],
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
    socialLinks: [
      { platform: "Instagram", url: "#" },
    ],
  },
];

export const topics = [...new Set(talks.map((t) => t.topic))];
export const years = [...new Set(talks.map((t) => t.year))].sort((a, b) => b - a);

export const orgTree: OrgNode = {
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
        {
          id: "exec-coaching",
          title: "Coaching",
          name: "Mariam Adel",
          level: 3,
          description: "Coaches and mentors speakers through rehearsals, presentation skills workshops, and talk refinement sessions.",
        },
        {
          id: "exec-research",
          title: "Research & Production",
          name: "Hassan Tarek",
          level: 3,
          description: "Conducts in-depth research to support speakers and manages the production pipeline from script to stage.",
        },
      ],
    },
    {
      id: "curator-operations",
      title: "Curator — Operations",
      name: "Khaled Mostafa",
      level: 2,
      description: "Manages all operational logistics, event planning, and day-of execution to ensure seamless delivery.",
      children: [
        {
          id: "exec-events",
          title: "Events Management",
          name: "Dina Sherif",
          level: 3,
          description: "Plans and executes all event activities including venue management, scheduling, and on-site coordination.",
        },
        {
          id: "exec-partnerships",
          title: "Partnerships",
          name: "Ali Mahmoud",
          level: 3,
          description: "Builds and maintains relationships with sponsors, partners, and stakeholders to support the event financially and logistically.",
        },
        {
          id: "exec-logistics",
          title: "Logistics",
          name: "Rana Hossam",
          level: 3,
          description: "Handles all logistical operations including transportation, equipment, catering, and venue setup.",
        },
      ],
    },
    {
      id: "curator-od",
      title: "Curator — Organizational Development",
      name: "Mona Ibrahim",
      level: 2,
      description: "Focuses on team growth, internal culture, and organizational excellence across all divisions.",
      children: [
        {
          id: "exec-assoc-dev",
          title: "Associate Development",
          name: "Youssef Gamal",
          level: 3,
          description: "Develops training programs and growth pathways for new associates joining the TEDxGUC team.",
        },
        {
          id: "exec-assoc-exp",
          title: "Associate Experience",
          name: "Farida Nasser",
          level: 3,
          description: "Ensures a positive and engaging experience for all team members through events, feedback systems, and team bonding.",
        },
      ],
    },
    {
      id: "curator-marketing",
      title: "Curator — Marketing & Coordination",
      name: "Tamer Wael",
      level: 2,
      description: "Directs all marketing, branding, and communication strategies to amplify the TEDxGUC message.",
      children: [
        {
          id: "exec-media",
          title: "Media & Design",
          name: "Nada Emad",
          level: 3,
          description: "Creates all visual content including graphics, videos, and social media assets that define the TEDxGUC brand.",
        },
        {
          id: "exec-campaigns",
          title: "Campaigns & Copywriting",
          name: "Ziad Ayman",
          level: 3,
          description: "Develops marketing campaigns, writes compelling copy, and manages content calendars across all channels.",
        },
      ],
    },
  ],
};
