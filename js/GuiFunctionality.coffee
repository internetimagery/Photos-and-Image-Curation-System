# Gui functionality

# Sidebar
class GuiSidebar extends GuiInterractive
  constructor : (@trigger, @sidebarElm, @overlayElm)->
    super @trigger
    @sidebar = true
    @width = "200px"
    @animating = false
    @animation = new Animation 2, "linear"
  clicked : (ev)=>
    # Toggle sidebar
    if not @animating
      if @sidebar
        console.log "Push sidebar in"
        @sidebar = false
        @animating = true
        @animation.run true, (done, step)=>
          # console.log step.x
          sidebarElement.style.width = "#{parseInt step.x * 200}.px"
          if done
            @animating = false
            console.log "done"
      else
        console.log "Pull sidebar out"
        @sidebar = true

sidebarTrigger = document.getElementById "show-hide-sidebar"
sidebarElement = document.getElementById "sidebar-wrapper"
overlayElement = document.getElementById "main-wrapper"
sidebar = new GuiSidebar sidebarTrigger, sidebarElement, overlayElement
