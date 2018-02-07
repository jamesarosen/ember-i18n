import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { t, expectTranslation } from 'ember-i18n/test-support';
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

  test("expectTranslation test helper", async function (assert) {
    assert.expect(1);
    await render(hbs`
      <span data-test-target>{{t "pluralized.translation" count=1}}</span>
    `);

    expectTranslation('[data-test-target]', "pluralized.translation", { count: 1 });
  });
});


