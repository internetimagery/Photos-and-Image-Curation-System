# Albums and their functionality
fs = require "fs"
path = require "path"
utility = require "./utility"
store = require "./store"

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
      if err
        callback err, null
      else if filePath? # Cannot create album inside another album
        callback name: "Error", message: "Cannot create Album inside another", null
      else
        # Create our files!
        utility.mkdirs rootDir, (err)=>
          if err then callback err, null else
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
        callback name: "Error", message: "Could not find Album", null

  # Insert image into album
  # Callback (error, imagePath)
  add : (imagePath, callback)->
    if @root
      imgRoot = path.join @root, @structSettings.image_root
      # Get path to the image
      store.storeFile imagePath, imgRoot, @structSettings.format, (err, store)->
        if err
          callback err, null
        else if store
          callback null, store
        else callback name: "Error", message: "Not a valid path.", null

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
parser.addArgument ["-i"],
  help : "Insert a photo / image",

args = parser.parseArgs()

# src = path.resolve args.folder
alb = new Album()
if args.n
  alb.new process.cwd(), {}, (err, albumPath)->
    if err then print err else print albumPath
else if args.o
  alb.open process.cwd(), (err, albumPath)->
    if err then print err else print albumPath
else if args.i
  src = path.resolve args.i
  alb.open process.cwd(), (err, albumPath)->
    if err
      print err
    else if albumPath
      alb.add src, (err, imgPath)->
        print err
        print imgPath
