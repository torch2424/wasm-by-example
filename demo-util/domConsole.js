// Set up a console element in the dom
const consoleElement = document.createElement("pre");
consoleElement.style = `border: 1px solid black`;
consoleElement.textContent = `
  DOM Console:
`;
document.body.appendChild(consoleElement);

export function domConsoleLog(string) {
  console.log(string);

  if (string === undefined) {
    string = "undefined";
  }

  consoleElement.textContent = `${consoleElement.textContent} 
  ${string}
  `;
}
