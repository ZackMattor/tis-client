import Ember from 'ember';

export default Ember.Service.extend(Ember.Evented, {
  input_keyboard: Ember.inject.service(),

  currentState: null,

  joinGame() {
    let connection = new WebSocket('wss://zack-game-server.ngrok.io/');
    this.set('connection', connection);

    // Wire up connection events
    connection.onmessage = this.onMessage.bind(this);
    connection.onerror = this.leaveGame.bind(this);

    // Wire up keyborad events
    this.get('input_keyboard').on('changed', this.sendKeyboardState.bind(this));
  },

  leaveGame() {
    this.get('connection').close();
    this.trigger('disconnected');
  },

  sendKeyboardState() {
    this.get('connection').send(JSON.stringify(this.get('input_keyboard.keyState')));
  },

  onMessage(e) {
    this.set('currentState', JSON.parse(e.data));

    this.trigger('state_changed');
  }
});
