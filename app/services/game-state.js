import Ember from 'ember';

export default Ember.Service.extend(Ember.Evented, {
  init() {
    this.set('connection', new WebSocket('ws://localhost:8080'));

    this.get('connection').onmessage = this.onMessage.bind(this);
  },

  onMessage(e) {
    console.log(e.data);

    this.set('currentState', JSON.parse(e.data));

    this.trigger('state_updated');
  },

  currentState: {
    ships: [
      {
        name: 'Nick',
        rotation: 0,
        x: 107,
        y: 54
      }, {
        name: 'George',
        rotation: Math.PI,
        x: 700,
        y: 700
      }
    ],

    projectiles: [
      {
        x: 143,
        y: 254,
        type: 'default'
      }
    ]
  }
});
