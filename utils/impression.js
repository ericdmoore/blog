const { spawn } = require('child_process')
      fs = require('fs'),
      assert = require('assert'),
      getopts = require("getopts");

const modes = {
  COMBO:{num:0,prefix:'combo'},
  TRIANGLE:{num:1,prefix:'tri'},
  RECT:{num:2,prefix:'rect'},
  ELLIPSE:{num:3,prefix:'elip'},
  CIRCLE:{num:4,prefix:'cir'},
  ROTATEDRECT:{num:5,prefix:'rorect'},
  BEZIERS:{num:6,prefix:'bez'},
  ROTATEDELLIPSE:{num:7,prefix:'roelip'},
  POLYGON:{num:7,prefix:'poly'}
};
Object.freeze(modes);

// @see: https://github.com/fogleman/primitive
const opts = getopts(process.argv.slice(2), {
  alias: {
    h: "help",
    i: "input",
    o: "output",
    n: "numSteps",
    r: "resize",
    s: "size",
    a: "alpha",
    m: "mode",
    v: "verbose",
    vv: "very_verbose"
  },
  default: {
    // be sure to new vars to the cmd_args too
    help: false,
    i: "teapot.jpg",
    o: "output.svg",
    n: 150,
    r: 256,
    s: 512,
    a: 128,
    m: modes.TRIANGLE,
    v: false,
    vv: false,
  }
});

let [file, extension] = opts.i.split(".");
if(!opts["output"]){
  opts["output"] = `${file}-${opts.m.prefix}-${opts.n}.svg`;
  opts["o"]= opts["output"];  
}

let cmd_args = [ 
 `-i`, opts.i
,`-o`, opts.o
,`-n`, opts.n
,`-r`, opts.r
,`-s`, opts.s
,`-a`, opts.a
,`-m`, opts.m.num]

if(opts.v){
    cmd_args.push("-v")
}
if(opts.vv){
    cmd_args.push("-vv")
}

const primitive_go = spawn("primitive", cmd_args);
console.log(primitive_go.spawnargs.join(" "))
console.log("processing image...")

primitive_go.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

primitive_go.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

primitive_go.on('close', (code) => {
  console.log(`created file: ${opts.o}`);
});
