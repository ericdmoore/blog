const potrace = require('potrace'),
      fs = require('fs'),
      assert = require('assert'),
      getopts = require("getopts");
 
const opts = getopts(process.argv.slice(2), {
  alias: {
    h: "help",
    i: "in",
    t: "threshold",
    c: "color",
    bg: "background"
  },
  default: {
    help: false,
    color: "#cde4f4",
    background: "#f7f7f9",
    threshold: 114
  }
});

if(opts.help){
  console.log(`Poster Trace
  -------------`)
  console.log(`options: 
  -h -help : prints the array of options, description, and usage patterns
  -i -in : prints the array of options, description, and usage patterns
  -t -threshold : prints the array of options, description, and usage patterns
  -c -color : prints the array of options, description, and usage patterns
  -bg -background : prints the array of options, description, and usage patterns
  `);
  console.log(` Example 
  > node trace.js -i teapot.jpg
  
  - Looks for the filepath provided - analyzes the picture
  - Outputs a new file called "teapot.poster114.svg"
  - The new file is an svg poster file of the input - threshold using a threshold of 114 (max 255)
  `);
  console.log(``);
  return
}

assert.ok(opts.in, "(-i) input filename is required AND needs the full filename + extension")
let [file, extension] = opts.in.split(".")

assert.ok(file, "(-i) input filename is required and needs the full filename + extension")
assert.ok(extension, "(-i) input filename is required and needs the full filename + extension")
let fullFile = file + "." + extension;

// console.log(opts);
// console.log(fullFile)

var params = {
  background: '#f7f7f9', // off-white
  color: '#cde4f4', // faint-blue
  threshold: 114
};

potrace.trace( fullFile, params, function(err, svg) {
  if (err) throw err;
  fs.writeFileSync(`${file}.poster.svg`, svg);
  fs.writeFileSync(`${file}.poster${params.threshold}.svg`, svg);
});

console.log(`created new svg poster: ${file}.poster${params.threshold}.svg`);


