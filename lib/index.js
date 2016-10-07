/**
 * sails-generate-new
 *
 * Usage:
 * `sails new foo`
 *
 * @type {Dictionary}
 */

module.exports = {

  moduleDir: require('path').resolve(__dirname, '..'),

  templatesDirectory: require('path').resolve(__dirname,'../templates'),

  // scopeExample: {
  //   // Required:
  //   args: ['my-new-app'],
  //   rootPath: '/Users/mikermcneil/code',
  //   sailsRoot: '/usr/local/lib/node_modules/sails',
  //
  //   // Automatic (but can be manually overridden:)
  //   appName: 'my-new-app',
  //   templatesDirectory: '/usr/local/lib/node_modules/sails/node_modules/sails-generate/node_modules/sails-generate-new/templates',
  // },

  before: require('./before'),

  after: require('./after'),

  targets: {

    '.': [
      'backend',
      'gruntfile',
      'frontend'
    ],

    './.gitignore':      { copy: 'gitignore.template' },
    './.editorconfig':   { copy: 'editorconfig.template' },
    './.jshintrc':       { copy: 'jshintrc.template' },

    './package.json':    { jsonfile: require('../json/package.json.js') },
    './app.js':          { copy: 'app.js.template' },

    './.sailsrc':        { jsonfile: require('../json/sailsrc') },
    './README.md':       { template: './README.md.template' },
  }

};


