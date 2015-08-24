# Albums and their functionality
fs = require "graceful-fs"
path = require "path"
store = require "./store"
finder = require "findit"
utility = require "./utility"

async = require "async"

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
      trash_root  : "Trash"
      tag_root    : "Tags"
      format      : "<year>/<month>/<day>"

  # Create a new Album with optional overrides to the default settings
  # Callback (error, albumpath)
  new : (rootDir, overrides, callback)=>
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
        callback new Error("Cannot create Album inside another"), null
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
  open : (rootDir, callback)=>
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
        callback new Error("Could not find Album"), null

  # Insert image into album
  # Callback (error, imagePath)
  add : (imagePath, callback)=>
    if @root
      imgRoot = path.join @root, @structSettings.image_root
      # Get path to the image
      store.storeFile imagePath, imgRoot, @structSettings.format, (err, store)->
        if err
          callback err, null
        else if store
          callback null, store
        else callback new Error("Not a valid path."), null
    else
      callback new Error("Album root is not defined"), null

  # Tag an image in the collection
  # Callback (error, tagPath)
  tag : (imagePath, tagName, callback)=>
    if @root
      tagDir = path.join @root, @structSettings.tag_root, tagName
      tagPath = path.join tagDir, path.basename imagePath
      utility.mkdirs tagDir, (err)->
        if err then callback err, null else
          fs.link imagePath, tagPath, (err)->
            if err and err.code isnt "EEXIST"
              callback err, null
            else
              callback null, tagPath
    else
      callback new Error("Album root is not defined"), null


  # Remove image from album
  # Callback (error, trashPath)
  remove : (imagePath, callback)=>
    if @root
      fs.stat imagePath, (err, stats)=>
        if err then callback err, null else
          if stats.nlink > 1 # If there are tags, remove them
            imageID = stats.ino
            tagDir = path.join @root, @structSettings.tag_root
            search = finder tagDir
            search.on "file", (file, stat)->
              if stat.ino is imageID
                tagName = path.basename path.dirname file
                console.log "Removing tag #{tagName}."
                utility.cleanRemove file, (err)->
                  if err then callback err, null
          trashDir = path.join @root, @structSettings.trash_root
          utility.mkdirs trashDir, (err)->
            if err then callback err, null else
              trashPath = path.join trashDir, path.basename imagePath
              fs.link imagePath, trashPath, (err)->
                if err and err.code isnt "EEXIST"
                  callback err, null
                else
                  utility.cleanRemove imagePath, (err)->
                    if err then callback err, null else
                      callback null, trashPath
    else
      callback new Error("Album root is not defined"), null


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
  help : "Insert a photo / image"
parser.addArgument ["-if"],
  help : "Import from folder"
parser.addArgument ["-t"],
  help : "Image to tag and tag name",
  nargs : 2
parser.addArgument ["-r"],
  help : "Remove a photo / image"

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
else if args.t
  src = path.resolve args.t[0]
  alb.open process.cwd(), (err, albumPath)->
    if err
      print err
    else if albumPath
      alb.tag src, args.t[1], (err, imgPath)->
        print err
        print imgPath
else if args.r
  src = path.resolve args.r
  alb.open process.cwd(), (err, albumPath)->
    if err
      print err
    else if albumPath
      alb.remove src, (err, trashPath)->
        print err
        print trashPath
else if args.if
  src = path.resolve args.if
  alb.open process.cwd(), (err, albumPath)->
    if err then console.log err.message else
      files = []
      search = finder src
      search.on "file", (file, stat)->
        ext = path.extname file
        .toLowerCase()
        check = [".jpg", ".jpeg", ".png", ".mov", ".mp4"]
        loc = check.indexOf ext
        if loc < 0
          # console.log "Skipped: #{file}"
        else
          # console.log "Adding: #{file}"
          alb.add file, (err, imgPath)->
            if err then console.log err.message
            console.log imgPath
          # files.push file
      # search.on "end", ()->
      #   count = 0
      #   async.each files, alb.add, (err)->
      #     console.log err

          #  (err, imgPath)->
          # if err then console.log err.message


          # alb.add file, (err, imgPath)->
          #   if err then console.log err.message
