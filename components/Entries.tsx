import type { FeedEntry } from "rss/src/types/feed.ts";
import { Entry } from "../components/Entry.tsx";

type EntriesProps = {
  entries: FeedEntry[];
};

export default function Entries(props: EntriesProps) {
  const { entries } = props;

  return (
    <>
      {entries.map((entry) => <Entry entry={entry} />)}
    </>
  );
}
