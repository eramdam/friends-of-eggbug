import { TargetedEvent } from "preact/compat";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { readInputFile } from "./helpers";
import { restoreLocally, saveLocally } from "./persistence";
import { FindYourFriends, parseFindYourFriendsJson } from "./types";

enum Sorts {
  DEFAULT = "default",
  HANDLE = "handle",
  DISPLAY_NAME = "displayName",
}

export function App() {
  const [friends, setFriends] = useState<FindYourFriends | undefined>(
    undefined
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<Sorts>(Sorts.DEFAULT);
  useEffect(() => {
    if (friends) {
      return;
    }

    const local = restoreLocally();

    if (local) {
      setFriends(local);
    }
  }, [friends]);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredItems = useMemo(() => {
    return (friends || [])?.filter((f) => {
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
    });
  }, [friends, searchQuery]);
  const sortedItems = useMemo(() => {
    if (sort === Sorts.DEFAULT) {
      return filteredItems;
    }

    return [...filteredItems].sort((a, b) => {
      if (sort === Sorts.DISPLAY_NAME) {
        return a.displayName.localeCompare(b.displayName);
      }

      return a.handle.localeCompare(b.handle);
    });
  }, [sort, filteredItems]);

  const onButtonClick = () => {
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
      saveLocally(parsedFriends);
    } catch (e) {
      alert(e);
    }
  };

  const renderEmptyContent = () => {
    return (
      <div class="starting">
        <div class="text">
          <p>
            This is a simple tool to easily filter through/visualize your
            "find-your-friends.json" file you got from your{" "}
            <a href="https://cohost.org">cohost</a> data export.
          </p>
          <p>
            Your data is <strong>not transmitted anywhere</strong>, and will be
            saved in your browser's storage so you can come back to this page
            later on.
          </p>
          <p>
            Just click the button below, select your `find-your-friends.json`
            file on your computer, and you're done!
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="application/json"
          onInput={onFileChange}
          style={{ display: "none" }}
        />
        <button onClick={onButtonClick}>
          Import your find-your-friends.json file
        </button>
      </div>
    );
  };

  const renderContactLink = (
    contactLink: FindYourFriends[number]["contactCard"][number]
  ) => {
    try {
      const parsedUrl = new URL(contactLink.value);

      return (
        <>
          <h5>{contactLink.service}</h5>
          <a href={parsedUrl.toString()} target="_blank" rel="noopener">
            {contactLink.value}
          </a>
        </>
      );
    } catch (e) {
      return (
        <>
          <h5>{contactLink.service}</h5>
          {contactLink.value}
        </>
      );
    }
  };

  if (!friends) {
    return <div class="app">{renderEmptyContent()}</div>;
  }

  return (
    <div class="app">
      <div class="reset-control">
        <button onClick={onButtonClick}>
          Import another find-your-friends.json file
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
            <option checked={sort === Sorts.DEFAULT} value={Sorts.DEFAULT}>
              Default
            </option>
            <option checked={sort === Sorts.HANDLE} value={Sorts.HANDLE}>
              Handle (A-Z)
            </option>
            <option
              checked={sort === Sorts.DISPLAY_NAME}
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

      <div class="contacts">
        {sortedItems.map((friend) => {
          return (
            <div key={`friend-${friend.handle}`} class="contact-block">
              <h3 class="contact-header">
                <a
                  href={`https://cohost.org/${friend.handle}`}
                  target="_blank"
                  rel="noopener"
                >
                  {friend.displayName} @{friend.handle}
                </a>
              </h3>

              <ul class="contact-links">
                {friend.url && (
                  <li class="contact-link">
                    <h5>url</h5>
                    <a href={friend.url ?? "#"} target="_blank" rel="noopener">
                      {friend.url ?? ""}
                    </a>
                  </li>
                )}
                {friend.contactCard.map((contact, index) => {
                  return (
                    <li
                      class="contact-link"
                      key={`contact-link-${contact.value}-${contact.service}-${contact.visibility}-${index}`}
                    >
                      {renderContactLink(contact)}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      {/* <table class="contacts">
        <tbody>
          {sortedItems.map((friend) => {
            return (
              <Fragment key={`friend-${friend.handle}`}>
                <tr class="contact-table-line">
                  <td class="contact-table-line-meta">
                    
                  </td>
                  <td class="contact-table-line-links">
                    
                  </td>
                </tr>
                <tr class="spacer"></tr>
              </Fragment>
            );
          })}
        </tbody>
      </table> */}
    </div>
  );
}
