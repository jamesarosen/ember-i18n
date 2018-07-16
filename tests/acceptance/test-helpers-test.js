import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | {{translate}} Helper', {
  beforeEach() {
    visit('/');
  }
});

test("translate test helper", function(assert) {
  assert.equal(translate("pluralized.translation", { count: 1 }), "One Click",
  "test-helpers translate returns translation");
});

test("expectTranslation test helper", function() {
  expectTranslation('.no-interpolations', 'no.interpolations');
});
