# Tag files linking them in tag folder

fs = require "graceful-fs"
path = require "path"

print = (m)->
  console.dir m

# Link a file into a tag folder
# Callback (error, filePath)
tag = (root, file, tag, callback)->
  tagDir = path.join root, tag
  fs.mkdir tagDir, (err)->
    if err and not err.code is "EEXIST" then callback err, null else
      fileMeta = path.parse file
      fileDir = path.join tagDir, fileMeta.base
      fs.unlink fileDir, (err)->
        if err and err.code is not "ENOENT" then callback err, null else
          fs.link file, fileDir, (err)->
            if err and err.code is not "EEXIST" then callback err, null
            else
              callback null, fileDir

ArgParse = require "argparse/lib/argparse"
.ArgumentParser

parser = new ArgParse
  version : "0.0.1"
  addHelp : true
  description : "Tag file, moving it into folder and linking original file"

parser.addArgument ["folder"],
  help : "The folder tags reside in."
parser.addArgument ["source"],
  help : "The file to be tagged."
parser.addArgument ["tag"],
  help : "The tag name"

args = parser.parseArgs()

root = path.resolve args.folder
src = path.resolve args.source
tag root, src, args.tag, (err, path)->
  print err
  print path
