# Parse string into date time file format

print = (m)->
  console.dir m

parseString = (string, date)->
  reg = /<(\w+)>/g
  tokened = ""
  pointer = 0
  while match = reg.exec string
    tokened += string.substr pointer, match.index - pointer
    pointer = match.index + match[0].length
  tokened += string.substr pointer, string.length - pointer
  print tokened

ArgParse = require "argparse/lib/argparse"
.ArgumentParser

parser = new ArgParse
  version : "0.0.1"
  addHelp : true
  description : "Parse string into file structure"

parser.addArgument ["tokens"],
  help : "The string to parse"

args = parser.parseArgs()
parseString args.tokens, new Date()
