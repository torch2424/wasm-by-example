const fs = require('fs');
const mkdirp = require('mkdirp');
const recursive = require('recursive-readdir');
const highlightJs = require('highlight.js');
const Mustache = require('mustache');

console.log('Building...');

const mustacheData = {
  normalizeCss: fs.readFileSync('node_modules/normalize.css/normalize.css', 'utf8'),
  sakuraCss: fs.readFileSync('node_modules/sakura.css/css/sakura-dark.css', 'utf8'),
  indexCss: fs.readFileSync('shell/index.css', 'utf8')
}

const readExamplesPromise = new Promise(resolve => {
  // Find all HTML Files within the demo directory, that are not specified
  recursive('./examples', ['**/demo/*']).then((files) => {
    resolve(files);
  });
});

const buildTask = async () => {

  // Create our build output folder
  mkdirp.sync('./dist');

  // Create our landing page
  const index = fs.readFileSync('shell/index.html', 'utf8').toString();
  const renderedIndex = Mustache.render(index, mustacheData);
  fs.writeFileSync('./dist/index.html', renderedIndex);

  // Create an object for each file that we found, and assign a filepath and name
  const exampleFiles = await readExamplesPromise;
  exampleFiles.forEach(filePath => {
  });  

  console.log('Done!');
};
buildTask();

