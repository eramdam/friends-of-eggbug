import { useLayoutEffect, useRef, useState } from "preact/hooks";

const MESSAGE_STORAGE_KEY = "migrator-message";
const MESSAGE_STORAGE_RESPONSE_KEY = "migrator-message-response";

export function Migrator(props: { onHasMigrated: () => void }) {
  const isInIframe = window.top !== window.self;
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [hideIframe, setHideIframe] = useState(() => {
    return window.location.host === "friends-of-eggbug.erambert.me";
  });

  const onIframeLoad = () => {
    if (!isInIframe) {
      iframeRef.current?.contentWindow?.postMessage(
        {
          type: MESSAGE_STORAGE_KEY,
          data: JSON.parse(localStorage.getItem("bear-storage") || "{}"),
        },
        "*",
      );
    }
  };

  useLayoutEffect(() => {
    if (isInIframe) {
      return;
    }

    // Will run in the parent context.
    const onMessage = (event: MessageEvent) => {
      if (event.data.type !== MESSAGE_STORAGE_RESPONSE_KEY) {
        return;
      }

      if (event.data.data.hasMigrated) {
        props.onHasMigrated();
        setHideIframe(true);
      }
    };

    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
    };
  });

  useLayoutEffect(() => {
    if (!isInIframe || !window.top) {
      return;
    }

    // Should run inside the iframe.
    const onMessage = (event: MessageEvent) => {
      if (event.data.type !== MESSAGE_STORAGE_KEY) {
        console.log("Not the right message type, skipping");
        return;
      }
      const existingStorage = JSON.parse(
        localStorage.getItem("bear-storage") || "{}",
      ) as object;

      if (Object.entries(existingStorage).length > 0) {
        console.log("Storage already exists, skipping");
        window.top?.postMessage(
          { type: MESSAGE_STORAGE_RESPONSE_KEY, data: { hasMigrated: true } },
          "*",
        );
        return;
      }

      console.log("Restoring data");
      localStorage.setItem("bear-storage", JSON.stringify(event.data.data));
      window.top?.postMessage(
        { type: MESSAGE_STORAGE_RESPONSE_KEY, data: { hasMigrated: true } },
        "*",
      );
    };

    window.addEventListener("message", onMessage);

    return () => {
      window.removeEventListener("message", onMessage);
    };
  }, []);

  // Don't render when already inside an iframe or if the iframe should be hidden.
  if (isInIframe || hideIframe) {
    return null;
  }

  return (
    <iframe
      ref={iframeRef}
      src="https://friends-of-eggbug.erambert.me/"
      onLoad={onIframeLoad}
      style={{ pointerEvents: "none", opacity: 0, position: "absolute" }}
    ></iframe>
  );
}
