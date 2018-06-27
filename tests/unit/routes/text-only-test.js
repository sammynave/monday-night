import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | text-only', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:text-only');
    assert.ok(route);
  });
});
