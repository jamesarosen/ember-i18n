export default {
  'defined.in.default': {
    value: 'Default {{count}} value'
  },
  'no.interpolations': 'text with no interpolations',
  'no.interpolations.either': 'another text without interpolations',

  'with': {
    interpolations: 'Clicks: {{clicks}}',
    number: 3
  },

  'pluralized.translation': {
    one: 'One Click',
    other: '{{count}} Clicks'
  },

  'custom pluralized.tranclation - one': 'One Custom Click',
  'custom pluralized.tranclation - other': 'Many Custom Clicks',
};
