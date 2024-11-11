import { useCallback, useEffect, useRef, useState } from "preact/hooks";

const MESSAGE_STORAGE_KEY = "migrator-message";

export function Migrator(props: { onMigrate: () => void }) {
  const isInIframe = window.top !== window.self;
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [hideIframe, setHideIframe] = useState(false);

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
    if (!isInIframe) {
      return;
    }

    window.addEventListener("message", (event) => {
      if (event.data.type !== MESSAGE_STORAGE_KEY) {
        console.log("Not the right message type, skipping");
        return;
      }
      const existingStorage = JSON.parse(
        localStorage.getItem("bear-storage") || "{}",
      ) as object;

      if (Object.entries(existingStorage).length > 0) {
        console.log("Storage already exists, skipping");
        return;
      }

      console.log("Restoring data");
      localStorage.setItem("bear-storage", JSON.stringify(event.data.data));
      setHideIframe(true);
      props.onMigrate();
    });
  });

  // Don't render when already inside an iframe.
  if (isInIframe || hideIframe) {
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
