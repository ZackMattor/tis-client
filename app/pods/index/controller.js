import Ember from 'ember';

export default Ember.Controller.extend({
  game_engine: Ember.inject.service(),

  username: null,

  actions: {
    join() {
      let username = this.get('username');

      this.get('game_engine').auth(username, () => {
        this.transitionToRoute('game');
      });
    }
  }
});
