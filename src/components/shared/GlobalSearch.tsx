"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, DoorOpen, Search, UserRound } from "lucide-react";

import { APP_ROUTES, useAuth } from "@/app/providers";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui";
import { useUserDesks } from "@/features/desk/presentation/hooks";
import type { DeskForDetail } from "@/features/desk/infrastructure/queries";
import { cn } from "@/lib/utils";

type NotebookResult = DeskForDetail["notebooks"][number];
type MemberProfile = DeskForDetail["members"][number]["profile"];

type QueryParts = {
  deskQuery: string;
  notebookQuery: string;
  isNotebookMode: boolean;
};

type SearchResult =
  | { type: "desk"; id: string; label: string; desk: DeskForDetail }
  | { type: "notebook"; id: string; label: string; desk: DeskForDetail; notebook: NotebookResult }
  | { type: "user"; id: string; label: string; profile: MemberProfile };

type GlobalSearchProps = {
  currentDeskName?: string | null;
  currentNotebookTitle?: string | null;
};

function parseQuery(query: string): QueryParts {
  const slashIndex = query.indexOf("/");

  if (slashIndex === -1) {
    return {
      deskQuery: query.trim(),
      notebookQuery: "",
      isNotebookMode: false,
    };
  }

  return {
    deskQuery: query.slice(0, slashIndex).trim(),
    notebookQuery: query.slice(slashIndex + 1).trim(),
    isNotebookMode: true,
  };
}

function normalize(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

function scoreLabel(label: string, query: string) {
  const normalizedLabel = normalize(label);
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) return 0;
  if (normalizedLabel === normalizedQuery) return 0;
  if (normalizedLabel.startsWith(normalizedQuery)) return 1;
  if (normalizedLabel.includes(normalizedQuery)) return 2;
  return null;
}

function rankByLabel<T>(items: T[], query: string, getLabel: (item: T) => string) {
  return items
    .map((item) => ({ item, score: scoreLabel(getLabel(item), query) }))
    .filter((entry): entry is { item: T; score: number } => entry.score !== null)
    .sort((a, b) => a.score - b.score || getLabel(a.item).localeCompare(getLabel(b.item)))
    .map((entry) => entry.item);
}

function getProfileLabel(profile: MemberProfile) {
  return profile.displayName || profile.username || "Unknown user";
}

function getCurrentDeskId(pathname: string) {
  const [, root, deskId] = pathname.split("/");
  return root === "desks" ? deskId ?? null : null;
}

function getSearchPath(deskName?: string | null, notebookTitle?: string | null) {
  if (!deskName) return "";
  return notebookTitle ? `${deskName}/${notebookTitle}` : deskName;
}

function getHeadSelectionRange(value: string) {
  const slashIndex = value.lastIndexOf("/");
  return {
    start: slashIndex === -1 ? 0 : slashIndex + 1,
    end: value.length,
  };
}

