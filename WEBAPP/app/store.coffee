# Save image into file

fs = require "fs"
tmp = require "tmp"
path = require "path"
crypto = require "crypto"

# Set tempfiles to be cleaned if an error occurrs
tmp.setGracefulCleanup()

print = (m)->
  console.dir m

# Generate a file path to store the file,
# and a staging area path that holds a copy of the file
storeDir = (filePath, callback)->
  tmp.file prefix: "photo-", _tempFileCreated = (err, tmpPath, fd, cleanTmp)->
    if err
      callback err, null
    else
      fs.stat filePath, (err, srcStats)->
        if err
          callback err, null
        else
          srcParts = path.parse filePath # The pieces of the filename
          src = fs.createReadStream filePath # Stream the files data
          hash = crypto.createHash "SHA256"
          hash.setEncoding "hex"
          src.on "error", (err)->
            callback err, null
          src.on "data", (buffer)->
            hash.update buffer
          src.on "end", ()->
            hash.end()
            filename = "#{hash.read()}-#{srcStats.size}#{srcParts.ext}"
            print filename
            print "done"

ArgParse = require "argparse/lib/argparse"
.ArgumentParser

parser = new ArgParse
  version : "0.0.1"
  addHelp : true
  description : "Generate a path to store or locate the file."

parser.addArgument ["source"],
  help : "The file to be stored."

args = parser.parseArgs()

src = path.resolve args.source
storeDir src, (err, dir)->
  print err
  print dir
