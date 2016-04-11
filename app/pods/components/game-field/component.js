import Ember from 'ember';
import Camera from 'client/utils/canvas/camera';
import starFieldGenerator from 'client/utils/canvas/star-field';

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

    game_engine.on('state_changed', this.renderField.bind(this));
    game_engine.on('disconnected', () => {
      this.sendAction('disconnected')
      game_engine.off('disconnected');
      game_engine.off('state_changed');
    });

    starFieldGenerator().then((image) => {
      this.set('star_field', image);

      game_engine.joinGame();
    });
  },

  willDestroyElement() {
    Ember.$(window).off('resize');
    this.get('game_engine').leaveGame();
  },

  setupCanvas() {
    let { canvas_width,
          canvas_height } = this.getProperties('canvas_width', 'canvas_height');

    this.$().attr('width', canvas_width);
    this.$().attr('height', canvas_height);

    // TODO: unbind this
    Ember.$(window).on('resize', this.handleResize.bind(this));
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
          camera  } = this.getProperties('ctx', 'camera');

    let game_objects = frame_data.state;

    this.centerCamera(game_objects.ships);

    camera.zoomTo(2000);
    camera.begin();
    ctx.clearRect(camera.viewport.left, camera.viewport.top, camera.viewport.width, camera.viewport.height);

    this.drawBackground();
    this.drawBoundries();
    game_objects.ships.forEach(this.drawShip.bind(this));
    game_objects.projectiles.forEach(this.drawProjectile.bind(this));
    camera.end();
  },

  handleResize() {
    this.set('canvas_width',  Ember.$(window).width());
    this.set('canvas_height', Ember.$(window).height());
    this.setupCanvas();
  },

  centerCamera(ships) {
    let you = ships.find((ship)=> {
      return this.get('client_id') === ship.id;
    });

    this.get('camera').moveTo(you.x, you.y);
  },

  drawBackground() {
    let { star_field,
          ctx,
          camera } = this.getProperties('star_field', 'ctx', 'camera');

    let width  = star_field.width;
    let height = star_field.height;
    let [x, y] = camera.lookat;

    var origin = {
      x: Math.floor(x / width),
      y: Math.floor(y / height)
    };

    let drawInGrid = function(x, y) {
      ctx.drawImage(star_field, x * width, y * height);
    };

    for(var i = -1; i<2; i++) {
      for(var j = -1; j<2; j++) {
        drawInGrid(origin.x + i, origin.y + j);
      }
    }
  },

  drawBoundries() {
    let ctx = this.get('ctx');

    ctx.strokeStyle = "#FF0000";
    ctx.lineWidth = 10;
    ctx.strokeRect(-1000, -1000, 2000, 2000);
    ctx.stroke();
  },

  drawShip(ship) {
    let is_you = this.get('client_id') === ship.id;
    let color = is_you ? '#E7711B' : '#cccccc';

    this.drawTriangle(ship.x, ship.y, 25, ship.rotation, color);
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
  }

});
