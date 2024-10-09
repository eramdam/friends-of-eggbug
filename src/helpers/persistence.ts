import { FindYourFriends, parseFindYourFriendsJson } from "../types";

const LOCAL_KEY = "findyourfriends-eggbug";
export function saveLocally(friends: FindYourFriends) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(friends));
}

export function restoreLocally() {
  const raw = localStorage.getItem(LOCAL_KEY);
  if (!raw) {
    return undefined;
  }
  return parseFindYourFriendsJson(raw);
}
