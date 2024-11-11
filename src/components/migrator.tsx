import { useCallback, useEffect, useLayoutEffect, useRef } from "preact/hooks";

const MESSAGE_STORAGE_KEY = "migrator-message";

export function Migrator(props: { onHasMigrated: () => void }) {
  const isInIframe = window.top !== window.self;
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const messageHandler = useRef<(e: MessageEvent) => void | null>(null);

  const onIframeLoad = useCallback(() => {
    if (!isInIframe) {
      iframeRef.current?.contentWindow?.postMessage(
        {
          type: MESSAGE_STORAGE_KEY,
          data: JSON.parse(localStorage.getItem("bear-storage") || "{}"),
        },
        "*",
      );
    }
  }, []);

  useEffect(() => {
    messageHandler.current = (event: MessageEvent) => {
      if (event.data.type !== MESSAGE_STORAGE_KEY) {
        console.log("Not the right message type, skipping");
        return;
      }
      const existingStorage = JSON.parse(
        localStorage.getItem("bear-storage") || "{}",
      ) as object;

      if (Object.entries(existingStorage).length > 0) {
        console.log("Storage already exists, skipping");
        props.onHasMigrated();
        return;
      }

      console.log("Restoring data");
      localStorage.setItem("bear-storage", JSON.stringify(event.data.data));
      props.onHasMigrated();
    };
  }, []);

  useLayoutEffect(() => {
    if (!isInIframe) {
      return;
    }

    const onMessage = (event: MessageEvent) => {
      messageHandler.current?.(event);
    };

    window.addEventListener("message", onMessage);

    return () => {
      window.removeEventListener("message", onMessage);
    };
  }, []);

  // Don't render when already inside an iframe.
  if (isInIframe) {
    return null;
  }

  return (
    <iframe
      ref={iframeRef}
      src="http://test.localhost:5174/"
      onLoad={onIframeLoad}
      style={{ pointerEvents: "none", opacity: 0, position: "absolute" }}
    ></iframe>
  );
}
