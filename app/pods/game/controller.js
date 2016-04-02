import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    disconnected() {
      this.transitionToRoute('index');
    }
  }
});
