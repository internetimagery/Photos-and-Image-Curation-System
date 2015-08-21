# Gui functionality

# Sidebar
class GuiSidebar extends GuiInterractive
  constructor : (@trigger, @sidebarElement, @overlayElement)->
    super @trigger
    @sidebar = true
    @width = @sidebarElement.offsetWidth
    @animating = false
    @animation = new Animation 0.5, "overshoot"
  clicked : (ev)=>
    # Toggle sidebar
    if not @animating
      if @sidebar
        @animating = true
        @animation.run true, (done, step)=>
          placement = "#{parseInt step.x * @width}px"
          @sidebarElement.style.width = placement
          @overlayElement.style.left = placement
          if done
            @animating = false
            @sidebar = false
      else
        @animating = true
        @animation.run false, (done, step)=>
          placement = "#{parseInt step.x * @width}px"
          @sidebarElement.style.width = placement
          @overlayElement.style.left = placement
          if done
            @animating = false
            @sidebar = true


sidebarTrigger = document.getElementById "show-hide-sidebar"
sidebarElement = document.getElementById "sidebar-wrapper"
overlayElement = document.getElementById "main-wrapper"
sidebar = new GuiSidebar sidebarTrigger, sidebarElement, overlayElement
