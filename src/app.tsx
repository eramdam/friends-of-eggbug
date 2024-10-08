import { TargetedEvent } from "preact/compat";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { Fragment } from "preact/jsx-runtime";
import { readInputFile } from "./helpers";
import { FindYourFriends, parseFindYourFriendsJson } from "./types";
import { restoreLocally, saveLocally } from "./persistence";

export function App() {
  const [friends, setFriends] = useState<FindYourFriends | undefined>(
    undefined
  );
  const [searchQuery, setSearchQuery] = useState("");
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

  if (!friends) {
    return (
      <div class="app">
        <div class="starting">
          <h2>Friends of eggbug visualizer</h2>
          <input
            ref={inputRef}
            type="file"
            accept="application/json"
            onInput={onFileChange}
            style={{ display: "none" }}
          />
          <button onClick={onButtonClick}>
            Import your friends-your-friends.json file
          </button>
        </div>
      </div>
    );
  }

  return (
    <div class="app">
      <div class="search-container">
        <label htmlFor="contactsSearch">
          Search:{" "}
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
      <table class="contacts">
        <tbody>
          {filteredItems.map((friend) => {
            return (
              <Fragment key={`friend-${friend.handle}`}>
                <tr class="contact-table-line">
                  <td class="contact-table-line-meta">
                    <h3 class="contact-header">
                      <a href={`https://cohost.org/${friend.handle}`}>
                        {friend.displayName} @{friend.handle}
                      </a>
                    </h3>
                    <span class="contact-url">
                      <a href={friend.url ?? "#"}>{friend.url ?? ""}</a>
                    </span>
                  </td>
                  <td class="contact-table-line-links">
                    <ul class="contact-links">
                      {friend.contactCard.map((contact, index) => {
                        return (
                          <li
                            class="contact-link"
                            key={`contact-link-${contact.value}-${contact.service}-${contact.visibility}-${index}`}
                          >
                            <h5>{contact.service}</h5>
                            <a
                              href={contact.value}
                              target="_blank"
                              rel="noopener"
                            >
                              {contact.value}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </td>
                </tr>
                <tr class="spacer"></tr>
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
