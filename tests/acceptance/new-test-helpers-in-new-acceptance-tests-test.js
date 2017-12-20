import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { t } from 'ember-i18n/test-support';

module('Acceptance | {{t}} Helper', function(hooks) {
  setupApplicationTest(hooks);

  test("t test helper", function(assert) {
    assert.equal(t("pluralized.translation", { count: 1 }), "One Click", "test-helpers t returns translation");
  });
});


