# Parse string into date time file format
moment = require "moment"

print = (m)->
  console.dir m

# year
# month
# monthname
# day
# dayname
# hour
# minute
# second
# millisecond

parseToken = (token, date)->
  dateTime = moment date
  replaced = switch token
    when "year" then dateTime.format("YYYY")
    when "month" then dateTime.format("MM")
    when "monthname" then dateTime.format("MMMM")
    when "day" then dateTime.format("DD")
    when "dayname" then dateTime.format("dddd")
    when "hours" then dateTime.format("HH")
    when "minute" then dateTime.format("mm")
    when "second" then dateTime.format("ss")
    when "milliseconds" then dateTime.format("SSS")

parseString = (string, date)->
  reg = /<(\w+)>/g
  tokened = ""
  pointer = 0
  # datetime = moment date
  while match = reg.exec string
    tokened += string.substr pointer, match.index - pointer
    pointer = match.index + match[0].length
    tokened += parseToken match[1], date
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
