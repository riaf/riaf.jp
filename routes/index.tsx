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

const Person = {
  "@context": "http://schema.org/",
  "@type": "Person",
  name: "佐藤佳祐",
  additionalName: "riaf",
  image:
    "https://imagedelivery.net/-RiWa6tLJfhefZ_kr71maA/0703dc23-4d98-49bb-b476-63a4dc29af00/public",
  jobTitle: "Software Engineer, Entrepreneur",
  url: "https://riaf.jp",
  birthPlace: "Kushiro, Hokkaido JP",
  birthDate: "1987-09-16",
  gender: "male",
  nationality: "Japanese",
  worksFor: [
    "Katteba LLC.",
    "STARFESTIVAL INC.",
    "OTOBANK Inc.",
  ],
  memberOf: [
    "一般社団法人 LOCAL",
    "釧路 OSS コミュニティ",
    "U-16 プログラミングコンテスト釧路大会実行委員会",
  ],
  sameAs: [
    "https://twitter.com/riaf",
    "https://github.com/riaf",
    "https://www.facebook.com/sato.keisuke",
    "https://www.instagram.com/keisksat/",
    "https://riaf.xyz/@riaf",
  ],
};

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
        <meta
          name="description"
          content="佐藤佳祐 / riaf のアウトプットをまとめているページです。ITサービスを開発したり、相談に乗ったりしています。"
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://riaf.jp/" />
        <meta property="og:title" content="Keisuke SATO | 佐藤佳祐 | riaf.jp" />
        <meta
          property="og:description"
          content="佐藤佳祐 / riaf のアウトプットをまとめているページです。ITサービスを開発したり、相談に乗ったりしています。"
        />
        <meta
          property="og:image"
          content="https://imagedelivery.net/-RiWa6tLJfhefZ_kr71maA/7b4ac137-931e-42cc-40f7-4ac651287000/header"
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://riaf.jp/" />
        <meta
          property="twitter:title"
          content="Keisuke SATO | 佐藤佳祐 | riaf.jp"
        />
        <meta
          property="twitter:description"
          content="佐藤佳祐 / riaf のアウトプットをまとめているページです。ITサービスを開発したり、相談に乗ったりしています。"
        />
        <meta
          property="twitter:image"
          content="https://imagedelivery.net/-RiWa6tLJfhefZ_kr71maA/7b4ac137-931e-42cc-40f7-4ac651287000/header"
        />
        <style>
          {`
          body { background: #f7f7f7; }
        `}
        </style>
      </Head>
      <main class="p-4 mx-auto max-w-screen-lg">
        <div class="flex flex-col items-center justify-center my-10">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(Person) }}
          />
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
      <footer class="p-4 mx-auto my-8 max-w-screen-lg bg-white rounded">
        <aside>
          <h2 class="mb-4 text-2xl">About me</h2>
          <p class="text-lg">Keisuke Sato</p>
          <p>
            Principal Engineer at STARFESTIVAL INC. / Founder of Katteba LLC. /
            Technical advisor at OTOBANK Inc.
          </p>
          <hr class="my-4" />
          <p class="text-lg">佐藤佳祐</p>
          <p>1987年生まれ、釧路出身。</p>
          <p>
            2011年（株）クロコスを共同創業、翌年にヤフー（株）へ売却。ソーシャルマーケティング部門で新規プロダクト開発を担当。
          </p>
          <p>
            2014年（株）オトバンク 取締役
            最高技術責任者（CTO）としてプロダクト開発や組織・制度改革を牽引。<br />オーディオブック事業責任者としてサブスクリプションサービス「audiobook.jp」の立ち上げを担当。
          </p>
          <p>2017年 北海道釧路市へ移住。</p>
          <p>
            現在はスターフェスティバル（株）プリンシパルエンジニア、（株）オトバンク
            技術顧問、（同）勝手場 代表、（一社）LOCAL 運営委員、釧路 OSS
            コミュニティ、U-16プログラミングコンテスト釧路大会実行委員など。
          </p>
        </aside>
      </footer>
    </>
  );
}
