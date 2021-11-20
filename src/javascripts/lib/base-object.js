export default {
  events: {},

  on (eventName, callback) {
    if (!this._populated(eventName)) this.events[eventName] = []

    this.events[eventName].push(callback)
  },

  off (eventName, callback) {
    if (!this._populated(eventName)) return

    if (callback) {
      const index = this.events[eventName].indexOf(callback)

      this.events[eventName].splice(index, 1)
    } else {
      this.events[eventName] = []
    }
  },

  trigger (eventName, data) {
    if (!this._populated(eventName)) return

    this.events[eventName].forEach((callback) => {
      callback(data)
    })
  },

  _populated (eventName) {
    return Array.isArray(this.events[eventName])
  }
}
