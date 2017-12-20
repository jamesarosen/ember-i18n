export default function (owner, key, interpolations) {
  const i18n = owner.lookup('service:i18n');
  return i18n.t(key, interpolations);
}
