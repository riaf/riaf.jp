import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { parseFeed } from "rss/mod.ts";
import type { FeedEntry } from "rss/src/types/feed.ts";
import Entries from "../components/Entries.tsx";

const FEEDS = [
  "https://zenn.dev/riaf/feed",
  "https://qiita.com/riaf/feed",
  "https://medium.com/feed/@riaf",
  "https://riaf.hatenablog.com/feed",
];

interface FeedEntryHasRequiredProperties extends FeedEntry {
  published: Date;
}

export const handler: Handlers<{ entries: FeedEntry[] }> = {
  async GET(_, ctx) {
    const entries: FeedEntry[] = [];

    for await (const url of FEEDS) {
      const response = await fetch(url);
      if (response.status !== 200) {
        continue;
      }
      const feed = await parseFeed(await response.text());
      entries.push(...feed.entries);
    }

    return ctx.render({
      entries: entries.filter((e): e is FeedEntryHasRequiredProperties =>
        e.published instanceof Date && e.links.length > 0
      ).sort((a, b) => (a.published > b.published) ? -1 : 1).slice(0, 20),
    });
  },
};

export default function Home({ data }: PageProps<{ entries: FeedEntry[] }>) {
  return (
    <>
      <Head>
        <title>Keisuke SATO | 佐藤佳祐 | riaf.jp</title>
        <meta name="title" content="Keisuke SATO | 佐藤佳祐 | riaf.jp" />
        <meta name="description" content="佐藤佳祐 / riaf のアウトプットをまとめているページです。ITサービスを開発したり、相談に乗ったりしています。" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://riaf.jp/" />
        <meta property="og:title" content="Keisuke SATO | 佐藤佳祐 | riaf.jp" />
        <meta property="og:description" content="佐藤佳祐 / riaf のアウトプットをまとめているページです。ITサービスを開発したり、相談に乗ったりしています。" />
        <meta property="og:image" content="https://imagedelivery.net/-RiWa6tLJfhefZ_kr71maA/7b4ac137-931e-42cc-40f7-4ac651287000/header" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://riaf.jp/" />
        <meta property="twitter:title" content="Keisuke SATO | 佐藤佳祐 | riaf.jp" />
        <meta property="twitter:description" content="佐藤佳祐 / riaf のアウトプットをまとめているページです。ITサービスを開発したり、相談に乗ったりしています。" />
        <meta property="twitter:image" content="https://imagedelivery.net/-RiWa6tLJfhefZ_kr71maA/7b4ac137-931e-42cc-40f7-4ac651287000/header" />
        <style>
          {`
          body { background: #f7f7f7; }
        `}
        </style>
      </Head>
      <main class="p-4 mx-auto max-w-screen-lg">
        <div class="flex flex-col items-center justify-center my-10">
          <img
            src="/profile.jpg"
            class="w-48 h-48 rounded"
            alt="profile picture"
          />
          <h1 class="mt-6 text-2xl">
            佐藤 佳祐 <span class="text-gray-400">aka</span> riaf
          </h1>
          <p class="mb-8 text-sm text-gray-400">From Kushiro, Hokkaido.</p>
          <div class="flex flex-row">
            <a
              class="m-2 p-2 bg-gray-200 rounded-full hover:bg-white transition-colors delay-150 duration-300"
              href="https://m.me/1276368138"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                alt="Messenger"
                src="/messenger.svg"
                width="28"
                height="28"
              />
            </a>
            <a
              class="m-2 p-2 bg-gray-200 rounded-full hover:bg-white transition-colors delay-150 duration-300"
              href="https://github.com/riaf"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img alt="GitHub" src="/github.svg" width="28" height="28" />
            </a>
            <a
              class="m-2 p-2 bg-gray-200 rounded-full hover:bg-white transition-colors delay-150 duration-300"
              href="https://twitter.com/riaf"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img alt="Twitter" src="/twitter.svg" width="28" height="28" />
            </a>
            <a
              class="m-2 p-2 bg-gray-200 rounded-full hover:bg-white transition-colors delay-150 duration-300"
              href="https://musings.riaf.jp"
              target="_blank"
            >
              <img alt="Medium" src="/medium.svg" width="28" height="28" />
            </a>
          </div>
        </div>
        <hr class="my-16" />
        <Entries entries={data.entries} />
      </main>
    </>
  );
}
