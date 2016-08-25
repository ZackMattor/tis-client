import Ember from 'ember';
import ENV from 'client/config/environment';

export default Ember.Service.extend(Ember.Evented, {
  input_keyboard: Ember.inject.service(),

  currentState: null,

  session_id: null,

  auth(name, cb) {
    let data = {
      nickname: name
    };

    let url = ENV.APP.gameServerApiURL + '/session/new';

    $.get(url, data, (data) => {
      this.session_id = data.session_id;
      cb();
    });
  },

  joinGame() {
    let connection = new WebSocket(ENV.APP.gameServerSocketURL);
    this.set('connection', connection);

    connection.onopen = () => {
      // Wire up connection events
      connection.onmessage = this.onMessage.bind(this);
      connection.onerror = this.leaveGame.bind(this);

      let data = {
        'type': 'auth',
        'session_id': this.get('session_id')
      }

      this.get('connection').send(JSON.stringify(data));

      // Wire up keyborad events
      this.get('input_keyboard').on('changed', this.sendKeyboardState.bind(this));
    };

  },

  leaveGame() {
    this.get('connection').close();
    this.trigger('disconnected');
  },

  sendKeyboardState() {
    var keyboard_data = this.get('input_keyboard.keyState')

    var data = {
      type: 'player-update',
      session_id: this.get('session_id'),
      data: keyboard_data
    };

    this.get('connection').send(JSON.stringify(data));
  },

  onMessage(e) {
    this.set('currentState', JSON.parse(e.data));

    this.trigger('state_changed');
  }
});