export function GlobalSearch({ currentDeskName, currentNotebookTitle }: GlobalSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { data: desks = [], isLoading } = useUserDesks(user?.id ?? "");

  const currentDeskId = getCurrentDeskId(pathname);
  const currentDesk = useMemo(
    () => desks.find((desk) => desk.id === currentDeskId) ?? null,
    [currentDeskId, desks],
  );

  const queryParts = useMemo(() => parseQuery(query), [query]);

  const deskResults = useMemo(() => {
    if (!queryParts.deskQuery) return desks.slice(0, 8);
    return rankByLabel(desks, queryParts.deskQuery, (desk) => desk.name).slice(0, 8);
  }, [desks, queryParts.deskQuery]);

  const activeNotebookDesk = useMemo(() => {
    if (!queryParts.isNotebookMode) return null;
    if (!queryParts.deskQuery && currentDesk) return currentDesk;
    return deskResults[0] ?? null;
  }, [currentDesk, deskResults, queryParts.deskQuery, queryParts.isNotebookMode]);

  const notebookResults = useMemo(() => {
    if (queryParts.isNotebookMode) {
      if (!activeNotebookDesk) return [];
      return rankByLabel(
        activeNotebookDesk.notebooks,
        queryParts.notebookQuery,
        (notebook) => notebook.title,
      )
        .slice(0, 8)
        .map((notebook) => ({ desk: activeNotebookDesk, notebook }));
    }

    if (!queryParts.deskQuery) return [];

    return desks
      .flatMap((desk) =>
        rankByLabel(desk.notebooks, queryParts.deskQuery, (notebook) => notebook.title)
          .slice(0, 3)
          .map((notebook) => ({ desk, notebook })),
      )
      .slice(0, 8);
  }, [activeNotebookDesk, desks, queryParts.deskQuery, queryParts.isNotebookMode, queryParts.notebookQuery]);

  const userResults = useMemo(() => {
    if (!queryParts.deskQuery || queryParts.isNotebookMode) return [];

    const profiles = new Map<string, MemberProfile>();
    for (const desk of desks) {
      for (const member of desk.members) {
        profiles.set(member.profile.userId, member.profile);
      }
    }

    return rankByLabel(
      [...profiles.values()],
      queryParts.deskQuery,
      (profile) => `${profile.displayName ?? ""} ${profile.username ?? ""}`,
    ).slice(0, 5);
  }, [desks, queryParts.deskQuery, queryParts.isNotebookMode]);

  const results = useMemo<SearchResult[]>(() => {
    if (queryParts.isNotebookMode) {
      return notebookResults.map(({ desk, notebook }) => ({
        type: "notebook",
        id: notebook.id,
        label: notebook.title,
        desk,
        notebook,
      }));
    }

    return [
      ...deskResults.map((desk) => ({
        type: "desk" as const,
        id: desk.id,
        label: desk.name,
        desk,
      })),
      ...notebookResults.map(({ desk, notebook }) => ({
        type: "notebook" as const,
        id: notebook.id,
        label: notebook.title,
        desk,
        notebook,
      })),
      ...userResults.map((profile) => ({
        type: "user" as const,
        id: profile.userId,
        label: getProfileLabel(profile),
        profile,
      })),
    ];
  }, [deskResults, notebookResults, queryParts.isNotebookMode, userResults]);

  const firstNavigableResult = results.find((result) => result.type !== "user");
  const currentSearchPath = useMemo(
    () => getSearchPath(currentDeskName, currentNotebookTitle),
    [currentDeskName, currentNotebookTitle],
  );

  const selectHeadPath = useCallback((value: string) => {
    const { start, end } = getHeadSelectionRange(value);

    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(start, end);
    });
  }, []);

  const openSearch = useCallback(() => {
    setQuery(currentSearchPath);
    setOpen(true);
    selectHeadPath(currentSearchPath);
  }, [currentSearchPath, selectHeadPath]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (open) {
          setOpen(false);
          setQuery("");
          return;
        }
        openSearch();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, openSearch]);

  function closeSearch() {
    setOpen(false);
    setQuery("");
  }

  function navigateToResult(result: SearchResult) {
    if (result.type === "desk") {
      router.push(APP_ROUTES.desk(result.desk.id));
      closeSearch();
      return;
    }

    if (result.type === "notebook") {
      router.push(APP_ROUTES.notebook(result.desk.id, result.notebook.id));
      closeSearch();
    }
  }

  const triggerLabel = currentDeskName ? (
    <span className="truncate">
      <span className="font-bold text-primary">Desk</span>
      <span className="mx-1 text-muted-foreground">/</span>
      <span>{currentDeskName}</span>
      {currentNotebookTitle && (
        <>
          <span className="mx-1 text-muted-foreground">/</span>
          <span className="font-bold text-primary">Notebook</span>
          <span className="mx-1 text-muted-foreground">/</span>
          <span>{currentNotebookTitle}</span>
        </>
      )}
    </span>
  ) : (
    <span className="text-muted-foreground">Type to navigate</span>
  );

  return (
    <>
      <button
        type="button"
        onClick={openSearch}
        className={cn(
          "flex min-w-[220px] max-w-[520px] items-center justify-between gap-3 rounded-md bg-muted px-3 py-2 text-sm",
          "transition-colors hover:bg-muted/80 focus-visible:outline-2 focus-visible:outline-primary",
        )}
      >
        <span className="flex min-w-0 items-center gap-2">
          <Search className="size-4 shrink-0 text-muted-foreground" strokeWidth={3} />
          {triggerLabel}
        </span>
        <kbd className="inline-flex shrink-0 items-center gap-0.5 rounded border border-muted-foreground/40 bg-background px-2 py-1 font-mono text-xs font-semibold shadow-sm">
          <span>⌘</span>
          <span>K</span>
        </kbd>
      </button>

      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (!nextOpen) {
            setQuery("");
            return;
          }
          setQuery(currentSearchPath);
          selectHeadPath(currentSearchPath);
        }}
      >
        <DialogContent
          title="Search DeskShare"
          description="Jump between desks and notebooks without leaving the current layout."

        >
        <Command className="bg-surface border" shouldFilter={false}>
          <CommandInput
            ref={inputRef}
            autoFocus
            value={query}
            onValueChange={setQuery}
            placeholder="Where do you want to go?"
            onKeyDown={(event) => {
              if (event.key === "Enter" && firstNavigableResult) {
                event.preventDefault();
                navigateToResult(firstNavigableResult);
              }
              else if (event.key === "Tab" && firstNavigableResult) {
                event.preventDefault();
                setQuery(`${queryParts.deskQuery ? `${firstNavigableResult.desk.name} / ` : queryParts.notebookQuery ? `${firstNavigableResult.type === "notebook" ? firstNavigableResult.notebook.title : ""} / ` : ""}${firstNavigableResult.label}`);
                // Remaining focus in the input ensures Tab only autofills,
                // and does not move to the close button.
                setTimeout(() => {
                  inputRef.current?.focus();
                }, 0);
     
              inputRef.current?.setSelectionRange(0, 0);
         
              }
            }}
            
          />
          <CommandList>
            {isLoading ? (
              <CommandEmpty>Loading search...</CommandEmpty>
            ) : results.length === 0 ? (
              <CommandEmpty>No results found.</CommandEmpty>
            ) : null}

            {!queryParts.isNotebookMode && deskResults.length > 0 && (
              <CommandGroup>
              <span className="text-xs text-muted-foreground">Press tab to autofill; press enter to navigate.</span>
              <CommandSeparator alwaysRender />

              <CommandGroup heading="Desks">
                {deskResults.map((desk) => (
                  <CommandItem
                    key={`desk-${desk.id}`}
                    value={`desk-${desk.name}`}
                    onSelect={() => navigateToResult({ type: "desk", id: desk.id, label: desk.name, desk })}
                  >
                    <DoorOpen className="text-primary" strokeWidth={3} />
                    <span className="truncate">{desk.name}</span>
                    <CommandShortcut>{desk.notebooks.length} notebooks</CommandShortcut>
                  </CommandItem>
                ))}
              </CommandGroup>
              </CommandGroup>
            )}

            {notebookResults.length > 0 && (
              <CommandGroup heading={queryParts.isNotebookMode ? `Notebooks in ${activeNotebookDesk?.name ?? "desk"}` : "Notebooks"}>
                {notebookResults.map(({ desk, notebook }) => (
                  <CommandItem
                    key={`notebook-${notebook.id}`}
                    value={`notebook-${desk.name}-${notebook.title}`}
                    onSelect={() => navigateToResult({ type: "notebook", id: notebook.id, label: notebook.title, desk, notebook })}
                  >
                    <BookOpen className="text-primary" strokeWidth={3} />
                    <span className="truncate">{notebook.title}</span>
                    <CommandShortcut className="max-w-[160px] truncate">{desk.name}</CommandShortcut>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {userResults.length > 0 && (
              <CommandGroup heading="People">
                {userResults.map((profile) => (
                  <CommandItem
                    key={`user-${profile.userId}`}
                    value={`user-${getProfileLabel(profile)}`}
                    disabled
                  >
                    <UserRound className="text-muted-foreground" strokeWidth={3} />
                    <span className="truncate">{getProfileLabel(profile)}</span>
                    <CommandShortcut>Profile soon</CommandShortcut>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
         
        </Command>
        <DialogFooter className="text-xs block text-muted-foreground">
            <span>
              <span className="font-bold text-primary">Tip:</span> type <span className="font-medium text-foreground">name of desk / name of notebook</span> to search inside a desk.
            </span>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
