# uglify-merge-js
Merge and Uglify JavaScript files in one step! It works similar to sass. That means you have to prepend all partials with a `_filename.js` (underscore) and need a root JavaScript file in which you use `import 'path/to/file';` to specify the files you want to merge. (uglify-merge-js uses uglify-js). You can also just merge a complete folder with JavaScript files without the Root JavaScript file. 

---

## Getting started

### Install
You need [NodeJS](https://nodejs.org/en/) to use uglify-merge-js. If you already have NodeJS then just use this command to install it:
```shell
npm install uglify-merge-js
```

---

## Usage
### Shell
This is a example how you could use uglify-merge.js. -s is the absolute source folder and -o is the ouput file which is relative to the source folder.
#### With a Root JavaScript file
```shell
uglify-merge -s path/to/source/folder -o ../path/to/output/file.min.js
```
You should also check out the other Arguments that you can use.
### Folder structure
This is how you should structure your JavaScript folder. It is important that every partials JavaScript file begins with a underscore (_).
* javascript
  * subfolder
    * _partial_3.js
  * _partial_1.js
  * _partial_2.js
  * root.js

### Root.js structure
The Root.js file list all files that should be included in the uglify-merge process.
```js
import 'partial_1';
import 'partial_2';
import 'subfolder/partial_3';
//import 'subfolder/partial_4'; // Uncomment with // to exclude files /**/ is not supported
```
#### Using hosted Javascript Files 
If you want to include external sources via http then just include them like this:
```js
import 'https://example.com/jQuery.js';
```
Please note that the file get cached. If you would like to download the file any time when using uglify-merge-js then you should use the nocache option `-n`
#### Additional cases
Sometimes you need to link directly to a file that don't have a underscore (_). You can achive this by including a exclamation mark (!) before the file name.
```import '../vendor/components/jquery/!jquery.slim';```

---

## Arguments
uglify-merge-js accept following Arguments:

---

### src

* Argument: `--src`
* Alias: `-s`
* Type: `String`
* Default: `./` (current folder)

Give the source folder where uglify-merge-js should start

---

### output

* Argument: `--output`
* Alias: `-o`
* Type: `String`
* Default: `scripts.min.js`

Specify the file name under which the reduced and merged file should be saved. You can also use `../../dist/js/filename.min.js` to access other folders (starting from source folder)

---

### uglify

* Argument: `--uglify`
* Alias: `-u`
* Type: `String`

Manipulate the [uglify-js api options](https://github.com/mishoo/UglifyJS2#api-reference). You need to provide a valid json string.
```shell
uglify-merge -s path/to/source/folder -o ../path/to/output/file.min.js -u '{"mangle":{"reserved":"yourVariable"}}'
```
In some cases you have to use another syntax for the `--uglify` paramater. For Example if you use the JetBrains File Watcher then you need to provide the Argument like this: `-u "{\"mangle\":{\"reserved\":\"yourVariable\"}}"`

---

### charset

* Argument: `--charset`
* Alias: `-c`
* Type: `String`
* Default: `utf8`

Set the charset with which you want to encode

---

### all

* Argument: `--all`
* Alias: `-a`
* Type: `Boolean`
* Default: `false`

Set this parameter if you want to merge without root JavaScript file. This deactivates the sass pattern variant and you have to delete the root.js. All JavaScript files will be read from the --src folder

```shell
uglify-merge -s path/to/source/folder -o ../path/to/output/file.min.js -a
```

---

### recursive

* Argument: `--recursive`
* Alias: `-r`
* Type: `Boolean`
* Default: `false`

Optionally set this parameter with --all to include subfolders as well

```shell
uglify-merge -s path/to/source/folder -o ../path/to/output/file.min.js -a -r
```

---

### quiet

* Argument: `--quiet`
* Alias: `-q`
* Type: `Boolean`
* Default: `false`

Hide the output during the process. So you have it a bit clearer in the shell window

---

### nocache

* Argument: `--nocache`
* Alias: `-n`
* Type: `Boolean`
* Default: `false`

Don't cache external resources.

---

### help

* Argument: `--help`
* Alias: `-h`
* Type: `Boolean`
* Default: `false`

Print usage guide

---

## Credits
[Marvin Schieler](https://arsors.de)
### Special thanks to:
[Victor Powell](https://stackoverflow.com/users/786374/victor-powell) - [Thread](https://stackoverflow.com/a/16684530)

[Titus](https://stackoverflow.com/users/1552587/titus) - [Thread](https://stackoverflow.com/a/54381158/7475811)

[Marco Sadowski](https://github.com/MarcoPNS)