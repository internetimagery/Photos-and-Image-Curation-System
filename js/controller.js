(function() {
  var ActiveState, State, StateList,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice;

  StateList = {};

  ActiveState = null;

  State = (function() {
    function State(name) {
      this.name = name;
      this.entered = __bind(this.entered, this);
      if (StateList.hasOwnProperty(this.name)) {
        console.log("State: " + this.name + ", already exists.");
      } else {
        StateList[this.name] = this;
        if (!ActiveState) {
          this.moveTo(this.name);
        }
      }
    }

    State.prototype.moveTo = function() {
      var args, name;
      name = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (StateList.hasOwnProperty(name)) {
        ActiveState = StateList[name];
        return ActiveState.entered(name);
      } else {
        return console.log("State: " + name + ", could not be found.");
      }
    };

    State.prototype.entered = function(past) {
      return console.log("Entered " + this.name + ", from " + past + ".");
    };

    State.prototype.event = function(name) {
      return console.log("An unhandled event was fired: " + name + ".");
    };

    return State;

  })();

  new State("something");

  console.dir(StateList);

}).call(this);
