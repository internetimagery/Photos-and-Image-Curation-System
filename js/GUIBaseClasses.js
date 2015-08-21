var GuiElement, GuiMouseEventCoordinator, print,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

print = function(m) {
  return console.dir(m);
};

GuiMouseEventCoordinator = (function() {
  function GuiMouseEventCoordinator(element) {
    this.element = element;
    this.remove = __bind(this.remove, this);
    this.add = __bind(this.add, this);
    this.element.addEventListener("mousemove", this._mousemove);
    this.element.addEventListener("mousedown", this._mousedown);
    this.element.addEventListener("mouseup", this._mouseup);
    this._eventRegistry = [];
  }

  GuiMouseEventCoordinator.prototype._mousedown = function(ev) {
    return console.log("Mouse down");
  };

  GuiMouseEventCoordinator.prototype._mouseup = function(ev) {
    return console.log("Mouse up");
  };

  GuiMouseEventCoordinator.prototype._mousemove = function(ev) {
    return console.log("Mouse moving");
  };

  GuiMouseEventCoordinator.prototype.add = function(gui) {
    console.log(this._eventRegistry.indexOf(gui));
    if (this._eventRegistry.indexOf(gui < 0)) {
      console.log("Adding");
      return this._eventRegistry.push(gui);
    }
  };

  GuiMouseEventCoordinator.prototype.remove = function(gui) {
    var index;
    console.dir(this._eventRegistry);
    index = this._eventRegistry.indexOf(gui);
    if (this._eventRegistry > -1) {
      return console.log(index);
    }
  };

  return GuiMouseEventCoordinator;

})();

GuiElement = (function() {
  function GuiElement(element) {
    this.element = element;
    this._mouseleave = __bind(this._mouseleave, this);
    this._mouseenter = __bind(this._mouseenter, this);
    this.registrar = GlobalMouse;
    this.element.addEventListener("mouseenter", this._mouseenter);
    this.element.addEventListener("mouseleave", this._mouseleave);
  }

  GuiElement.prototype._mouseenter = function(ev) {
    this.registrar.add(this);
    return console.log("Entered");
  };

  GuiElement.prototype._mouseleave = function(ev) {
    this.registrar.remove(this);
    return console.log("Left");
  };

  return GuiElement;

})();
