#!/usr/bin/env node

/**
 * Init colors
 */
const cError  ="\x1b[41m\x1b[30m",
      cReset  ="\x1b[0m",
      cBright = "\x1b[1m";

/**
 * Init package.json
 */
var pjson = require('./package.json');

/**
 * Init command-line-commandLineArgs
 * Init command-line-usage
 */
const optionDefinitions = [
  { name: 'src', alias: 's', type: String, defaultValue: "./" },       // Source folder
  { name: 'output', alias: 'o', type: String, defaultValue: "scripts.min.js" }, // Output folder/path/filename.min.js
  { name: 'all', alias: 'a', type: Boolean, defaultValue: false },              // Get all js files from source folder
  { name: 'recursive', alias: 'r', type: Boolean, defaultValue: false },        // (Optional for -all) Read all files recursive from source folder
  { name: 'charset', alias: 'c', type: String, defaultValue: "utf8" },          // Set charset
  { name: 'quiet', alias: 'q', type: Boolean, defaultValue: false },            // Quiet Shell Mode
  { name: 'help', alias: 'h', type: Boolean, defaultValue: false }              // Print Help
];
const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const options = commandLineArgs(optionDefinitions);

/**
 * Set line element for log
 */
const line = '---------------';
const newLine = '\n'+line;

/**
 * Draw logo
 */
if (!options.quiet) console.log('\n' + ' █    ██   ▄████  ██▓     ██▓  █████▒▓██   ██▓    ███▄ ▄███▓▓█████  ██▀███    ▄████ ▓█████ ' + '\n' + ' ██  ▓██▒ ██▒ ▀█▒▓██▒    ▓██▒▓██   ▒  ▒██  ██▒   ▓██▒▀█▀ ██▒▓█   ▀ ▓██ ▒ ██▒ ██▒ ▀█▒▓█   ▀ ' + '\n' + '▓██  ▒██░▒██░▄▄▄░▒██░    ▒██▒▒████ ░   ▒██ ██░   ▓██    ▓██░▒███   ▓██ ░▄█ ▒▒██░▄▄▄░▒███   ' + '\n' + '▓▓█  ░██░░▓█  ██▓▒██░    ░██░░▓█▒  ░   ░ ▐██▓░   ▒██    ▒██ ▒▓█  ▄ ▒██▀▀█▄  ░▓█  ██▓▒▓█  ▄ ' + '\n' + '▒▒█████▓ ░▒▓███▀▒░██████▒░██░░▒█░      ░ ██▒▓░   ▒██▒   ░██▒░▒████▒░██▓▒██▒░▒▓███▀▒░▒████▒' + '\n' + '░▒▓▒ ▒ ▒  ░▒   ▒ ░ ▒░▓  ░░▓   ▒ ░       ██▒▒▒    ░ ▒░   ░  ░░░ ▒░ ░░ ▒▓ ░▒▓░ ░▒   ▒ ░░ ▒░ ░' + '\n' + '░░▒░ ░ ░   ░   ░ ░ ░ ▒  ░ ▒ ░ ░       ▓██ ░▒░    ░  ░      ░ ░ ░  ░  ░▒ ░ ▒░  ░   ░  ░ ░  ░' + '\n' + ' ░░░ ░ ░ ░ ░   ░   ░ ░    ▒ ░ ░ ░     ▒ ▒ ░░     ░      ░      ░     ░░   ░ ░ ░   ░    ░   ' + '\n' + '   ░           ░     ░  ░ ░           ░ ░               ░      ░  ░   ░           ░    ░  ░' + '\n' + '                                      ░ ░                                     version ' + pjson.version + '\n');

/**
 * Print help
 */
if (options.help) printHelp();

/**
 * Init fs
 */
var fs = require('fs');

/**
 * Init uglify-js
 */
var UglifyJS = require("uglify-js");

/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-*/

/**
 * Stop script when -r is set but -a not
 */
if (options.recursive && !options.all)
  throw cError+"You set --recursive (-r) without --all (-a)"+cReset;

/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-*/

/**
 * Run application
 */
