import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { translate } from 'ember-i18n/test-support';

module('Acceptance | {{translate}} Helper', function(hooks) {
  setupApplicationTest(hooks);

  test("translate test helper", function(assert) {
    assert.equal(translate("pluralized.translation", { count: 1 }), "One Click", "test-helpers t returns translation");
  });
});


