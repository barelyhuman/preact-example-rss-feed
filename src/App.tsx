import { TargetedSubmitEvent } from "preact";
import { feedStore } from "./lib/FeedStore";

const onSubmit = (e: TargetedSubmitEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!e.currentTarget) return;

  const _form = e.currentTarget.closest("form");
  if (!_form) return;

  const form = new FormData(_form);
  const url = form.get("url");
  if (!url) return _form.reset();

  const feed = feedStore.add(url.toString());
  if (feed) {
    feed.load();
  }

  _form.reset();
};

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          RSS Feed Checker
        </h1>

        <form
          onSubmit={onSubmit}
          className="mb-8 bg-gray-800 p-6 rounded-lg shadow-lg"
        >
          <div className="flex gap-4">
            <div class="flex flex-1 flex-col gap-2">
              <input
                name="url"
                type="url"
                placeholder="Enter RSS feed URL"
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                required
              />
              {feedStore.error.value.length > 0 && (
                <p>
                  <small>
                    {feedStore.error.value}
                  </small>
                </p>
              )}
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              Add Feed
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {feedStore.feeds.value.map((feedItem) => (
            <div
              key={feedItem.url}
              className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-medium text-gray-200">
                    {feedItem.title.value || feedItem.url}
                  </span>
                  {feedItem.loading.value && (
                    <span className="text-sm text-blue-400 animate-pulse">
                      Loading...
                    </span>
                  )}
                </div>
                <button
                  onClick={() => feedStore.remove(feedItem.url)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  Delete
                </button>
              </div>

              {feedItem.error.value.length > 0 && (
                <div>
                  <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded text-red-300 text-sm">
                    <p>
                      {feedItem.error.value}
                    </p>
                    {feedItem.retries.value <= 3
                      ? (
                        <div>
                          <button
                            onClick={() => feedItem.load()}
                            className="px-3 text-white py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                          >
                            Retry
                          </button>
                        </div>
                      )
                      : (
                        <div>
                          Failed too many times to retry
                        </div>
                      )}
                  </div>
                </div>
              )}

              {feedItem.parsed.value && (
                <div className="text-sm text-gray-400">
                  {feedItem.data?.items.length} articles available
                </div>
              )}
            </div>
          ))}

          {feedStore.feeds.value.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No feeds added yet</p>
              <p className="text-sm mt-2">
                Add your first RSS feed above to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
