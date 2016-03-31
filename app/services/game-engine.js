import Ember from 'ember';

export default Ember.Service.extend(Ember.Evented, {
  input_keyboard: Ember.inject.service(),

  currentState: null,

  init() {
    this.set('connection', new WebSocket('ws://localhost:8080'));

    this.get('connection').onmessage = this.onMessage.bind(this);
    this.get('connection').onerror = function() {
      console.log('ERROR!');
    };
    this.get('input_keyboard').on('changed', this.sendKeyboardState.bind(this));
  },

  sendKeyboardState() {
    console.log('SENDING');
    this.get('connection').send(JSON.stringify(this.get('input_keyboard.keyState')));
  },

  onMessage(e) {
    this.set('currentState', JSON.parse(e.data));

    this.trigger('state_changed');
  }
});
