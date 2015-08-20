#!/usr/bin/env node

var ArgParser = require("argparse/lib/argparse").ArgumentParser;

var parser = new ArgParser({
    version : "0.0.1",
    addHelp : true,
    description : "MY ARG PARSER"
});

parser.addArgument(
  ["-f", "--foo"],
  {
    help : "this is a foo argument",
    action : "storeTrue"
  }
);
parser.addArgument(
  ["-b", "--bee"],
  {
    help : "beee!"
  }
);
var args = parser.parseArgs();

console.dir(args);
