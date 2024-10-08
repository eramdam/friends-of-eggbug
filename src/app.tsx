import { useState } from "preact/hooks";
import sampleData from "./assets/sampleJson.json";
import { Fragment } from "preact/jsx-runtime";

type FindYourFriends = ReadonlyArray<Friend>;

export interface Friend {
  contactCard: ContactCard[];
  displayName: string;
  handle: string;
  url: null | string;
}

export interface ContactCard {
  value: string;
  service: string;
  visibility: Visibility;
}

export enum Visibility {
  FollowingYou = "following-you",
  Follows = "follows",
  LoggedIn = "logged-in",
  Public = "public",
}

export function App() {
  const [friends, setFriends] = useState<FindYourFriends | undefined>(
    sampleData as FindYourFriends
  );
  console.log(friends);

  if (!friends) {
    return (
      <div class="app">
        <button>Import your friends-your-friends.json file</button>
      </div>
    );
  }

  return (
    <div class="app">
      <table class="contacts">
        {friends.map((friend) => {
          return (
            <Fragment key={friend.handle}>
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
                    {friend.contactCard.map((contact) => {
                      return (
                        <li class="contact-link" key={contact.value}>
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
      </table>
    </div>
  );
}
