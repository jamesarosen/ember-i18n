import Ember from "ember";
import $ from "jquery";

export default Ember.Controller.extend({

  clickCount: 0,

  actions: {
    increment: function() {
      this.incrementProperty('clickCount');
    }
  }

});
