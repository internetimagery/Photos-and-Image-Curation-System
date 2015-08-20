app = require "app"
BrowserWindow = require "browser-window"

# Main window. Kept outside for scoping
mainWindow = null

# Close app on OSX when window is closed
app.on "window-all-closed", ()->
  if process.platform isnt "darwin"
    app.quit()

# When app is ready to begin. BEGIN!
app.on "ready", ()->
  mainWindow = new BrowserWindow
    width : 960
    height : 600

  # Load our first page
  mainWindow.loadUrl "file://#{__dirname}/gui/index.html"

  mainWindow.openDevTools() # I guess.... open development tools

  mainWindow.on "closed", ()->
    # Close window by removing reference to it.
    # Multiwindow app would have windows as an array.
    mainWindow = null
