import { getContext } from '@ember/test-helpers';
import _translate from './-private/translate';
import _assertTranslation from './-private/assert-translation';

export function translate(key, interpolations) {
  let { owner } = getContext();
  return _translate(owner, key, interpolations);
}

export function expectTranslation(element, key, interpolations) {
  let { owner } = getContext();
  let text = _translate(owner, key, interpolations);
  _assertTranslation(element, key, text);
}
