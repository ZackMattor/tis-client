import Ember from 'ember';
import degToRad from '../utils/deg-to-rad';

export default Ember.Component.extend({
  game_state: Ember.inject.service(),

  tagName: 'canvas',

  didInsertElement() {
    this.$().attr('width', Ember.$(window).width());
    this.$().attr('height', Ember.$(window).height());

    var c = this.$()[0];
    var ctx=c.getContext("2d");

    this.set('ctx', ctx);

    this.get('game_state').on('state_updated', this.renderField.bind(this))
  },

  renderField() {
    let state = this.get('game_state.currentState');
    this.get('ctx').clearRect(0, 0, 1000, 1000);

    state.ships.forEach(this.drawShip.bind(this));
    state.projectiles.forEach(this.drawProjectile.bind(this));
  },

  drawShip(ship) {
    let ctx = this.get('ctx');
    this.drawTriangle(ship.x, ship.y, 25, ship.rotation, '#cccccc');
  },

  drawProjectile(projectile) {
    let ctx = this.get('ctx');
    ctx.beginPath();
    console.log(projectile.x);
    ctx.arc(projectile.x, projectile.y, 3,0,2*Math.PI);
    ctx.stroke();
  },

  drawTriangle(x, y, length, rotation, fillStyle) {
    let ctx = this.get('ctx');

    ctx.save();

    ctx.translate(x, y);
    ctx.rotate(rotation);
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
