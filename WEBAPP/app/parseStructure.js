var ArgParse, args, moment, parseString, parseToken, parser, print;

moment = require("moment");

print = function(m) {
  return console.dir(m);
};

parseToken = function(token, date) {
  var dateTime, replaced;
  dateTime = moment(date);
  return replaced = (function() {
    switch (token) {
      case "year":
        return dateTime.format("YYYY");
      case "month":
        return dateTime.format("MM");
      case "monthname":
        return dateTime.format("MMMM");
      case "day":
        return dateTime.format("DD");
      case "dayname":
        return dateTime.format("dddd");
      case "hour":
        return dateTime.format("HH");
      case "minute":
        return dateTime.format("mm");
      case "second":
        return dateTime.format("ss");
      case "millisecond":
        return dateTime.format("SSS");
    }
  })();
};

parseString = function(string, date) {
  var match, pointer, reg, tokened;
  reg = /<(\w+)>/g;
  tokened = "";
  pointer = 0;
  while (match = reg.exec(string)) {
    tokened += string.substr(pointer, match.index - pointer);
    pointer = match.index + match[0].length;
    tokened += parseToken(match[1], date);
  }
  return tokened += string.substr(pointer, string.length - pointer);
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

print(parseString(args.tokens, new Date()));
