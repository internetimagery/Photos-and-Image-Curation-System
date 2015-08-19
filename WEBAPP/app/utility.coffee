# Utility functions
fs = require "fs"
path = require "path"

# Search recursively for a file from a location
# Callback (err, path)
searchUp = (searchName, searchDir, callback)->
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

# Export functions
exports.searchUp = searchUp
