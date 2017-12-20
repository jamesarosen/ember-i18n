import { getContext } from '@ember/test-helpers';
import _t from './-private/t';

export function t(key, interpolations) {
  let { owner } = getContext();
  return _t(owner, key, interpolations)
}
