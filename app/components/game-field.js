import Ember from 'ember';
import Camera from '../utils/camera';

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

    this.set('camera', new Camera(ctx));
    window.camera = this.get('camera');

    this.set('ctx', ctx);
  },

  // DRAW STUFF
  renderField() {
    let frame_data = this.get('game_engine.currentState');

    this.set('client_id', frame_data.id);

    let { ctx,
          canvas_width,
          canvas_height,
          camera  } = this.getProperties('ctx', 'canvas_width', 'canvas_height', 'camera');

    camera.begin();
    ctx.clearRect(camera.viewport.left, camera.viewport.top, camera.viewport.width, camera.viewport.height);

    let game_objects = frame_data.state;

    game_objects.ships.forEach(this.drawShip.bind(this));
    game_objects.projectiles.forEach(this.drawProjectile.bind(this));
    camera.end();
  },

  handleResize() {
    this.set('canvas_width',  Ember.$(window).width());
    this.set('canvas_height', Ember.$(window).height());
    this.setupCanvas();
  },

  drawShip(ship) {
    this.drawTriangle(ship.x, ship.y, 25, ship.rotation, '#cccccc');

    let should_follow = this.get('client_id') === ship.id;

    if(should_follow) {
      this.get('camera').moveTo(ship.x, ship.y);
    }
  },

  drawProjectile(projectile) {
    let ctx = this.get('ctx');
    ctx.beginPath();
    ctx.arc(projectile.x, projectile.y, 3 ,0 , 2*Math.PI);
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
