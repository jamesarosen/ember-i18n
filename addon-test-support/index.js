import { getContext } from '@ember/test-helpers';
import _t from './-private/t';
import _assertTranslation from './-private/assert-translation';

export function t(key, interpolations) {
  let { owner } = getContext();
  return _t(owner, key, interpolations);
}

export function expectTranslation(element, key, interpolations) {
  let { owner } = getContext();
  let text = _t(owner, key, interpolations);
  _assertTranslation(element, key, text);
}
