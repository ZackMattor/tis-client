import Ember from 'ember';
import KEY from '../utils/key-mapping';

export default Ember.Service.extend(Ember.Evented, {
  keyState: {},
  inverted: true,

  init() {
    console.log('input-keyboard: Binding to don key events');

    for(var key_name in KEY) {
      this.set('keyState.' + KEY[key_name], false);
    }

    Ember.$(document).on('keydown', this.onKeyDown.bind(this));
    Ember.$(document).on('keyup', this.onKeyUp.bind(this));
  },

  onKeyDown(evt) {
    this.setKey(evt.keyCode, true);
  },

  onKeyUp(evt) {
    this.setKey(evt.keyCode, false);
  },

  setKey(key_code, value) {
    var keyState = this.get('keyState');

    if(this.get('inverted')) {
      switch(key_code) {
        case KEY['D']:
          key_code = KEY['A'];
          break;
        case KEY['A']:
          key_code = KEY['D'];
          break;
      }
    }

    // If the key state exists, and it has changed
    if(key_code in keyState && keyState[key_code] !== value) {
      this.set('keyState.' + key_code, value);

      this.trigger('changed');
    }
  }
});
