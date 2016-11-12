export default {
  events: {},

  on(event_name, callback) {
    if(!Array.isArray(this.events[event_name])) this.events[event_name] = [];

    this.events[event_name].push(callback);
  },

  off() {

  },

  trigger(event_name, data) {
    if(Array.isArray(this.events[event_name])) {
      this.events[event_name].forEach((cb) => {
        cb(data);
      });
    }
  }
};
