# General GUI classes

# Bezier Curve
class Bezier
  constructor : (pt1_x, pt1_y, pt2_x, pt2_y)->
    @src = x: 0, y: 0 # Start of Curve
    @dest = x: 1, y: 1 # End of Curve
    @ctrl1 = x: pt1_x, y: pt1_y # Sources' control point
    @ctrl2 = x: pt2_x, y: pt2_y # Destinations' control point
    @position = x: 0, y: 0
  plot : (point)=> # Point is between 0 and 1
    x1 = @src.x * @_b1 point
    x2 = @ctrl1.x * @_b2 point
    x3 = @ctrl2.x * @_b3 point
    x4 = @dest.x * @_b4 point
    y1 = @src.y * @_b1 point
    y2 = @ctrl1.y * @_b2 point
    y3 = @ctrl2.y * @_b3 point
    y4 = @dest.y * @_b4 point
    x: x1 + x2 + x3 + x4
    y: y1 + y2 + y3 + y4
  _b1: (t)->
    t * t * t
  _b2: (t)->
    3 * t * t * (1 - t)
  _b3: (t)->
    3 * t * (1 - t) * (1 - t)
  _b4: (t)->
    (1 - t) * (1 - t) * (1 - t)

# Animate things to look fancy
# run Callback (done, step)
class @Animation
  constructor : (@duration, style, pt...)->
    @framerate = 24 # Framerate
    @strength = 1.5 # Strength of some acceleration options
    @acceleration = "linear"
    @curve = switch style
      when "linear"
        new Bezier 0.25, 0.25, 0.75, 0.75
      when "overshoot"
        new Bezier 1.4, 1.6, 1, 1
      when "smooth"
        new Bezier 1, 0, 1, 0
      when "custom"
        new Bezier pt[0], pt[1], pt[2], pt[3]
  run : (forward, callback)=>
    progress = if forward then 0 else 1
    time = Date.now()
    fps = 1000 / @framerate
    frame = ()=>
      now = Date.now()
      elapsed = now - time
      if elapsed > fps then elapsed = fps
      setTimeout ()=>
        now = Date.now()
        elapsed = now - time
        time = now
        step = 0.001 * elapsed / @duration
        progress = if forward then progress + step else progress - step
        if progress < 1 and progress > 0
          callback false, @curve.plot @animStep progress
          window.requestAnimationFrame frame
        else
          callback true, @curve.plot if forward then 1 else 0
      , fps - elapsed
    window.requestAnimationFrame frame
  animStep : (progress)=>
    switch @acceleration
      when "linear"
        progress
      when "quad"
        Math.pow progress, @strength
      when "circ"
        1 - Math.sin Math.acos progress
      when "bow"
        Math.pow(progress, 2) * ((@strength + 1) * progress - @strength)
      when "elastic"
        power = Math.pow 2, 10 * (progress - 1)
        power * Math.cos 20 * Math.PI * @strength / 3 * progress

# Testing
# elem = document.getElementById "show-hide-sidebar"
# anim = new Animation 0.5, "overshoot", -0.25, -0.1, 1, 1
# anim.run false, (step)->
#   console.log "X: #{step.x}, Y: #{step.y}"
#   elem.style.marginLeft = "#{step.x * 100}px"
#   elem.style.marginTop = "#{step.y * 100}px"


# General Gui item
class @GuiElement
  constructor : (@element)->

# Gui with interraction enabled
class @GuiInterractive extends GuiElement
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
  dropped : (ev)->
  clicked : (ev)->
