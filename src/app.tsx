import { useState } from "preact/hooks";
import sampleData from "./assets/sampleJson.json";
import "./app.css";

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
      <table class="contacts-list">
        <thead>
          <td>display name / handle</td>
          <td>url</td>
          <td>other links</td>
        </thead>
        <tbody>
          {friends.map((friend) => {
            return (
              <tr key={friend.handle}>
                <td>
                  {friend.displayName} @{friend.handle}
                </td>
                <td>{friend.url}</td>
                <td>
                  <ul>
                    {friend.contactCard.map((contact) => {
                      return (
                        <li key={contact.value}>
                          {contact.service} {contact.value}
                        </li>
                      );
                    })}
                  </ul>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
