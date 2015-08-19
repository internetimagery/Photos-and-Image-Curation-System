# Albums and their functionality
fs = require "fs"
path = require "path"
utility = require "./utility"

print = (m)->
  console.dir m

# A new album
class Album
  constructor : ()->
    @root = ""
    @structName = "structure.album" # File containing the albums information
    @structSettings =
      last_check  : new Date()
      image_root  : "Photos"
      tag_root    : "Tags"
      format      : "<year>/<month>/<day>"

  # Create a new Album with optional overrides to the default settings
  # Callback (error, albumpath)
  new : (rootDir, overrides, callback)->
    # console.log "Attempting to create album in #{@root}"
    # Override defaults
    if overrides?
      for k, v of overrides
        @structSettings[k] = v
    # First check we aren't already in an album
    utility.searchUp @structName, rootDir, (err, filePath)=>
      if err then callback err else
      if filePath? # Cannot create album inside another album
        callback null
      else
        # Create our files!
        fs.mkdir rootDir, (err)=>
          if err and err.code isnt "EEXIST" then callback err, null else
            structFile = path.join rootDir, @structName
            structData = JSON.stringify @structSettings, null, 2
            fs.writeFile structFile, structData, encoding: "utf8", (err)=>
              if err then callback err, null else
                @root = rootDir
                callback null, rootDir

  # Open an existing album
  # Callback (error, albumpath)
  open : (rootDir, callback)->
    utility.searchUp @structName, rootDir, (err, filePath)=>
      if err then callback err, null
      else if filePath
        fs.readFile filePath, encoding: "utf8", (err, data)=>
          if err then callback err, null else
            try
              # Parse out the data again
              stats = JSON.parse data
              stats.last_check = new Date stats.last_check
              @structSettings = stats
              @root = path.dirname filePath
              callback null, filePath
            catch err
              callback err, null
      else
        callback null, null

ArgParse = require "argparse/lib/argparse"
.ArgumentParser

parser = new ArgParse
  version : "0.0.1"
  addHelp : true
  description : "Tag file, moving it into folder and linking original file"

parser.addArgument ["-n"],
  help : "Create a new album?",
  action : "storeTrue"
parser.addArgument ["-o"],
  help : "Open existing album?",
  action : "storeTrue"

args = parser.parseArgs()

# src = path.resolve args.folder
alb = new Album()
if args.n
  alb.new process.cwd(), image_root: "two", (err, albDir)->
    if err then print err else print albDir
else if args.o
  alb.open process.cwd(), (err, albDir)->
    if err then print err else print albDir
