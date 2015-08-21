(function() {
  var Animation, anim, elem,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Animation = (function() {
    function Animation(duration, style) {
      this.duration = duration;
      this.style = style;
      this.animStep = __bind(this.animStep, this);
      this.run = __bind(this.run, this);
      this.framerate = 25;
      this.strength = 1.5;
    }

    Animation.prototype.run = function(forward, callback) {
      var frame, progress, step, time;
      step = 1 / this.framerate / this.duration;
      progress = forward ? 0 : 1;
      time = Date.now();
      frame = (function(_this) {
        return function() {
          var now;
          now = Date.now();
          step = 0.001 * (now - time) / _this.duration;
          time = now;
          progress = forward ? progress + step : progress - step;
          if (progress < 1 && progress > 0) {
            callback(_this.animStep(progress));
            return requestAnimationFrame(frame);
          } else {
            return callback(forward ? 1 : 0);
          }
        };
      })(this);
      return requestAnimationFrame(frame);
    };

    Animation.prototype.animStep = function(progress) {
      var power;
      switch (this.style) {
        case "linear":
          return progress;
        case "quad":
          return Math.pow(progress, this.strength);
        case "circ":
          return 1 - Math.sin(Math.acos(progress));
        case "bow":
          return Math.pow(progress, 2) * ((this.strength + 1) * progress - this.strength);
        case "elastic":
          power = Math.pow(2, 10 * (progress - 1));
          return power * Math.cos(20 * Math.PI * this.strength / 3 * progress);
      }
    };

    return Animation;

  })();

  elem = document.getElementById("show-hide-sidebar");

  anim = new Animation(1, "bow");

  anim.strength = 1.5;

  anim.run(false, function(step) {
    console.log(step * 100);
    return elem.style.marginLeft = "" + (step * 100) + "px";
  });

  this.GuiElement = (function() {
    function GuiElement(element) {
      this.element = element;
    }

    return GuiElement;

  })();

  this.GuiInterractive = (function(_super) {
    __extends(GuiInterractive, _super);

    function GuiInterractive(element) {
      this.element = element;
      this._mouseup = __bind(this._mouseup, this);
      this._mousedown = __bind(this._mousedown, this);
      this._mousemove = __bind(this._mousemove, this);
      this._mouseleave = __bind(this._mouseleave, this);
      GuiInterractive.__super__.constructor.call(this, this.element);
      this.element.addEventListener("mouseleave", this._mouseleave);
      this.element.addEventListener("mousemove", this._mousemove);
      this.element.addEventListener("mousedown", this._mousedown);
      this.element.addEventListener("mouseup", this._mouseup);
      this._mousePressed = false;
      this._dragging = false;
      this._mousePos = null;
      this._dragBuffer = [-5, 5];
    }

    GuiInterractive.prototype._mouseleave = function(ev) {
      this._mousePressed = false;
      return this._dragging = false;
    };

    GuiInterractive.prototype._mousemove = function(ev) {
      var diffX, diffY;
      if (this._dragging) {
        this.dragging(ev);
      }
      if (this._mousePressed && this._mousePos) {
        diffX = this._mousePos.clientX - ev.clientX;
        diffY = this._mousePos.clientY - ev.clientY;
        if (!(this._dragBuffer[0] < diffY && diffY < this._dragBuffer[1])) {
          if (!(this._dragBuffer[0] < diffX && diffX < this._dragBuffer[1])) {
            return this._dragging = true;
          }
        }
      }
    };

    GuiInterractive.prototype._mousedown = function(ev) {
      this._mousePos = ev;
      return this._mousePressed = true;
    };

    GuiInterractive.prototype._mouseup = function(ev) {
      if (this._mousePressed && this._dragging) {
        this.dropped(ev);
      } else if (this._mousePressed) {
        this.clicked(ev);
      }
      this._mousePressed = false;
      return this._dragging = false;
    };

    GuiInterractive.prototype.dragging = function(ev) {};

    GuiInterractive.prototype.dropped = function(ev) {};

    GuiInterractive.prototype.clicked = function(ev) {};

    return GuiInterractive;

  })(GuiElement);

}).call(this);
