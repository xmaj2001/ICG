import { Fragment, Suspense } from "react";
import type { SortFilterItem } from "@/lib/constants";
import FilterItemDropdown from "./dropdown";
import { FilterItem } from "./item";

export type ListItem = SortFilterItem | PathFilterItem;
export type PathFilterItem = { title: string; path: string };

function FilterItemList({ list }: { list: ListItem[] }) {
  return (
    <Fragment>
      {list.map((item: ListItem, i) => (
        <FilterItem key={i.toString()} item={item} />
      ))}
    </Fragment>
  );
}

export default function FilterList({
  list,
  title,
}: {
  list: ListItem[];
  title?: string;
}) {
  return (
    <Fragment>
      <nav>
        {title ? (
          <h3 className="mb-4 hidden text-sm font-semibold text-neutral-500 md:block dark:text-neutral-400">
            {title}
          </h3>
        ) : null}
        <ul className="hidden md:block">
          <Suspense fallback={null}>
            <FilterItemList list={list} />
          </Suspense>
        </ul>
        <ul className="md:hidden">
          <Suspense fallback={null}>
            <FilterItemDropdown list={list} />
          </Suspense>
        </ul>
      </nav>
    </Fragment>
  );
}
