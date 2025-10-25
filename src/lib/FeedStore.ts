import { signal } from "@preact/signals";
import { Feed } from "./Feed";

const safeParseURL = (url: string) => {
  const result: [undefined | string, string] = [, url];
  try {
    const _url = new URL(url);
    result[0] = undefined;
    result[1] = _url.toString();
  } catch (err) {
    if (err instanceof Error) result[0] = err.message;
    else result[0] = String(err);
  }
  return result;
};

class FeedStore {
  feeds = signal<Feed[]>([]);
  error = signal("");

  constructor() {}

  add(url: string) {
    const [error, normalizedUrl] = safeParseURL(url);
    if (error) {
      this.error.value = error;
      return;
    }
    const feed = new Feed(normalizedUrl);
    this.feeds.value = this.feeds.value
      .filter((d) => d.url !== normalizedUrl)
      .concat(
        feed,
      );
    return feed;
  }

  remove(url: string) {
    this.feeds.value = this.feeds.value.filter((d) => d.url != url);
  }
}

export const feedStore = new FeedStore();
