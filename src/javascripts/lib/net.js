export default {
  current_state: null,

  session_id: null,

  auth(name, cb) {
    let data = {
      nickname: name
    };

    let url = 'http://localhost:8080' + '/session/new';

    $.get(url, data, (data) => {
      this.session_id = data.session_id;
      cb();
    });
  },

  joinGame() {
    let connection = new WebSocket('ws://localhost:8080');
    this.connection = connection;

    connection.onopen = () => {
      // Wire up connection events
      connection.onmessage = this.onMessage.bind(this);
      connection.onerror = this.leaveGame.bind(this);

      let data = {
        'type': 'auth',
        'session_id': this.session_id
      };

      this.connection.send(JSON.stringify(data));
    };

  },

  leaveGame() {
    this.get('connection').close();
    this.cb_disconnected();
  },

  sendKeyboardState(keyboard_state) {
    console.log(keyboard_state);
    var data = {
      type: 'player-update',
      session_id: this.session_id,
      data: keyboard_state
    };

    this.connection.send(JSON.stringify(data));
  },

  onMessage(e) {
    this.current_state = JSON.parse(e.data);

    this.cb_state_changed();
  }
};
