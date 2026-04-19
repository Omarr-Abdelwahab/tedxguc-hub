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

export interface UpcomingEvent {
  theme: string;
  date: string;
  venue: string;
  description: string;
}

export interface UpcomingContent {
  upcomingEvent: UpcomingEvent | null;
  upcomingSchedule: ScheduleItem[];
  upcomingFAQs: FAQ[];
  upcomingSpeakers: { name: string; topic: string }[];
}

export interface Sponsor {
  name: string;
  tier: string;
}
