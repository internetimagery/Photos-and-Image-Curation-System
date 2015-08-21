# Gui functionality

# Sidebar
class GuiSidebar extends GuiInterractive
  constructor : (@trigger, @sidebarElement, @overlayElement)->
    super @trigger
    @sidebar = true
    @width = "200px"
    @animating = false
  clicked : (ev)=>
    # Toggle sidebar
    if not @animating
      if @sidebar
        console.log "Push sidebar in"
        @sidebar = false
      else
        console.log "Pull sidebar out"
        @sidebar = true

sidebarTrigger = document.getElementById "show-hide-sidebar"
sidebarElement = document.getElementById "sidebar-wrapper"
overlayElement = document.getElementById "main-wrapper"
sidebar = new GuiSidebar sidebarTrigger, sidebarElement, overlayElement
