// TODO - move this stuff
import BaseObject from './base-object'

const KEY = {
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
}

export default Object.assign({}, BaseObject, {
  keyState: {},
  inverted: true,

  init () {
    for (const keyName in KEY) {
      this.keyState[KEY[keyName]] = false
    }

    document.addEventListener('keydown', this.onKeyDown.bind(this))
    document.addEventListener('keyup', this.onKeyUp.bind(this))
  },

  onKeyDown (evt) {
    this.setKey(evt.keyCode, true)
  },

  onKeyUp (evt) {
    this.setKey(evt.keyCode, false)
  },

  setKey (keyCode, value) {
    const keyState = this.keyState

    if (this.inverted) {
      switch (keyCode) {
        case KEY.D:
          keyCode = KEY.A
          break
        case KEY.A:
          keyCode = KEY.D
          break
        case KEY.LEFT_ARROW:
          keyCode = KEY.RIGHT_ARROW
          break
        case KEY.RIGHT_ARROW:
          keyCode = KEY.LEFT_ARROW
          break
      }
    }

    // If the key state exists, and it has changed
    if (keyCode in keyState && keyState[keyCode] !== value) {
      this.keyState[keyCode] = value

      this.trigger('changed', this.keyState)
    }
  }
})
