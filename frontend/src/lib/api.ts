import type {
  OrgNode,
  Sponsor,
  Talk,
  TEDxEvent,
  UpcomingContent,
} from "@/types/content";

const request = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }

  return response.json() as Promise<T>;
};

const requestWithTimeout = async <T>(url: string, timeoutMs = 8000): Promise<T> => {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Request failed (${response.status})`);
    }

    return response.json() as Promise<T>;
  } finally {
    window.clearTimeout(timeoutId);
  }
};

export const fetchTalks = async (): Promise<Talk[]> => {
  const data = await request<{ talks: Talk[] }>("/api/talks");
  return data.talks || [];
};

export const fetchEvents = async (): Promise<TEDxEvent[]> => {
  const data = await request<{ events: TEDxEvent[] }>("/api/events");
  return data.events || [];
};

export const fetchEventById = async (eventId: string): Promise<TEDxEvent> => {
  const data = await request<{ event: TEDxEvent }>(`/api/events/${encodeURIComponent(eventId)}`);
  return data.event;
};

export const fetchOrgTrees = async (): Promise<Record<string, OrgNode>> => {
  try {
    const data = await requestWithTimeout<{ orgTreesBySeason: Record<string, OrgNode> }>("/api/org-trees");
    return data.orgTreesBySeason || {};
  } catch {
    const fallback = await request<{ orgTreesBySeason: Record<string, OrgNode> }>("/api/seed-content/orgTreesBySeason");
    return fallback.orgTreesBySeason || {};
  }
};

export const fetchUpcoming = async (): Promise<UpcomingContent> => {
  return request<UpcomingContent>("/api/upcoming");
};

export const fetchSponsors = async (): Promise<Sponsor[]> => {
  const data = await request<{ sponsors: Sponsor[] }>("/api/sponsors");
  return data.sponsors || [];
};

export const submitSpeakerNomination = async (nomination: {
  nominatorName: string;
  nominatorEmail: string;
  speakerName: string;
  speakerEmail: string;
  speakerTopic: string;
  speakerBio: string;
  whyNominate: string;
  speakerSocialLinks?: string;
}): Promise<{ ok: boolean; message: string }> => {
  const response = await fetch("/api/nominations/speaker", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(nomination),
  });

  if (!response.ok) {
    const error = (await response.json()) as { error?: string };
    throw new Error(error.error || `Request failed (${response.status})`);
  }

  return response.json() as Promise<{ ok: boolean; message: string }>;
};
