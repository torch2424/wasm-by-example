// Set up a console element in the dom
const consoleElement = document.createElement("div");
document.body.appendChild(consoleElement);

export function domConsoleLog(string) {
  if (string === undefined) {
    string = "undefined";
  }

  consoleElement.textContent = `${consoleElement.textContent}
  ${string}
  `;
}
