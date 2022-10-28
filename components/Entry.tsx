import type { FeedEntry } from "rss/src/types/feed.ts";

type Props = {
  entry: FeedEntry;
};

export function Entry(props: Props) {
  const { entry } = props;

  const url = entry.links[0]?.href as string;
  const description = entryDescription(entry);

  return (
    <article class="mb-20">
      <h3
        class="text-4xl font-bold hover:text-primary transition-colors delay-150 duration-300"
        style={{ fontFeatureSettings: `"palt"` }}
      >
        <a href={url} target="_blank" rel="noopener noreferrer">
          {entry.title?.value}
        </a>
      </h3>
      <div class="pb-6">
        <Domain url={url} />
      </div>
      <p
        class="text-2xl leading-relaxed hover:text-primary transition-colors delay-150 duration-300"
        style={{ fontFeatureSettings: `"palt"` }}
      >
        <a href={url} target="_blank" rel="noopener noreferrer">
          {description}
        </a>
      </p>
    </article>
  );
}

function Domain(props: { url: string }) {
  const domain = new URL(props.url).hostname;

  return <span class="text-gray-400">{domain}</span>;
}

function entryDescription(entry: FeedEntry) {
  const desc = stripTag(entry.content?.value || entry.description?.value);

  return desc?.slice(0, 200).replace(/[\s…]+$/, "") + "…";
}

function stripTag(str?: string) {
  return str?.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, "");
}
