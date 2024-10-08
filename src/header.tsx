import { PropsWithChildren, RefObject, TargetedEvent } from "preact/compat";
import { FindYourFriends } from "./types";

interface HeaderProps {
  friends: FindYourFriends | undefined;
  onImportclick: () => void;
  onFileChange: (e: TargetedEvent<HTMLInputElement, Event>) => void;
  inputRef: RefObject<HTMLInputElement>;
}

export function Header(props: PropsWithChildren<HeaderProps>) {
  if (!props.friends) {
    return (
      <header>
        <h1>Friends of eggbug visualizer</h1>
        <div class="starting">
          <div class="text">
            <p>
              This is a simple tool to easily filter through/visualize your
              "find-your-friends.json" file you got from your{" "}
              <a href="https://cohost.org">cohost</a> data export.
            </p>
            <p>
              Your data is <strong>not transmitted anywhere</strong>, and will
              be saved in your browser's storage so you can come back to this
              page later on.
            </p>
            <p>
              Just click the button below, select your `find-your-friends.json`
              file on your computer, and you're done!
            </p>
          </div>
          <input
            ref={props.inputRef}
            type="file"
            accept="application/json"
            onInput={props.onFileChange}
            style={{ display: "none" }}
          />
          <button onClick={props.onImportclick}>
            Import your find-your-friends.json file
          </button>
        </div>
      </header>
    );
  }
  return (
    <header>
      <h1>Friends of eggbug visualizer</h1>

      {props.children}
    </header>
  );
}
