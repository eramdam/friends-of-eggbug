import "@total-typescript/ts-reset";
import { render } from "preact";
import { App } from "./app.tsx";
import "./index.css";

render(
  <main>
    <h1>Friends of Eggbug visualizer</h1>
    <App />
    <footer>
      <p>
        A tool by <a href="https://damien.zone">Damien Erambert</a>. Source code
        on <a href="https://github.com/eramdam/friends-of-eggbug">GitHub</a>{" "}
        <br />
        Not affiliated with <a href="https://cohost.org">Cohost</a> or{" "}
        <a href="https://antisoftware.club/">anti software software club llc</a>
      </p>
    </footer>
  </main>,
  document.getElementById("app")!
);
