# Albums and their functionality
fs = require "fs"
path = require "path"

print = (m)->
  console.dir m

# A new album
class Album
  constructor : (@root)->
    @struct = "Album_Structure.json" # File containing the albums information
    @defaults =
      last_check  : new Date()
      image_root  : "Photos"
      tag_root    : "Tags"
      format      : "<year>/<month>/<day>"

  # Create a new Album with optional overrides to the default settings
  new : (overrides)->
    # console.log "Attempting to create album in #{@root}"
    # Override defaults
    if overrides?
      for k, v of overrides
        @defaults[k] = v
    # @searchUp ()->


  searchUp : (callback)->
    # Ascend directories looking for struct file
    moveUp = (location)=>
      print "location #{location}"
      nextLoc = path.dirname location
      if location isnt nextLoc
        checkFile = path.join location, @struct
        fs.readFile checkFile, encoding: "utf8", (err, data)->
          if err and err.code isnt "ENOENT"
            throw err
          else if err # No file here? Moving on!
            moveUp nextLoc
          else # Found a file!
            print "FOUND FILE!"

        # moveUp path.dirname nextLoc
    moveUp @root




    # """
    # Create new album at root
    # """
    # def new(s, **overrides):
    #     print("Creating Album in ", s.root)
    #     s.settings = { # Default settings
    #         "last_check"    : time.time(), # last time all files were checked
    #         "image_root"    : "Photos", # Place for images to be saved
    #         "tag_root"      : "Tags", # Place for tags to be stored
    #         "datestore_format" : "%Y/%m/%d", # folder structure
    #         }
    #     s.settings = dict(s.settings, **overrides)
    #     utility.mkdir(s.root)
    #     with open(os.path.join(s.root, s.structure), "w") as f:
    #         json.dump(s.settings, f, indent=4, sort_keys=True)
    #     for entry in s.settings:
    #         if "root" in entry:
    #             utility.mkdir(os.path.join(s.root, s.settings[entry]))
    #     return s.root
    #
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
alb = new Album src
if args.n
  alb.new image_root: "two"
