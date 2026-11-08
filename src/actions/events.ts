import { Event } from "@/types/backendTypes";





export async function getEvents(page: number): Promise<Event[]> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/event/page/${page}`;
  const res = await fetch(url, {
    next: { revalidate: 300 },
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {

    const errorText = await res.text();
    console.error("Backend error response:", errorText);
    throw new Error(`Failed to fetch events: ${res.status} ${res.statusText}`);
  }

  const data: Event[] = await res.json();
  return data;
}

export async function getNumPage(): Promise<number> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/event/page/count`;
  
  const res = await fetch(url, {
    next: { revalidate: 300 },
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Backend error response:", errorText);
    throw new Error(`Failed to fetch events: ${res.status} ${res.statusText}`);
  }

  const data: { count: number } = await res.json();
  return data.count;
}



export async function getEventById(id: string): Promise<Event | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/event/${id}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 },
    }
  );

  if (!res.ok) {
    return null;
  }

  return res.json();
}
