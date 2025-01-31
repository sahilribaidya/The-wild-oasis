"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

function Button({ filter, headleFilter, activeFilter, children }) {
  return (
    <button
      className={`px-5 py-2 hover:bg-primary-700 ${
        filter === activeFilter ? "bg-primary-700 text-primary-50" : ""
      }`}
      onClick={() => headleFilter(filter)}
    >
      {children}
    </button>
  );
}

function Filter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeFilter = searchParams.get("capacity") ?? "all";

  function headleFilter(filter) {
    const params = new URLSearchParams(searchParams);
    params.set("capacity", filter);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }
  return (
    <div className="border border-primary-800 flex">
      <Button
        filter="all"
        headleFilter={headleFilter}
        activeFilter={activeFilter}
      >
        All Cabins
      </Button>

      <Button
        filter="small"
        headleFilter={headleFilter}
        activeFilter={activeFilter}
      >
        1&mdash;3 guests
      </Button>

      <Button
        filter="medium"
        headleFilter={headleFilter}
        activeFilter={activeFilter}
      >
        4&mdash;7 guests
      </Button>

      <Button
        filter="large"
        headleFilter={headleFilter}
        activeFilter={activeFilter}
      >
        8&mdash;12 guests
      </Button>

      <Button
        filter="luxury"
        headleFilter={headleFilter}
        activeFilter={activeFilter}
      >
        13&mdash;30 guests
      </Button>
    </div>
  );
}

export default Filter;
