import { TargetedEvent } from "preact/compat";
import { useMemo, useRef, useState } from "preact/hooks";
import { ContactBlock } from "./components/contactBlock";
import { Header } from "./components/header";
import { readInputFile } from "./helpers/helpers";
import { resetChecks, setFriends, useFOEStore } from "./helpers/store";
import { parseFindYourFriendsJson } from "./helpers/types";

enum Sorts {
  DEFAULT = "default",
  HANDLE = "handle",
  DISPLAY_NAME = "displayName",
}

export function App() {
  const friends = useFOEStore((state) => state.friends);
  const [searchQuery, setSearchQuery] = useState("");
  const [sorting, setSort] = useState<Sorts>(Sorts.DEFAULT);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayedItems = useMemo(() => {
    return (friends || [])
      ?.filter((f) => {
        const fields = [
          f.handle,
          f.displayName,
          f.url,
          ...f.contactCard.flatMap((e) => {
            return [e.service, e.value];
          }),
        ]
          .filter(Boolean)
          .map((f) => f?.toLowerCase());
        return fields.some((f) => f.includes(searchQuery.toLowerCase()));
      })
      .sort((a, b) => {
        if (sorting === Sorts.DEFAULT) {
          return 0;
        }

        if (sorting === Sorts.DISPLAY_NAME) {
          return a.displayName.localeCompare(b.displayName);
        }

        return a.handle.localeCompare(b.handle);
      });
  }, [friends, searchQuery, sorting]);

  const onImportClick = () => {
    if (!inputRef.current) {
      return;
    }

    inputRef.current.click();
  };

  const onFileChange = async (e: TargetedEvent<HTMLInputElement, Event>) => {
    if (!(e.target instanceof HTMLInputElement)) {
      return;
    }

    const raw = await readInputFile(e.target.files![0]);
    try {
      const parsedFriends = parseFindYourFriendsJson(raw);
      setFriends(parsedFriends);
    } catch (e) {
      alert(e);
    }
  };

  if (!friends) {
    return (
      <div class="app">
        <Header
          onFileChange={onFileChange}
          onImportclick={onImportClick}
          inputRef={inputRef}
        ></Header>
      </div>
    );
  }

  return (
    <div class="app">
      <Header>
        <input
          ref={inputRef}
          type="file"
          accept="application/json"
          onInput={onFileChange}
          style={{ display: "none" }}
        />
        <div class="reset-control">
          <button onClick={onImportClick}>
            Import another find-your-friends.json file
          </button>
          <button
            onClick={() => {
              if (
                confirm("Are you sure you want to reset all the checkboxes?")
              ) {
                resetChecks();
              }
            }}
          >
            Reset checkboxes
          </button>
        </div>
        <div class="controls-container">
          <label htmlFor="contactsSort">
            Sort by:{" "}
            <select
              name="contactsSort"
              id="contactsSort"
              onChange={(e) => {
                setSort((e.target as HTMLSelectElement).value as Sorts);
              }}
            >
              <option checked={sorting === Sorts.DEFAULT} value={Sorts.DEFAULT}>
                Default
              </option>
              <option checked={sorting === Sorts.HANDLE} value={Sorts.HANDLE}>
                Handle (A-Z)
              </option>
              <option
                checked={sorting === Sorts.DISPLAY_NAME}
                value={Sorts.DISPLAY_NAME}
              >
                Display Name (A-Z)
              </option>
            </select>
          </label>
          <label htmlFor="contactsSearch">
            Filter (works on all fields):{" "}
            <input
              id="contactsSearch"
              type="search"
              value={searchQuery}
              onInput={(e) =>
                setSearchQuery((e.target as HTMLInputElement).value)
              }
            />
          </label>
        </div>
      </Header>

      <div class="contacts">
        {displayedItems.map((friend) => {
          return (
            <ContactBlock
              friend={friend}
              key={`friend-${friend.handle}`}
            ></ContactBlock>
          );
        })}
      </div>
    </div>
  );
}
