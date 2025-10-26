import { batch, signal } from "@preact/signals";
import type { parseFeed } from "@rowanmanning/feed-parser";
export type ParsedFeed = ReturnType<typeof parseFeed>;

export class Feed {
  url: string;
  title = signal("");
  rawFeed: string = "";
  parsed = signal(false);
  data: ParsedFeed | undefined;
  loading = signal(false);
  error = signal("");
  retries = signal(0);

  constructor(url: string) {
    this.url = url;
  }

  async load() {
    batch(() => {
      this.error.value = "";
      this.parsed.value = false;
      this.retries.value += 1;
      this.loading.value = true;
    });
    try {
      const sp = new URLSearchParams();
      sp.set("url", this.url);
      const feedResponse = await fetch(`/api/fetch-feed?${sp.toString()}`).then(
        (d) => {
          if (d.ok) {
            return d.json();
          }
          throw d;
        },
      ).catch(() => ({ parsed: false, error: "Failed to parse feed" }));
      if (!feedResponse.parsed) {
        this.error.value = feedResponse.error;
        return;
      }
      const feedData = feedResponse.feed as ParsedFeed;
      this.data = feedResponse.feed;

      batch(() => {
        this.parsed.value = feedResponse.parsed;
        this.title.value = feedData.title ?? "";
      });
    } catch (err) {
      if (err instanceof Error) this.error.value = err.message;
      else this.error.value = String(err);
    } finally {
      this.loading.value = false;
    }
  }
}
