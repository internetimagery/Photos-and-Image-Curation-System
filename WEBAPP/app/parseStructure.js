var ArgParse, args, parseString, parser, print;

print = function(m) {
  return console.dir(m);
};

parseString = function(string, date) {
  var match, pointer, reg, tokened;
  reg = /<(\w+)>/g;
  tokened = "";
  pointer = 0;
  while (match = reg.exec(string)) {
    tokened += string.substr(pointer, match.index - pointer);
    pointer = match.index + match[0].length;
  }
  tokened += string.substr(pointer, string.length - pointer);
  return print(tokened);
};

ArgParse = require("argparse/lib/argparse").ArgumentParser;

parser = new ArgParse({
  version: "0.0.1",
  addHelp: true,
  description: "Parse string into file structure"
});

parser.addArgument(["tokens"], {
  help: "The string to parse"
});

args = parser.parseArgs();

parseString(args.tokens, new Date());
