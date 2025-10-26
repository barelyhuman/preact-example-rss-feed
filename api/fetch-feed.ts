import type { H3Event } from "nitro/h3";
import { parseFeed } from "@rowanmanning/feed-parser";

export default async (event: H3Event) => {
  const reqUrl = new URL(event.req.url);
  const url = reqUrl.searchParams.get("url");
  if (!url) {
    return JSON.stringify({ parsed: false });
  }
  const rawFeed = await fetch(url).then((d) => d.text());
  try {
    const parsed = parseFeed(rawFeed);
    return {
      parsed: true,
      feed: parsed.toJSON(),
    };
  } catch (err: any) {
    return {
      parsed: false,
      error: "message" in err ? err.message : String(err),
    };
  }
};
