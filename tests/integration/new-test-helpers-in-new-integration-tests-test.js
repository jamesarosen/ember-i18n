import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { translate, expectTranslation } from 'ember-i18n/test-support';
import hbs from 'htmlbars-inline-precompile';

module('Integration | {{translate}} Helper', function (hooks) {
  setupRenderingTest(hooks);

  test("translate test helper", async function (assert) {
    assert.expect(2);
    await render(hbs`
      <span id="t-target">{{translate "pluralized.translation" count=1}}</span>
    `);

    assert.equal(translate("pluralized.translation", { count: 1 }), "One Click",
      "test-helpers translate returns translation");
    assert.equal(this.element.querySelector('#t-target').textContent,
      translate("pluralized.translation", { count: 1 }));
  });

  test("expectTranslation test helper", async function (assert) {
    assert.expect(1);
    await render(hbs`
      <span data-test-target>{{translate "pluralized.translation" count=1}}</span>
    `);

    expectTranslation('[data-test-target]', "pluralized.translation", { count: 1 });
  });
});


