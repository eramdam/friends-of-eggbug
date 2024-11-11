import "@fontsource/atkinson-hyperlegible/400.css";
import "@fontsource/atkinson-hyperlegible/700.css";
import "@fontsource/atkinson-hyperlegible/400-italic.css";
import "@fontsource/atkinson-hyperlegible/700-italic.css";
import "./index.css";
import "@total-typescript/ts-reset";
import { render } from "preact";
import { App } from "./app.tsx";

import { Migrator } from "./components/migrator.tsx";
import { useState } from "preact/compat";
import { useFOEStore } from "./helpers/store.ts";

function Main() {
  const [showBanner, setShowBanner] = useState(false);
  const friends = useFOEStore((state) => state.friends);

  function maybeShowBanner() {
    if (!showBanner) {
      return null;
    }

    const mainPart = (
      <>
        This page now lives on{" "}
        <a href="https://friends-of-eggbug.erambert.me">
          friends-of-eggbug.erambert.me
        </a>{" "}
        and will redirect soon.
      </>
    );

    if (friends?.length) {
      return (
        <div class="migration-banner">
          {mainPart} Please update your bookmarks, your data should have been
          migrated.
        </div>
      );
    }

    return (
      <div class="migration-banner">
        {mainPart} Please update your bookmarks.
      </div>
    );
  }

  return (
    <main>
      {maybeShowBanner()}
      <Migrator
        onHasMigrated={() => {
          console.log("onHasMigrated");
          setShowBanner(true);
        }}
      />
      <App />
      <footer>
        <p>
          A tool by <a href="https://damien.zone">Damien Erambert</a>. Source
          code on{" "}
          <a href="https://github.com/eramdam/friends-of-eggbug">GitHub</a>{" "}
          <br />
          Not affiliated with <a href="https://cohost.org">Cohost</a> or{" "}
          <a href="https://antisoftware.club/">
            anti software software club llc
          </a>
        </p>
      </footer>
    </main>
  );
}

render(<Main />, document.getElementById("app")!);
