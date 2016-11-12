var KEY = {
  W: 87,
  A: 65,
  S: 83,
  D: 68,
  R: 82,

  LEFT_ARROW: 37,
  UP_ARROW: 38,
  RIGHT_ARROW: 39,
  DOWN_ARROW: 40,

  SPACE: 32
};

export default {
  keyState: {},
  inverted: true,

  init() {
    console.log('input-keyboard: Binding to don key events');

    for(var key_name in KEY) {
      this.keyState[KEY[key_name]] = false;
    }

    $(document).on('keydown', this.onKeyDown.bind(this));
    $(document).on('keyup', this.onKeyUp.bind(this));
  },

  onKeyDown(evt) {
    this.setKey(evt.keyCode, true);
  },

  onKeyUp(evt) {
    this.setKey(evt.keyCode, false);
  },

  setKey(key_code, value) {
    var keyState = this.keyState;

    if(this.inverted) {
      switch(key_code) {
        case KEY['D']:
          key_code = KEY['A'];
          break;
        case KEY['A']:
          key_code = KEY['D'];
          break;
        case KEY['LEFT_ARROW']:
          key_code = KEY['RIGHT_ARROW'];
          break;
        case KEY['RIGHT_ARROW']:
          key_code = KEY['LEFT_ARROW'];
          break;
      }
    }

    // If the key state exists, and it has changed
    if(key_code in keyState && keyState[key_code] !== value) {
      this.keyState[key_code] = value;

      this.cb_changed(this.keyState);
    }
  }
};
