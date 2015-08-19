# Save a file to a path, creating it oif file doesn't exist
fs = require "fs"
path = require "path"

print = (m)->
  console.dir m

# Copy one file to another location even if does't exist
# Callback (error, filePath)
saveToPath = (source, dest, callback)->
  fs.open source, "r", (err, fd)->
    if err
      throw err
    else
      destSplit = path.parse(dest)
      dirs = destSplit.dir.split path.sep
      # Recursively create requested directory
      recurse = (index, dirs, callback)->
        if index <= dirs.length
          dir = dirs[..index].join path.sep
          fs.mkdir dir, (err)->
            if err and err.code is not "EEXIST"
              throw err
            recurse index + 1, dirs, callback
        else
          callback()
      if dirs.length
        recurse 1, dirs, ()->
          srcStream = fs.createReadStream source
          dstStream = fs.createWriteStream dest
          srcStream.pipe dstStream
          callback dest

ArgParse = require "argparse/lib/argparse"
.ArgumentParser

parser = new ArgParse
  version : "0.0.1"
  addHelp : true
  description : "Copy one file to another location"

parser.addArgument ["source"],
  help : "The existing file to be copied"

parser.addArgument ["destination"],
  help : "The location we want to copy into"

args = parser.parseArgs()


root = process.cwd()
src = path.resolve args.source
dst = path.resolve args.destination
saveToPath src, dst, (err, path)->
  console.dir "Returned path: #{path}"
