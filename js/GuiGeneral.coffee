# General GUI manipulation

# General Gui item
class GuiElement
  constructor : (@element)->

# Gui with interraction enabled
class GuiInterractive extends GuiElement
  constructor : (@element)->
    super @element
    @element.addEventListener "mouseleave", @_mouseleave
    @element.addEventListener "mousemove", @_mousemove
    @element.addEventListener "mousedown", @_mousedown
    @element.addEventListener "mouseup", @_mouseup
    @_mousePressed = false
    @_dragging = false
    @_mousePos = null
    @_dragBuffer = [-5, 5] # How much grace period do we give before drag
  _mouseleave : (ev)=>
    @_mousePressed = false
    @_dragging = false
  _mousemove : (ev)=>
    if @_dragging
      @dragging ev
    # Trigger Drag
    if @_mousePressed and @_mousePos
      diffX = @_mousePos.clientX - ev.clientX
      diffY = @_mousePos.clientY - ev.clientY
      if not (@_dragBuffer[0] < diffY and diffY < @_dragBuffer[1])
        if not (@_dragBuffer[0] < diffX and diffX < @_dragBuffer[1])
          @_dragging = true
  _mousedown : (ev)=>
    @_mousePos = ev
    @_mousePressed = true
  _mouseup : (ev)=>
    if @_mousePressed and @_dragging
      @dropped ev
    else if @_mousePressed
      @clicked ev
    @_mousePressed = false
    @_dragging = false
  dragging : (ev)->
    console.log "Dragging"
  dropped : (ev)->
    console.log "Dropped"
  clicked : (ev)->
    console.log "Clicked"



sidebarTrigger = document.getElementById "show-hide-sidebar"
testing = new GuiInterractive sidebarTrigger
