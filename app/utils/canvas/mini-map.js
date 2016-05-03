import Ember from 'ember';
// TODO: More maths :)
//
// Need to be able to position the map.. this means that we
// should draw everything based on the "origin" of the minimap.

var Minimap = function(ctx, height, width, x, y, scale) {
  this.ctx = ctx;
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;

  this.setScale(scale);
};

Minimap.prototype = {
  x:      null,
  y:      null,
  ctx:    null,
  width:  null,
  height: null,
  scale:  null,
  minimapWidth:  null,
  minimapHeight: null,

  setScale(scale) {
    this.scale = scale;
    this.minimapWidth = this.scale * this.width;
    this.minimapHeight = this.scale * this.height;
  },

  render(state, client_id) {
    this.client_id = client_id;
    let ctx = this.ctx;

    ctx.beginPath();
    ctx.strokeStyle = "#FF0000";
    ctx.lineWidth = 1;
    ctx.fillStyle = "#444444";
    ctx.fillRect(this.x, this.y, this.minimapWidth, this.minimapHeight);
    ctx.strokeRect(this.x, this.y, this.minimapWidth, this.minimapHeight);

    state.ships.forEach(this._drawShip.bind(this));
  },

  _drawShip(ship) {
    let ctx = this.ctx;
    let x = this.x + (this.scale * ship.x);
    let y = this.y + (this.scale * ship.y);

    if(ship.x < 0 || ship.y < 0 || ship.x > this.width || ship.y > this.height) {
      return;
    }

    let is_you = this.client_id === ship.id;
    let color = is_you ? '#E7711B' : '#AAAAAA';

    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, 1, 1);
  },
};

export default Minimap;
