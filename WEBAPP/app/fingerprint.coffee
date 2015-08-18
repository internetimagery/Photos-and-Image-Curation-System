# Fingerprint a file
crypto = require "crypto"
fs = require "fs"
path = require "path"

fingerprint = (file, callback)->
  fd = fs.createReadStream file
  hash = crypto.createHash "SHA256"
  hash.setEncoding "hex"
  fd.on "error", (err)->
    callback err, null
  fd.on "end", ()->
    hash.end()
    callback null, hash.read()
  fd.pipe hash

ArgParse = require "argparse/lib/argparse"
.ArgumentParser

parser = new ArgParse
  version : "0.0.1"
  addHelp : true
  description : "Generate a unique hash from a file"

parser.addArgument ["source"],
  help : "The file to be hashed."

args = parser.parseArgs()

src = path.resolve args.source
fingerprint src, (err, hash)->
  console.dir err
  console.dir hash
