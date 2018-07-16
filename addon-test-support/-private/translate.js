export default function (owner, key, interpolations) {
  const i18n = owner.lookup('service:i18n');
  return i18n.translate(key, interpolations);
}
