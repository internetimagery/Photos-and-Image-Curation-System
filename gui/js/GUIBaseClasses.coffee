# GUI Manipulation

print = (m)->
  console.dir m

# Register mouse events Globally
class GuiMouseEventCoordinator
  constructor : (@element)->
    @element.addEventListener "mousemove", @_mousemove
    @element.addEventListener "mousedown", @_mousedown
    @element.addEventListener "mouseup", @_mouseup
    @_eventRegistry = []
  _mousedown : (ev)->
    console.log "Mouse down"
  _mouseup : (ev)->
    console.log "Mouse up"
  _mousemove : (ev)->
    console.log "Mouse moving"
  add : (gui)=>
    console.log @_eventRegistry.indexOf gui
    if @_eventRegistry.indexOf gui < 0
      console.log "Adding"
      @_eventRegistry.push gui
  remove : (gui)=>
    console.dir @_eventRegistry
    index = @_eventRegistry.indexOf gui
    if @_eventRegistry > -1
      console.log index

GlobalMouse = new GuiMouseEventCoordinator document.getElementById "main-window"

# A Gui Element
class GuiElement
  constructor : (@element)->
    @registrar = GlobalMouse
    @element.addEventListener "mouseenter", @_mouseenter
    @element.addEventListener "mouseleave", @_mouseleave
  _mouseenter : (ev)=>
    @registrar.add @
    console.log "Entered"
  _mouseleave : (ev)=>
    @registrar.remove @
    console.log "Left"

GuiMenu = new GuiElement document.getElementById "menubar"
#
#
# # A GUI element
# class GuiWindow
#   constructor : (@element)->
#     @element.addEventListener "mousemove", @_mousemove
#     @element.addEventListener "mousedown", @_mousedown
#     @element.addEventListener "mouseup", @_mouseup
#     @element.addEventListener "mouseenter", @_mouseenter
#     @element.addEventListener "mouseleave", @_mouseleave
#     @_dragCheck = false
#   _mouseenter : (ev)->
#     console.log "Mouse Entered"
#   _mouseleave : (ev)->
#     console.log "Mouse Left"
#   _mousemove : (ev)=>
#     @_dragCheck = true
#     # @dragging ev
#   _mouseup : (ev)=>
#     if @_dragCheck
#       @dragged ev
#     else
#       @clicked ev
#   _mousedown : (ev)=>
#     @_dragCheck = false
#   clicked : (ev)->
#     console.log "Clicked"
#   dragged : (ev)->
#     console.log "Dragged"
#   # dragging : (ev)->
#   #   console.log "Dragging!"
#
# class MenuItemRoot extends GuiWindow
#   # constructor : (@element)->
#   #   super @element
#   # clicked : (ev)->
#   #   console.log "hey I got clicked"
#
#
# # Top menubar
# for m in document.querySelectorAll ".menubar-item-root"
#   print m
# # GUI_Menu = new Menu document.getElementById "menubar"
