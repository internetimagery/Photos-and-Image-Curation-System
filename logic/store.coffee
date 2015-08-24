# Save image into file

fs = require "fs"
path = require "path"
crypto = require "crypto"
moment = require "moment"
utility = require "./utility"
ExifImage = require "exif"
            .ExifImage


# Possible tokens for folder structure

# <year>
# <month>
# <monthname>
# <day>
# <dayname>
# <12hour>
# <24hour>
# <minute>
# <second>
# <millisecond>
# <size>
# <model>

print = (m)->
  console.dir m

# Get exif data from an image
# Callback (error, exifdata)
getEXIFData = (file, callback)->
  try
    new ExifImage image : file , (err, data)->
      if err then callback err, null else callback null, data
  catch error
    callback error, null

# Grab metadata from the file and pull out a directory format
# callback (error, parsedPath)
parseDir = (filePath, structure, callback)->
  getEXIFData filePath, (err, exif)->
    if err then console.log "EXIF Warning: #{err.message}"
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
            when "12hour" then dateTime.format("hha")
            when "24hour" then dateTime.format("HH")
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
# Callback (error, {temp: "path to tempfile", dest: "relative proposed path"})
# and a staging area path that holds a copy of the file
storeFile = (src, dest, structure, callback)->
  fs.stat src, (err, srcStats)->
    if err then callback err, null else
      parseDir src, structure, (err, fileDir)->
        if err then console.log err.message
        fs.readFile src, (err, data)->
          if err then callback err, null else
            hash = crypto.createHash "SHA256"
            hash.update data
            fingerprint = hash.digest "hex"
            ext = path.extname src
            filename = "#{fingerprint}-#{srcStats.size}#{ext}"
            fileRoot = path.join dest, fileDir
            filePath = path.join fileRoot, filename
            # Finally got a file path to work with. Now does it exist?
            fs.access filePath, (err)->
              if err and err.code isnt "ENOENT"
                callback err, null
              else if err
                utility.mkdirs fileRoot, (err)->
                  if err then callback err, null else
                    fs.writeFile filePath, data, (err)->
                      if err then callback err, null else
                        callback null, filePath
              else
                console.log "Skipping duplicate: #{filePath}"
                callback null, filePath

# Export module
exports.storeFile = storeFile
#
# ArgParse = require "argparse/lib/argparse"
# .ArgumentParser
#
# parser = new ArgParse
#   version : "0.0.1"
#   addHelp : true
#   description : "Generate a path to store or locate the file."
#
# parser.addArgument ["source"],
#   help : "The file to be stored."
# parser.addArgument ["structure"],
#   help : "String to be converted into file structure."
#
# args = parser.parseArgs()
#
# src = path.resolve args.source
# storeFile src, args.structure, (err, dir)->
#   print err
#   print dir
