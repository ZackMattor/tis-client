export default {
  events: {},

  on(event_name, callback) {
    if(!this._populated(event_name)) this.events[event_name] = [];

    this.events[event_name].push(callback);
  },

  off(event_name, callback) {
    if(!this._populated(event_name)) return;

    if(callback) {
      var index = this.events[event_name].indexOf(callback);

      this.events[event_name].splice(index, 1);
    } else {
      this.events[event_name] = [];
    }
  },

  trigger(event_name, data) {
    if(!this._populated(event_name)) return;

    this.events[event_name].forEach((callback) => {
      callback(data);
    });
  },

  _populated(event_name) {
    return Array.isArray(this.events[event_name]);
  }
};
