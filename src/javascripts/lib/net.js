import BaseObject from './base-object';

export default Object.assign({}, BaseObject, {
  current_state: null,

  session_id: null,

  auth(name, cb) {
    let data = {
      nickname: name
    };

    let url = `${window.location.protocol}//${window.location.hostname}:8080/session/new`;

    $.get(url, data, (data) => {
      this.session_id = data.session_id;
      cb();
    });
  },

  joinGame() {
    const url = window.location.protocol == 'https' ? `wss://${window.location.hostname}/ws` : `ws://${window.location.hostname}:8080`;
    let connection = new WebSocket(url);
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
    this.trigger('disconnect');
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

    this.trigger('state_change');
  }
});
