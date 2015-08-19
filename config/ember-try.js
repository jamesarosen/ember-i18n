module.exports = {
  scenarios: [
    {
      name: 'default',
      dependencies: { }
    },
    {
      name: 'ember-1-12',
      dependencies: {
        'ember': 'components/ember#1.12.1'
      },
      resolutions: {
        'ember': 'release'
      }
    },
    {
      name: 'ember-1-13',
      dependencies: {
        'ember': 'components/ember#1.13.8'
      },
      resolutions: {
        'ember': 'release'
      }
    },
    {
      name: 'ember-release',
      dependencies: {
        'ember': 'components/ember#release'
      },
      resolutions: {
        'ember': 'release'
      }
    },
    {
      name: 'ember-beta',
      dependencies: {
        'ember': 'components/ember#beta'
      },
      resolutions: {
        'ember': 'beta'
      }
    },
    {
      name: 'ember-canary',
      dependencies: {
        'ember': 'components/ember#canary'
      },
      resolutions: {
        'ember': 'canary'
      }
    }
  ]
};
