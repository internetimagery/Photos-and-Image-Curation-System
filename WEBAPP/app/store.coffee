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
storeDir = (filePath, structure, callback)->
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
          dest = fs.createWriteStream tmpPath, fd : fd
          hash = crypto.createHash "SHA256"
          hash.setEncoding "hex"
          src.on "error", (err)->
            callback err, null
          dest.on "error", (err)->
            callback err, null
            # Might callback twice, but it's with an error so who cares
          src.on "data", (buffer)->
            hash.update buffer
            dest.write buffer
          src.on "end", ()->
            hash.end()
            dest.end()
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
parser.addArgument ["structure"],
  help : "String to be converted into file structure."

args = parser.parseArgs()

src = path.resolve args.source
storeDir src, args.structure, (err, dir)->
  print err
  print dir
