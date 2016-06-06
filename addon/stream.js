import Ember from 'ember';

// As of v1.12, Streams are still private API. Thus, we need to reach in to
// Ember internals to get access to it.
//
// See https://github.com/emberjs/ember.js/blob/v1.12.0/packages/ember-metal/lib/main.js#L384-L386
// See https://github.com/emberjs/ember.js/pull/9693
// See https://github.com/dockyard/ember-cli-i18n/blob/v0.0.6/addon/utils/stream.js
//
// As of v2.7, Streams are moved to `ember-htmlbars`, we need to check if `ember-metal/streams/stream` exists

const _registry = Ember.__loader.registry;
const _require = Ember.__loader.require;

export default _registry['ember-metal/streams/stream'] ? _require('ember-metal/streams/stream')['default'] : _require('ember-htmlbars/streams/stream')['default'];
export const readHash = _registry['ember-metal/streams/utils'] ? _require('ember-metal/streams/utils').readHash :  _require('ember-htmlbars/streams/utils').readHash;
