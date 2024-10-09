import { Friend } from "../helpers/types";

interface ContactBlockProps {
  friend: Friend;
}

export function ContactBlock(props: ContactBlockProps) {
  const { friend } = props;

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

  return (
    <div class="contact-block">
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
}
