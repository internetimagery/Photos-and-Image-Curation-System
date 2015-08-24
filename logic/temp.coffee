# Temporary file creation and management
fs = require "fs"
path = require "path"
utility = require "./utility"

# Create a teporary file in the specified folder
# Callback (error, filename, fd, done) - done = removal function to be called
# Callback done (error)
temp = (source, suffix, callback)->
  tmpRoot = path.join source, "tmp"
  utility.mkdirs tmpRoot, (err)->
    if err then callback err, null else
      time = Date.now()
      suffix = if suffix then suffix else ".tmp"
      nameCheck = (name)->
        filename = name + suffix
        fileDir = path.join tmpRoot, filename
        fs.open fileDir, "wx", (err, fd)->
          if err and err.code isnt "EEXIST"
            callback err, null, null, null
          else if err
            nameCheck name - 1
          else
            done = (call)-> # Clean up file when done with it
              utility.cleanRemove fileDir, (err)->
                if err then call err else call null
            callback null, fileDir, fd, done
      nameCheck time, 0

#
#
# ArgParse = require "argparse/lib/argparse"
# .ArgumentParser
#
# parser = new ArgParse
#   version : "0.0.1"
#   addHelp : true
#   description : "Create a temporary file."
#
# args = parser.parseArgs()
#
# # src = path.resolve args.folder
# root = process.cwd()
# temp root, ".temp", (err, file, fd, done)->
#   if err then console.dir err else
#     console.log file
#     done (err)->
#       console.log err
#     temp root, ".temp", (err, file, fd, done)->
#       console.dir err
#       console.log file
#       done (err)->
#         console.log err
