(function() {
  var ActiveState, State, StateList,
    __slice = [].slice;

  StateList = {};

  ActiveState = null;

  State = (function() {
    function State(name) {
      this.name = name;
      if (StateList.indexOf(this.name < 0)) {
        StateList[this.name] = this;
      } else {
        console.log("State: " + this.name + ", already exists.");
      }
    }

    State.prototype.moveTo = function() {
      var args, name;
      name = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (StateList.indexOf(name >= 0)) {
        return ActiveState = StateList[name];
      } else {
        return console.log("State: " + name + ", could not be found.");
      }
    };

    State.prototype.event = function(name) {
      return console.log("An unhandled event was fired: " + name + ".");
    };

    return State;

  })();

}).call(this);
