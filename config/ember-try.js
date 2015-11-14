module.exports = {
  scenarios: [
    {
      name: 'default',
      dependencies: { }
    },
    {
      name: 'ember-1-12',
      dependencies: {
        'ember': '~1.12.1'
      }
    },
    {
      name: 'ember-1-13',
      dependencies: {
        'ember': '~1.13.8'
      }
    },
    {
      name: 'ember-2-0',
      dependencies: {
        'ember': '~2.0.0'
      }
    },
    {
      name: 'ember-2-1',
      dependencies: {
        'ember': '~2.1.0'
      }
    },
    {
      name: 'ember-release',
      dependencies: {
        'ember': 'release'
      },
      resolutions: {
        'ember': 'release'
      }
    },
    {
      name: 'ember-beta',
      dependencies: {
        'ember': 'beta'
      },
      resolutions: {
        'ember': 'beta'
      }
    },
    {
      name: 'ember-canary',
      dependencies: {
        'ember': 'canary'
      },
      resolutions: {
        'ember': 'canary'
      }
    }
  ]
};
