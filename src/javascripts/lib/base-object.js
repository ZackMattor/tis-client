export default {
  events: {},

  on(event_name, callback) {
    if(!this._populated(event_name)) this.events[event_name] = [];

    this.events[event_name].push(callback);
  },

  off(event_name, callback) {
    if(!this._populated(event_name)) return;
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
