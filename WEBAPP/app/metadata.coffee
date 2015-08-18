# Parse date into a file format and grab exit metadata
moment = require "moment"
ExifImage = require "exif"
.ExifImage
path = require "path"
fs = require "fs"
_ = require "underscore"

print = (m)->
  console.dir m

# Get exif data from an image
# Return (error, exifdata)
getMetadata = (file, callback)->
  try
    new ExifImage image : file , (err, data)->
      if err
        callback err, null
      else
        callback null, data
  catch error
    callback error, null

# Get the date a file was created. Either by EXIF data or OS information
getCreationDate = (file, callback)->
  fs.stat file, (err, stats)->
    if err
      callback err, null
    else
      creation = stats.birthtime
      getMetadata file, (err, exif)->
        if err
          # Couldn't gather EXIF data. Return creation date
          console.log err.message
          callback null, creation
        else
          if exif and not _.isEmpty exif.exif
            print "EMPTY"
          else if exif and not _.isEmpty exif.image
            print exif.image
          else
            print type creation
            # callback null, creation

  # getMetadata file, (err, data)->
  #   print data
  #   if err
  #     print err
  #   if data and data.exif
  #     print data.exif
  #   else if data and data.image
  #     print data.image
  #   else
  #     fs.stat file, (err, stats)->
  #       if err
  #         print err.message
  #       print stats
# print moment().format()



ArgParse = require "argparse/lib/argparse"
.ArgumentParser

parser = new ArgParse
  version : "0.0.1"
  addHelp : true
  description : "Grab metadata from file."

parser.addArgument ["source"],
  help : "The file to grab data from"

args = parser.parseArgs()


src = path.resolve args.source
getCreationDate src, (err, data)->
  print err
  print data
