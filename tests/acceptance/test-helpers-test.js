import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | {{t}} Helper', {
  beforeEach() {
    visit('/');
  }
});

test("t test helper", function(assert) {
  assert.equal(t("pluralized.translation", { count: 1 }), "One Click", "test-helpers t returns translation");
});

test("expectTranslation test helper", function() {
  expectTranslation('.no-interpolations', 'no.interpolations');
});
