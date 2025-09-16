import command from "../config.json" assert { type: "json" };
import { HELP } from "./commands/help";
import { BANNER } from "./commands/banner";
import { ABOUT } from "./commands/about";
import { DEFAULT } from "./commands/default";
import { PROJECTS } from "./commands/projects";

// ----------------------- state -----------------------
let mutWriteLines = document.getElementById("write-lines");
let historyIdx = 0;
let tempInput = "";
let userInput: string;
let isPasswordInput = false;
let passwordCounter = 0;
let bareMode = false;
let isRoot = false;

// ----------------------- dom refs -----------------------
const WRITELINESCOPY = mutWriteLines;
const TERMINAL = document.getElementById("terminal");
const USERINPUT = document.getElementById("user-input") as HTMLInputElement;
const INPUT_HIDDEN = document.getElementById("input-hidden");
const PASSWORD = document.getElementById("password-input");
const PASSWORD_INPUT = document.getElementById(
  "password-field",
) as HTMLInputElement;

const PRE_HOST = document.getElementById("pre-host");
const PRE_USER = document.getElementById("pre-user");
const HOST = document.getElementById("host");
const USER = document.getElementById("user");

// Prefer #prompt-live if you updated index.html; fall back to legacy #prompt
const PROMPT_LIVE = document.getElementById(
  "prompt-live",
) as HTMLElement | null;
const PROMPT_LEGACY = document.getElementById("prompt") as HTMLElement | null;
const ACTIVE_PROMPT: HTMLElement | null = PROMPT_LIVE ?? PROMPT_LEGACY;

// ----------------------- config -----------------------
const COMMANDS = [
  "help",
  "about",
  "projects",
  "whoami",
  "repo",
  "banner",
  "clear",
  "sudo su",
  "exit",
  "ls",
  "rm -rf",
  "reboot",
];
const HISTORY: string[] = [];
const SUDO_PASSWORD = command.password;
const REPO_LINK = command.repoLink;
const originalUsername = command.username;

