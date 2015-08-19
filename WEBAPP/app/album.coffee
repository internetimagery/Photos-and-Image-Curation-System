# Albums and their functionality
fs = require "fs"
path = require "path"

print = (m)->
  console.dir m

# A new album
class Album
  constructor : ()->
    @root = ""
    @struct = "structure.album" # File containing the albums information
    @defaults =
      last_check  : new Date()
      image_root  : "Photos"
      tag_root    : "Tags"
      format      : "<year>/<month>/<day>"

  # Create a new Album with optional overrides to the default settings
  new : (rootDir, overrides, callback)->
    # console.log "Attempting to create album in #{@root}"
    # Override defaults
    if overrides?
      for k, v of overrides
        @defaults[k] = v
    # First check we aren't already in an album
    @searchUp @struct, rootDir, (err, filePath)=>
      if err then callback err else
      if filePath? # Cannot create album inside another album
        callback null
      else
        # Create our files!
        fs.mkdir rootDir, (err)=>
          if err and err.code isnt "EEXIST" then callback err else
            structFile = path.join rootDir, @struct
            structData = JSON.stringify @defaults, null, 2
            fs.writeFile structFile, structData, encoding: "utf8", (err)=>
              if err then callback err else
                @root = rootDir
                callback rootDir

  # Search recursively for a file from a location. return (err, path)
  searchUp : (searchName, searchDir, callback)->
    # Ascend directories looking for file
    moveUp = (location)->
      nextLoc = path.dirname location
      if location is nextLoc then callback null, null else # Nothing found
        checkFile = path.join location, searchName
        fs.access checkFile, (err)->
          if err and err.code isnt "ENOENT" then callback err, null
          else if err then moveUp nextLoc
          else # Found a file!
            callback null, checkFile
    moveUp searchDir


    # """
    # Find an album
    # """
    # def open(s):
    #     root = utility.SearchUp(s.root, s.structure.replace(".", "\\."))
    #     if root:
    #         s.root = os.path.dirname(root)
    #         with open(root, "r") as f:
    #             s.settings = json.load(f)
    #         print("Loading Album from", s.root)
    #         return s.root
    #     else:
    #         print("No album found in", s.root)
    #         return None
    #
    # def getPhotoDir(s):
    #     return s.settings["image_root"]
    #
    # def getTagDir(s):
    #     return s.settings["tag_root"]
    #
    # def getRoot(s):
    #     return s.root
    #
    # def getName(s):
    #     return os.path.basename(s.root)









ArgParse = require "argparse/lib/argparse"
.ArgumentParser

parser = new ArgParse
  version : "0.0.1"
  addHelp : true
  description : "Tag file, moving it into folder and linking original file"

parser.addArgument ["folder"],
  help : "The folder to look for an album in."
parser.addArgument ["-n"],
  help : "Create a new album?",
  action : "storeTrue"

args = parser.parseArgs()

src = path.resolve args.folder
alb = new Album()
if args.n
  alb.new src, image_root: "two", (albDir)->
    print albDir
