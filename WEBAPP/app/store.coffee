# Save image into file

fs = require "fs"
tmp = require "tmp"
path = require "path"
crypto = require "crypto"
moment = require "moment"
ExifImage = require "exif"
            .ExifImage


# Set tempfiles to be cleaned if an error occurrs
tmp.setGracefulCleanup()


# Possible tokens for folder structure

# <year>
# <month>
# <monthname>
# <day>
# <dayname>
# <hour>
# <minute>
# <second>
# <millisecond>
# <size>
# <model>

print = (m)->
  console.dir m

# Get exif data from an image
# Return (error, exifdata)
getEXIFData = (file, callback)->
  try
    new ExifImage image : file , (err, data)->
      if err
        callback err, null
      else
        callback null, data
  catch error
    callback error, null

# Grab metadata from the file and pull out a directory format
parseDir = (filePath, structure, callback)->
  getEXIFData filePath, (err, exif)->
    if err
      console.log "EXIF Warning: #{err.message}"
    fs.stat filePath, (err, stats)->
      if err
        callback err, null
      else
        creation = stats.birthtime # Time file was created. Fallback
        reg = /^(\d+):(\d+):(\d+)(.+)/
        # Replace dividers with something that can be parsed
        if exif and exif.exif.DateTimeOriginal
          creation = new Date exif.exif.DateTimeOriginal.replace reg,
                    "$1/$2/$3 $4"
        else if exif and exif.exif.CreateDate
          creation = new Date exif.exif.CreateDate.replace reg,
                    "$1/$2/$3 $4"
        dateTime = moment creation


        parseToken = (token)->
          replaced = switch token
            when "year" then dateTime.format("YYYY")
            when "month" then dateTime.format("MM")
            when "monthname" then dateTime.format("MMMM")
            when "day" then dateTime.format("DD")
            when "dayname" then dateTime.format("dddd")
            when "hour" then dateTime.format("HH")
            when "minute" then dateTime.format("mm")
            when "second" then dateTime.format("ss")
            when "millisecond" then dateTime.format("SSS")
            when "size" then stats.size
            when "model" then exif.image.Model if exif and exif.image.Model else "unknown"

        reg = /<(\w+)>/g
        tokenPath = ""
        pointer = 0
        while match = reg.exec structure
          tokenPath += structure.substr pointer, match.index - pointer
          pointer = match.index + match[0].length
          tokenPath += parseToken match[1]
        tokenPath += structure.substr pointer, structure.length - pointer
        callback null, tokenPath.replace /[\<\>\:\"\'\|]/, ""
        # Sanitize file dir

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
          parseDir filePath, structure, (err, fileDir)->
            if err
              console.log err.message
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
                print fileDir
                filename = "#{hash.read()}-#{srcStats.size}#{srcParts.ext}"
                callback null, path.join fileDir, filename

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
