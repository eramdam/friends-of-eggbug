import { useState } from "preact/hooks";
import sampleData from "./assets/sampleJson.json";

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
  const [friends, setFriends] = useState<FindYourFriends | undefined>([
    ...sampleData,
    ...sampleData,
    ...sampleData,
    ...sampleData,
  ] as FindYourFriends);
  console.log(friends);

  if (!friends) {
    return (
      <div class="app">
        <button>Import your friends-your-friends.json file</button>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="contacts">
        {friends.map((friend) => {
          return (
            <div class="contact" key={friend.handle}>
              <h3 class="contact-header">
                <a href={`https://cohost.org/${friend.handle}`}>
                  {friend.displayName} @{friend.handle}
                </a>
              </h3>
              <span class="contact-url">
                <a href={friend.url ?? "#"}>{friend.url ?? ""}</a>
              </span>

              <ul class="contact-links">
                {friend.contactCard.map((contact) => {
                  return (
                    <li class="contact-link" key={contact.value}>
                      <h5>{contact.service}</h5>
                      <a href={contact.value} target="_blank" rel="noopener">
                        {contact.value}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
