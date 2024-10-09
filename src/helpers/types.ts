import { z } from "zod";

const visibilityEnum = [
  "following-you",
  "follows",
  "logged-in",
  "public",
] as const;
const VisibilityEnum = z.enum(visibilityEnum);

const findYourFriendsSchema = z.array(
  z.object({
    contactCard: z.array(
      z.object({
        value: z.string(),
        service: z.string(),
        visibility: VisibilityEnum,
      }),
    ),
    displayName: z.string(),
    handle: z.string(),
    url: z.nullable(z.string()),
  }),
);

export type FindYourFriends = z.infer<typeof findYourFriendsSchema>;
export type Friend = FindYourFriends[number];

export function parseFindYourFriendsJson(raw: string) {
  try {
    const json = JSON.parse(raw);

    const parsed = findYourFriendsSchema.parse(json);

    return parsed;
  } catch (e) {
    throw new Error("This doesn't look like a `find-your-friends.json` file.");
  }
}
