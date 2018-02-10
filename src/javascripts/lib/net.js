import BaseObject from './base-object';

export default Object.assign({}, BaseObject, {
  current_state: null,

  session_id: null,

  auth(name, cb) {
    let data = {
      nickname: name
    };

    let url = `${process.env.TIS_HTTP_ENDPOINT}/session/new`;

    $.get(url, data, (data) => {
      this.session_id = data.session_id;
      cb();
    });
  },

  joinGame() {
    let connection = new WebSocket(process.env.TIS_WS_ENDPOINT);
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
