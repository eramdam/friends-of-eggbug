import { checkFriend, useFOEStore } from "../helpers/store";
import { Friend } from "../helpers/types";

interface ContactBlockProps {
  friend: Friend;
}

const avatarCutoff = new Date(`2024-12-31T00:00:00.000+00:00`);
const now = new Date();
const shouldShowAvatars = now <= avatarCutoff;

export function ContactBlock(props: ContactBlockProps) {
  const { friend } = props;
  const isChecked = useFOEStore(
    (state) => state.checkedFriends[friend.handle] ?? false,
  );

  const renderContactLink = (contactLink: Friend["contactCard"][number]) => {
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
  const inputId = `friend-${friend.handle}-input`;

  return (
    <div class="contact-block">
      <div class="contact-header">
        {shouldShowAvatars && (
          <img
            src={`https://cohost-avatar-proxy.erambert.me/avatar/${friend.handle}`}
            alt=""
            height={30}
            width={30}
            loading={"lazy"}
            decoding={"async"}
          />
        )}
        <h3>
          <a
            href={`https://cohost.org/${friend.handle}`}
            target="_blank"
            rel="noopener"
          >
            {friend.displayName} @{friend.handle}
          </a>
        </h3>
        <label class="contact-checkbox" htmlFor={inputId}>
          seen
          <input
            type="checkbox"
            id={inputId}
            checked={isChecked}
            onClick={() => {
              checkFriend(friend, !isChecked);
            }}
          />
        </label>
      </div>

      {!isChecked && (
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
      )}
    </div>
  );
}
