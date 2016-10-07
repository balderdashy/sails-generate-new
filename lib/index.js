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


