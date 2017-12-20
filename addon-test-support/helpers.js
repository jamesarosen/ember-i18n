import { getContext } from '@ember/test-helpers';

export function _t(owner, key, interpolations) {
  const i18n = owner.lookup('service:i18n');
  return i18n.t(key, interpolations);
}

export function t(key, interpolations) {
  let { owner } = getContext();
  return _t(owner, key, interpolations)
}
