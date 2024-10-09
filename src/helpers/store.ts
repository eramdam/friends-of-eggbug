import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { restoreLocally } from "./persistence";
import { FindYourFriends, Friend } from "./types";

interface BearState {
  friends: FindYourFriends | undefined;
  checkedFriends: Record<string, boolean>;
}

export const useFOEStore = create<BearState>()(
  persist(
    () => ({
      friends: restoreLocally(),
      checkedFriends: {},
    }),
    {
      name: "bear-storage",
    },
  ),
);

export function setFriends(friends: FindYourFriends) {
  useFOEStore.setState((state) => {
    return {
      ...state,
      friends,
    };
  });
}

export function checkFriend(friend: Friend, bool: boolean) {
  useFOEStore.setState((state) => {
    return {
      ...state,
      checkedFriends: {
        ...state.checkedFriends,
        [friend.handle]: bool,
      },
    };
  });
}

export function resetChecks() {
  useFOEStore.setState((state) => {
    return {
      ...state,
      checkedFriends: {},
    };
  });
}