// Get source path
const path = (options.src.endsWith("/")) ? options.src : options.src+"/"; // Add / if there is none at the end
// Get all filenames by source path
const filenames = (!options.all) ? getFilenamesFromRootJs(path) : (!options.recursive) ? getFilenamesFromFolder(path) : getFilenamesFromFolderRecursive(path);
// Save files content in object
const content = getContentOfFiles(filenames);
// Uglify file content
const contentUglifyString = setContentUglified(content);
// Delete uglified file
dropFileMinified(path);
// Write uglified file
setFileMinified(path);
// Return
var quiet = (options.quiet) ? "Pssst... " : "";
console.log(quiet+"All files are uglified and merged!\n");

/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-*/

/**
 * Get all filenames from src path
 */
function getFilenamesFromFolder(dir) {
  try {
    var files = fs.readdirSync(dir);
    if (!options.quiet) console.log("Files in Folder:", JSON.stringify(files), newLine);
    return files;
  }
  catch(err) {
    throw cError+"Cant't find Source-Folder: "+dir+cReset;
  }
}

/**
 * Get all filenames from src path (recursive)
 * thx to: Victor Powell (https://stackoverflow.com/a/16684530)
 */
function getFilenamesFromFolderRecursive(dir) {
  try {
    var results = [];
    var list = fs.readdirSync(dir);
    list.forEach(function(file) {
      file = dir + file;
      var stat = fs.statSync(file);
      if (stat && stat.isDirectory()) {
        /* Recurse into a subdirectory */
        results = results.concat(getFilenamesFromFolderRecursive(file + "/"));
      } else {
        /* Is a file */
        file_type = file.split(".").pop();
        file_name = file.split(/(\\|\/)/g).pop();
        if (file_type == "js") results.push(file);
      }
    });
    if (!options.quiet) console.log("Finding recursive files:", JSON.stringify(results), newLine);
    return results;
  }
  catch(err) {
    throw cError+"Cant't find Source-Folder: "+dir+cReset;
  }
}

/**
 * Get all filenames from root js
 */
function getFilenamesFromRootJs(dir) {
  try {
    var files = fs.readdirSync(dir);
    var filenames = [];
    // Find root file and exlude filenames
    files.forEach(function(file) {
      if (
       file.indexOf('.js') !== -1         // if it is a javascript file
       && file.indexOf('.min.js') === -1  // exlude .min.js file
       && file.charAt(0) !== "_"          // exlude partials file
      ) {
        // Check if file string starts path
        var file = (file.startsWith(path)) ? file : path+file;
        // Read content out of file
        var content = fs.readFileSync(file).toString(options.charset);
        // Get filenames from content by regex
        filenames = getFilenamesFromRootJsContent(content);
        if (!options.quiet) console.log("Filenames from "+file+":", JSON.stringify(filenames), newLine);
      } else {
        // Skip file
        //if (!options.quiet) console.log("Not root file:", file);
      }
    });
    if (filenames.length !== 0) return filenames;
    else throw cError+"No root JavaScript file was found!"+cReset;
  }
  catch(err) {
    throw cError+"Cant't find Source-Folder: "+dir+cReset;
  }
}

/**
 * Get all filenames from root js content
 * Simultaneously to the sass pattern
 */
