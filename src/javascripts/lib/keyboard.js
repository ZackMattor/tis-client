// TODO - move this stuff
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

import BaseObject from './base-object';

export default Object.assign({}, BaseObject, {
  key_state: {},
  inverted: true,

  init() {
    for(var key_name in KEY) {
      this.key_state[KEY[key_name]] = false;
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
    var key_state = this.key_state;

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
    if(key_code in key_state && key_state[key_code] !== value) {
      this.key_state[key_code] = value;

      this.trigger('changed', this.key_state);
    }
  }
});
