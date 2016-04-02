import Ember from 'ember';

export default Ember.Component.extend({
  game_engine: Ember.inject.service(),
  canvas_width: Ember.$(window).width(),
  canvas_height: Ember.$(window).height(),

  tagName: 'canvas',

  didInsertElement() {
    this.setupCanvas();
    this.setupCtx();

    // Wire up events
    let game_engine = this.get('game_engine');
    game_engine.joinGame();
    game_engine.on('state_changed', this.renderField.bind(this));
    game_engine.on('disconnected', () => this.sendAction('disconnected'));

    Ember.$(window).on('resize', this.handleResize.bind(this));
  },

  setupCanvas() {
    let { canvas_width,
          canvas_height } = this.getProperties('canvas_width', 'canvas_height');

    this.$().attr('width', canvas_width);
    this.$().attr('height', canvas_height);
  },

  setupCtx() {
    let c = this.$()[0];
    let ctx = c.getContext("2d");

    this.set('ctx', ctx);
  },

  // DRAW STUFF
  renderField() {
    let state = this.get('game_engine.currentState');

    let { ctx,
          canvas_width,
          canvas_height } = this.getProperties('ctx', 'canvas_width', 'canvas_height');

    ctx.clearRect(0, 0, canvas_width, canvas_height);

    state.ships.forEach(this.drawShip.bind(this));
    state.projectiles.forEach(this.drawProjectile.bind(this));
  },

  handleResize() {
    this.set('canvas_width',  Ember.$(window).width());
    this.set('canvas_height', Ember.$(window).height());
    this.setupCanvas();
  },

  drawShip(ship) {
    this.drawTriangle(ship.x, ship.y, 25, ship.rotation, '#cccccc');
  },

  drawProjectile(projectile) {
    let ctx = this.get('ctx');
    ctx.beginPath();
    ctx.arc(projectile.x, projectile.y, 3,0,2*Math.PI);
    ctx.stroke();
  },

  drawTriangle(x, y, length, rotation, fillStyle) {
    let ctx = this.get('ctx');

    ctx.save();

    ctx.translate(x, y);
    ctx.rotate(rotation + -Math.PI/2);
    ctx.beginPath();
    ctx.moveTo(length * 2 * -1, 0);
    ctx.lineTo(length, length);
    ctx.lineTo(length, length * -1);
    ctx.fillStyle = fillStyle;
    ctx.fill();

    ctx.closePath();
    ctx.restore();
    ctx.beginPath();
    ctx.arc(x, y, 3,0,2*Math.PI);
    ctx.stroke();
  }

});
