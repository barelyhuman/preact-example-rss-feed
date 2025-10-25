import type { H3Event } from "nitro/h3";
import { parseFeed } from "@rowanmanning/feed-parser";

export default async (event: H3Event) => {
  const reqUrl = new URL(event.req.url);
  const url = reqUrl.searchParams.get("url");
  if (!url) {
    return JSON.stringify({ parsed: false });
  }
  const rawFeed = await fetch(url).then((d) => d.text());
  const parsed = parseFeed(rawFeed);
  return {
    parsed: true,
    feed: parsed.toJSON(),
  };
};
