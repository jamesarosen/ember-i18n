import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { t } from 'ember-i18n/test-support/helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | {{t}} Helper', function (hooks) {
  setupRenderingTest(hooks);

  test("t test helper", async function (assert) {
    assert.expect(2);
    await render(hbs`
      <span id="t-target">{{t "pluralized.translation" count=1}}</span>
    `);

    assert.equal(t("pluralized.translation", { count: 1 }), "One Click", "test-helpers t returns translation");
    assert.equal(this.element.querySelector('#t-target').textContent, t("pluralized.translation", { count: 1 }));
  });
});


