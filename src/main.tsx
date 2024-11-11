import "@fontsource/atkinson-hyperlegible/400.css";
import "@fontsource/atkinson-hyperlegible/700.css";
import "@fontsource/atkinson-hyperlegible/400-italic.css";
import "@fontsource/atkinson-hyperlegible/700-italic.css";
import "./index.css";
import "@total-typescript/ts-reset";
import { render } from "preact";
import { App } from "./app.tsx";

import { Migrator } from "./components/migrator.tsx";

function Main() {
  return (
    <main>
      <Migrator onMigrate={() => {}} />
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
