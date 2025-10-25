import { parseFeed } from "@rowanmanning/feed-parser";
const fetchFeed = async (event) => {
  const reqUrl = new URL(event.req.url);
  const url = reqUrl.searchParams.get("url");
  if (!url) {
    return JSON.stringify({ parsed: false });
  }
  const rawFeed = await fetch(url).then((d) => d.text());
  const parsed = parseFeed(rawFeed);
  return {
    parsed: true,
    feed: parsed.toJSON()
  };
};
export {
  fetchFeed as default
};