// ----------------------- helpers -----------------------
function setPromptSymbol(toHash: boolean) {
  if (!ACTIVE_PROMPT) return;
  ACTIVE_PROMPT.innerHTML = ACTIVE_PROMPT.innerHTML.replace(
    /:(?:\$|#)/,
    toHash ? ":#" : ":$",
  );
}

function switchToRoot() {
  isRoot = true;
  if (USER) USER.innerText = "root";
  if (PRE_USER) PRE_USER.innerText = "root";
  if (ACTIVE_PROMPT) {
    ACTIVE_PROMPT.innerHTML = `<span id="user">root</span>@<span id="host">${command.hostname}</span>:# ~`;
  } else {
    setPromptSymbol(true);
  }
}

function switchToUser() {
  isRoot = false;
  if (USER) USER.innerText = originalUsername;
  if (PRE_USER) PRE_USER.innerText = originalUsername;
  if (ACTIVE_PROMPT) {
    ACTIVE_PROMPT.innerHTML = `<span id="user">${originalUsername}</span>@<span id="host">${command.hostname}</span>:$ ~`;
  } else {
    setPromptSymbol(false);
  }
}

const scrollToBottom = () => {
  const MAIN = document.getElementById("main");
  if (!MAIN) return;
  MAIN.scrollTop = MAIN.scrollHeight;
};

// ----------------------- input handling -----------------------
function userInputHandler(e: KeyboardEvent) {
  const key = e.key;
  switch (key) {
    case "Enter":
      e.preventDefault();
      if (!isPasswordInput) enterKey();
      else passwordHandler();
      scrollToBottom();
      break;
    case "Escape":
      USERINPUT.value = "";
      break;
    case "ArrowUp":
      arrowKeys(key);
      e.preventDefault();
      break;
    case "ArrowDown":
      arrowKeys(key);
      break;
    case "Tab":
      tabKey();
      e.preventDefault();
      break;
  }
}

function enterKey() {
  if (!mutWriteLines || !ACTIVE_PROMPT) return;

  const resetInput = "";
  userInput = USERINPUT.value;

  const newUserInput = bareMode
    ? userInput
    : `<span class='output'>${userInput}</span>`;

  HISTORY.push(userInput);
  historyIdx = HISTORY.length;

  // handle clear early
  if (userInput === "clear") {
    commandHandler(userInput.toLowerCase().trim());
    USERINPUT.value = resetInput;
    userInput = resetInput;
    return;
  }

  // build the printed line after formatting the input
  const div = document.createElement("div");
  const promptHtml = ACTIVE_PROMPT.innerHTML; // copy live prompt without id
  div.innerHTML = `<span class="prompt-copy">${promptHtml}</span> ${newUserInput}`;

  if (mutWriteLines.parentNode) {
    mutWriteLines.parentNode.insertBefore(div, mutWriteLines);
  }

  if (userInput.trim().length !== 0) {
    commandHandler(userInput.toLowerCase().trim());
  }

  USERINPUT.value = resetInput;
  userInput = resetInput;
}

function tabKey() {
  const currInput = USERINPUT.value;
  for (const ele of COMMANDS) {
    if (ele.startsWith(currInput)) {
      USERINPUT.value = ele;
      return;
    }
  }
}

function arrowKeys(e: string) {
  switch (e) {
    case "ArrowDown":
      if (historyIdx !== HISTORY.length) {
        historyIdx += 1;
        USERINPUT.value = HISTORY[historyIdx];
        if (historyIdx === HISTORY.length) USERINPUT.value = tempInput;
      }
      break;
    case "ArrowUp":
      if (historyIdx === HISTORY.length) tempInput = USERINPUT.value;
      if (historyIdx !== 0) {
        historyIdx -= 1;
        USERINPUT.value = HISTORY[historyIdx];
      }
      break;
  }
}

// ----------------------- command handling -----------------------
function commandHandler(input: string) {
  const cmd = input.toLowerCase().replace(/\s+/g, " ").trim();

  // rm -rf with target
  if (cmd.startsWith("rm -rf") && cmd !== "rm -rf") {
    if (isRoot) {
      if (cmd === "rm -rf src" && !bareMode) {
        bareMode = true;

        setTimeout(() => {
          if (!TERMINAL || !WRITELINESCOPY) return;
          TERMINAL.innerHTML = "";
          TERMINAL.appendChild(WRITELINESCOPY);
          mutWriteLines = WRITELINESCOPY;
        });

        easterEggStyles();
        setTimeout(
          () =>
            writeLines(["What made you think that was a good idea?", "<br>"]),
          200,
        );
        setTimeout(
          () => writeLines(["Now everything is ruined.", "<br>"]),
          1200,
        );
      } else if (cmd === "rm -rf src" && bareMode) {
        writeLines(["there's no more src folder.", "<br>"]);
      } else {
        if (bareMode)
          writeLines(["What else are you trying to delete?", "<br>"]);
        else
          writeLines([
            "<br>",
            "Directory not found.",
            "type <span class='command'>'ls'</span> for a list of directories.",
            "<br>",
          ]);
      }
    } else {
      writeLines(["Permission not granted.", "<br>"]);
    }
    return;
  }

  switch (cmd) {
    case "clear":
      setTimeout(() => {
        if (!TERMINAL || !WRITELINESCOPY) return;
        TERMINAL.innerHTML = "";
        TERMINAL.appendChild(WRITELINESCOPY);
        mutWriteLines = WRITELINESCOPY;
      });
      break;

    case "reboot":
      writeLines(["Rebooting...", "<br>"]);
      setTimeout(() => location.reload(), 1000);
      break;

    case "banner":
      if (bareMode) {
        writeLines(["WebShell v1.0.0", "<br>"]);
        break;
      }
      writeLines(BANNER);
      break;

    case "help":
      if (bareMode) {
        writeLines(["Have you tried rebooting?", "<br>"]);
        break;
      }
      writeLines(HELP);
      break;

    case "whoami":
      writeLines([isRoot ? "root" : `${command.username}`, "<br>"]);
      break;

    case "about":
      if (bareMode) {
        writeLines(["Nothing to see here.", "<br>"]);
        break;
      }
      writeLines(ABOUT);
      break;

    case "projects":
      if (bareMode) {
        writeLines(["I don't want you to break the other projects.", "<br>"]);
        break;
      }
      writeLines(PROJECTS);
      break;

    case "repo":
      writeLines(["Redirecting to github.com...", "<br>"]);
      setTimeout(() => window.open(REPO_LINK, "_blank"), 500);
      break;

    case "rm -rf":
      if (bareMode) {
        writeLines(["don't try again.", "<br>"]);
        break;
      }
      if (isRoot)
        writeLines([
          "Usage: <span class='command'>'rm -rf &lt;dir&gt;'</span>",
          "<br>",
        ]);
      else writeLines(["Permission not granted.", "<br>"]);
      break;

    case "sudo su":
      if (bareMode) {
        writeLines(["no.", "<br>"]);
        break;
      }
      if (!PASSWORD) break;
      isPasswordInput = true;
      USERINPUT.disabled = true;
      if (INPUT_HIDDEN) (INPUT_HIDDEN as HTMLElement).style.display = "none";
      if (PASSWORD) (PASSWORD as HTMLElement).style.display = "block";
      setTimeout(() => PASSWORD_INPUT.focus(), 100);
      break;

    case "exit":
      if (!isRoot) {
        writeLines(["Not in a root shell.", "<br>"]);
        break;
      }
      switchToUser();
      writeLines(["<br>", "exit", "<br>"]);
      break;

    case "ls":
      if (bareMode) {
        writeLines(["", "<br>"]);
        break;
      }
      if (isRoot) writeLines(["src", "<br>"]);
      else writeLines(["Permission not granted.", "<br>"]);
      break;

    default:
      if (bareMode) {
        writeLines(["type 'help'", "<br>"]);
        break;
      }
      writeLines(DEFAULT);
      break;
  }
}

// ----------------------- output -----------------------
function writeLines(message: string[]) {
  message.forEach((item, idx) => displayText(item, idx));
}

function displayText(item: string, idx: number) {
  setTimeout(() => {
    if (!mutWriteLines) return;
    const p = document.createElement("p");
    p.innerHTML = item;
    mutWriteLines.parentNode!.insertBefore(p, mutWriteLines);
    scrollToBottom();
  }, 40 * idx);
}

// ----------------------- auth flow -----------------------
function revertPasswordChanges() {
  if (!INPUT_HIDDEN || !PASSWORD) return;
  PASSWORD_INPUT.value = "";
  USERINPUT.disabled = false;
  (INPUT_HIDDEN as HTMLElement).style.display = "block";
  (PASSWORD as HTMLElement).style.display = "none";
  isPasswordInput = false;
  setTimeout(() => USERINPUT.focus(), 200);
}

function passwordHandler() {
  if (PASSWORD_INPUT.value === SUDO_PASSWORD) {
    writeLines([
      "<br>",
      "PERMISSION GRANTED.",
      "Try <span class='command'>'rm -rf'</span>",
      "<br>",
    ]);
    revertPasswordChanges();
    PASSWORD_INPUT.value = "";
    passwordCounter = 0;
    switchToRoot();
    return;
  } else {
    PASSWORD_INPUT.value = "";
    passwordCounter++;
    if (passwordCounter >= 3) {
      writeLines([
        "<br>",
        "INCORRECT PASSWORD.",
        "PERMISSION NOT GRANTED.",
        "<br>",
      ]);
      revertPasswordChanges();
      passwordCounter = 0;
    }
  }
}

// ----------------------- easter egg -----------------------
function easterEggStyles() {
  const bars = document.getElementById("bars");
  const body = document.body;
  const main = document.getElementById("main");
  const span = document.getElementsByTagName("span");

  if (bars) {
    bars.innerHTML = "";
    bars.remove();
  }
  if (main) (main as HTMLElement).style.border = "none";

  body.style.backgroundColor = "black";
  body.style.fontFamily = "VT323, monospace";
  body.style.fontSize = "20px";
  body.style.color = "white";

  for (let i = 0; i < span.length; i++) {
    (span[i] as HTMLElement).style.color = "white";
  }

  if (USERINPUT) {
    USERINPUT.style.backgroundColor = "black";
    USERINPUT.style.color = "white";
    USERINPUT.style.fontFamily = "VT323, monospace";
    USERINPUT.style.fontSize = "20px";
  }
  if (ACTIVE_PROMPT) (ACTIVE_PROMPT as HTMLElement).style.color = "white";
}

// ----------------------- init -----------------------
const initEventListeners = () => {
  if (HOST) HOST.innerText = command.hostname;
  if (USER) USER.innerText = command.username;
  if (PRE_HOST) PRE_HOST.innerText = command.hostname;
  if (PRE_USER) PRE_USER.innerText = command.username;

  window.addEventListener("load", () => writeLines(BANNER));

  USERINPUT.addEventListener("keypress", userInputHandler);
  USERINPUT.addEventListener("keydown", userInputHandler);
  PASSWORD_INPUT.addEventListener("keypress", userInputHandler);

  window.addEventListener("click", () => USERINPUT.focus());

  console.log(
    `%cPassword: ${command.password}`,
    "color: red; font-size: 20px;",
  );
};

initEventListeners();
