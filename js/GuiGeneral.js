(function() {
  var Bezier,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Bezier = (function() {
    function Bezier(pt1_x, pt1_y, pt2_x, pt2_y) {
      this.plot = __bind(this.plot, this);
      this.src = {
        x: 0,
        y: 0
      };
      this.dest = {
        x: 1,
        y: 1
      };
      this.ctrl1 = {
        x: pt1_x,
        y: pt1_y
      };
      this.ctrl2 = {
        x: pt2_x,
        y: pt2_y
      };
      this.position = {
        x: 0,
        y: 0
      };
    }

    Bezier.prototype.plot = function(point) {
      var x1, x2, x3, x4, y1, y2, y3, y4;
      x1 = this.src.x * this._b1(point);
      x2 = this.ctrl1.x * this._b2(point);
      x3 = this.ctrl2.x * this._b3(point);
      x4 = this.dest.x * this._b4(point);
      y1 = this.src.y * this._b1(point);
      y2 = this.ctrl1.y * this._b2(point);
      y3 = this.ctrl2.y * this._b3(point);
      y4 = this.dest.y * this._b4(point);
      return {
        x: x1 + x2 + x3 + x4,
        y: y1 + y2 + y3 + y4
      };
    };

    Bezier.prototype._b1 = function(t) {
      return t * t * t;
    };

    Bezier.prototype._b2 = function(t) {
      return 3 * t * t * (1 - t);
    };

    Bezier.prototype._b3 = function(t) {
      return 3 * t * (1 - t) * (1 - t);
    };

    Bezier.prototype._b4 = function(t) {
      return (1 - t) * (1 - t) * (1 - t);
    };

    return Bezier;

  })();

  this.Animation = (function() {
    function Animation() {
      var duration, pt, style;
      duration = arguments[0], style = arguments[1], pt = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      this.duration = duration;
      this.animStep = __bind(this.animStep, this);
      this.run = __bind(this.run, this);
      this.framerate = 24;
      this.strength = 1.5;
      this.acceleration = "linear";
      this.curve = (function() {
        switch (style) {
          case "linear":
            return new Bezier(0.25, 0.25, 0.75, 0.75);
          case "overshoot":
            return new Bezier(1.4, 1.6, 1, 1);
          case "smooth":
            return new Bezier(1, 0, 1, 0);
          case "custom":
            return new Bezier(pt[0], pt[1], pt[2], pt[3]);
        }
      })();
    }

    Animation.prototype.run = function(forward, callback) {
      var fps, frame, progress, time;
      progress = forward ? 0 : 1;
      time = Date.now();
      fps = 1000 / this.framerate;
      frame = (function(_this) {
        return function() {
          var elapsed, now;
          now = Date.now();
          elapsed = now - time;
          if (elapsed > fps) {
            elapsed = fps;
          }
          return setTimeout(function() {
            var step;
            now = Date.now();
            elapsed = now - time;
            time = now;
            step = 0.001 * elapsed / _this.duration;
            progress = forward ? progress + step : progress - step;
            if (progress < 1 && progress > 0) {
              callback(false, _this.curve.plot(_this.animStep(progress)));
              return window.requestAnimationFrame(frame);
            } else {
              return callback(true, _this.curve.plot(forward ? 1 : 0));
            }
          }, fps - elapsed);
        };
      })(this);
      return window.requestAnimationFrame(frame);
    };

    Animation.prototype.animStep = function(progress) {
      var power;
      switch (this.acceleration) {
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