function getFilenamesFromRootJsContent(content) {
  // Get path/filenames from content (remove import, ", ;, /, by regex)
  // thx to: Titus (https://stackoverflow.com/a/54381158/7475811)
  var filenames = [];
  const regex = /[\S]*(?<!\/\/)import[^"'`]*["'`]\/*([^;]+)["'`][^;]*;/gm
  while ((m = regex.exec(content)) !== null) {
    // Prevent regex endless loop
    if (m.index === regex.lastIndex) regex.lastIndex++;
    // Add .js, if is missing
    let filename = m[1]
    if (!filename.endsWith(".js")) {
      filename = `${filename}.js`
    }
    // Add _ before file, if is missing
    filename = filename.replace(/(\/|^)([^_][^/]+\.js)$/, "$1_$2")
    // Push
    filenames.push(filename)
  }
  return filenames;
}

/**
 * Get content of filenames
 */
function getContentOfFiles(filenames) {
  var content = {};

  // for each file in files
  filenames.forEach(function(file) {
    if (
     file.endsWith('.js') // if it is a javascript file
     && !file.endsWith('.min.js') // exlude .min.js file
    ) {
      // Check if file string starts path
      var file = (file.startsWith(path)) ? file : path+file;
      // Read content out of file
      content[file] = fs.readFileSync(file).toString(options.charset);
      if (!options.quiet) console.log(cBright+"Add the file:", file+cReset);
    } else {
      // Skip file
      if (!options.quiet) console.log("Ignore the file:", file);
    }
  });

  if (!options.quiet) console.log(line);
  return content;
}

/**
 * Uglify content
 */
function setContentUglified(content) {
  // Uglify the content;
  var contentUglify = UglifyJS.minify(content);

  // On syntax error
  if (contentUglify.error)
    throw cError+JSON.stringify(contentUglify.error)+cReset;

  if (!options.quiet) console.log("Code was uglified!", newLine);

  // Convert contentUglify (object) to on string
  return Object.keys(contentUglify).map(function(key){return contentUglify[key]}).toString(options.charset);
}

/**
 * Delete uglified file
 */
function dropFileMinified(path) {
  var absoluteOutputFilePath = path + options.output;

  // Check if minified file exists, if so: delete!
  if (fs.existsSync(absoluteOutputFilePath)) {
    fs.unlinkSync(absoluteOutputFilePath);
    if (!options.quiet) console.log("Delete existing uglified file:", options.output, newLine);
  }
}

/**
 * Write uglified file
 */
function setFileMinified(path) {
  var absoluteOutputFilePath = path + options.output;

  // Write minified file
  try {
    fs.writeFileSync(absoluteOutputFilePath, contentUglifyString, options.charset);
  }
  catch(err) {
    throw cError+"Can't find folder to save file or folder is not writeable: "+absoluteOutputFilePath+cReset;
  }

  if (!options.quiet) console.log("Create uglified file:", options.output, newLine);
}

/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-*/

/**
 * Draw help
 */
function printHelp() {
  const sections = [
    {
      header: 'uglify-merge-js',
      content: 'Merge and Uglify JavaScript files in one step! It works similar to sass. That means you have to prepend all partials with a _filename.js (underscore) and need a root JavaScript file in which you use import "path/to/file"; to specify the files you want to merge. (uglify-merge-js uses uglify-js)'
    },
    {
      header: 'Required parameters',
      optionList: [
        {
          name: 'src',
          alias: 's',
          typeLabel: '{underline String}',
          description: 'Give the source folder where uglify-merge-js should start. Default is ./'
        },
        {
          name: 'output',
          alias: 'o',
          typeLabel: '{underline String}',
          description: 'Specify the file name under which the reduced and merged file should be saved. You can also use ../../dist/js/filename.min.js to access other folders (starting from source folder). Default is scripts.min.js'
        }
      ]
    },
    {
      header: 'Optional parameters',
      optionList: [
        {
          name: 'charset',
          alias: 'c',
          typeLabel: '{underline String}',
          description: 'Set the charset with which you want to encode. Default is utf8'
        },
        {
          name: 'all',
          alias: 'a',
          typeLabel: '{underline Boolean}',
          description: 'Set this parameter if you want to merge without root JavaScript file. This deactivates the sass pattern variant and you have to delete the root.js. All JavaScript files will be read from the --src folder.'
        },
        {
          name: 'recursive',
          alias: 'r',
          typeLabel: '{underline Boolean}',
          description: 'Optionally set this parameter with --all to include subfolders as well.'
        },
        {
          name: 'quiet',
          alias: 'q',
          typeLabel: '{underline Boolean}',
          description: 'Hide the output during the process. So you have it a bit clearer in the shell window.'
        },
        {
          name: 'help',
          alias: 'h',
          description: 'Print this usage guide.'
        }
      ]
    }
  ]
  const usage = commandLineUsage(sections)
  console.log(usage)
  process.exit();
}
