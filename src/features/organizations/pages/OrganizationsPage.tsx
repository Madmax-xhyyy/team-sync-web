import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ArrowUpDown, Building2, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getMyOrganizations } from "../api/organizations.api";
import { CreateOrganizationDialog } from "../components/CreateOrganizationDialog";
import { OrganizationList } from "../components/OrganizationList";

export function OrganizationsPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name");
  const {
    data: organizations = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["organizations", "my"],
    queryFn: getMyOrganizations,
  });
  const keyword = search.trim().toLocaleLowerCase();
  const filtered = organizations
    .filter((organization) =>
      `${organization.name} ${organization.description ?? ""}`
        .toLocaleLowerCase()
        .includes(keyword),
    )
    .sort((a, b) =>
      sort === "newest"
        ? (Date.parse(b.createdAt) || 0) - (Date.parse(a.createdAt) || 0)
        : a.name.localeCompare(b.name),
    );

  return (
    <div className="mx-auto max-w-6xl space-y-8 py-4 sm:py-8">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2 text-xs font-medium tracking-widest text-primary uppercase">
            <Building2 className="size-4" aria-hidden="true" /> Your workspaces
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Organizations</h1>
          <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
            Choose a workspace to pick up where your team left off, or create a new one to get
            started.
          </p>
        </div>
        <CreateOrganizationDialog />
      </div>

      <section aria-label="Your organizations" className="space-y-5">
        <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="search"
              aria-label="Search organizations"
              placeholder="Search organizations…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-10 w-full rounded-lg border bg-background pr-10 pl-9 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute top-1/2 right-2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            )}
          </div>
          <div className="flex items-center justify-between gap-4 sm:justify-end">
            {!isLoading && !isError && (
              <p role="status" className="text-xs whitespace-nowrap text-muted-foreground">
                {keyword ? `${filtered.length} of ${organizations.length}` : organizations.length}{" "}
                {organizations.length === 1 ? "organization" : "organizations"}
              </p>
            )}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="size-4 text-muted-foreground" aria-hidden="true" />
              <select
                aria-label="Sort organizations"
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="name">Name: A–Z</option>
                <option value="newest">Newest first</option>
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div
            role="status"
            aria-label="Loading organizations"
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                aria-hidden="true"
                className="space-y-5 rounded-xl border bg-card p-6"
              >
                <div className="size-12 animate-pulse rounded-xl bg-muted motion-reduce:animate-none" />
                <div className="h-5 w-2/3 animate-pulse rounded bg-muted motion-reduce:animate-none" />
                <div className="h-4 w-full animate-pulse rounded bg-muted motion-reduce:animate-none" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-muted motion-reduce:animate-none" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div
            role="alert"
            className="flex flex-col items-center rounded-xl border bg-card px-6 py-16 text-center"
          >
            <AlertCircle className="mb-4 size-8 text-destructive" aria-hidden="true" />
            <h2 className="font-semibold">Couldn’t load your organizations</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Please try again to get back to your workspaces.
            </p>
            <Button variant="outline" className="mt-5" onClick={() => void refetch()}>
              Try again
            </Button>
          </div>
        ) : keyword && filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed px-6 py-16 text-center">
            <Search className="mx-auto mb-4 size-8 text-muted-foreground" aria-hidden="true" />
            <h2 className="font-semibold">No matching organizations</h2>
            <p className="mt-2 text-sm text-muted-foreground">Try another name or keyword.</p>
            <Button variant="outline" className="mt-5" onClick={() => setSearch("")}>
              Clear search
            </Button>
          </div>
        ) : (
          <OrganizationList organizations={filtered} />
        )}
      </section>
    </div>
  );
}
