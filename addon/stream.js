import Ember from 'ember';

// As of v1.12, Streams are still private API. Thus, we need to reach in to
// Ember internals to get access to it.
// After v2.1, the streams/stream module moved what was `Stream` to a named export and exported
// a base class as `default`.
//
// See https://github.com/emberjs/ember.js/blob/v1.12.0/packages/ember-metal/lib/main.js#L384-L386
// See https://github.com/emberjs/ember.js/pull/9693
// See https://github.com/dockyard/ember-cli-i18n/blob/v0.0.6/addon/utils/stream.js
// See https://github.com/emberjs/ember.js/blob/23258c1eadce4f52c814f0441c13880ddf896f31/packages/ember-metal/lib/streams/stream.js
const streamModule = Ember.__loader.require('ember-metal/streams/stream');
export default (streamModule.Stream || streamModule['default']);
export var readHash = Ember.__loader.require('ember-metal/streams/utils').readHash;
