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

export const fetchTalks = async (): Promise<Talk[]> => {
  const data = await request<{ talks: Talk[] }>("/api/talks");
  return data.talks || [];
};

export const fetchEvents = async (): Promise<TEDxEvent[]> => {
  const data = await request<{ events: TEDxEvent[] }>("/api/events");
  return data.events || [];
};

export const fetchEventById = async (eventId: string): Promise<TEDxEvent> => {
  const data = await request<{ event: TEDxEvent }>(`/api/events/${eventId}`);
  return data.event;
};

export const fetchOrgTrees = async (): Promise<Record<string, OrgNode>> => {
  const data = await request<{ orgTreesBySeason: Record<string, OrgNode> }>("/api/org-trees");
  return data.orgTreesBySeason || {};
};

export const fetchUpcoming = async (): Promise<UpcomingContent> => {
  return request<UpcomingContent>("/api/upcoming");
};

export const fetchSponsors = async (): Promise<Sponsor[]> => {
  const data = await request<{ sponsors: Sponsor[] }>("/api/sponsors");
  return data.sponsors || [];
};
