var path = require('path');
var _ = require('lodash');
var packageJSON = require('../json/package.json.js');
var sailsrc = require('../json/sailsrc');




/**
 * sails-generate-new
 *
 * Usage:
 * `sails new foo`
 *
 * @type {Object}
 */

module.exports = {

	moduleDir: require('path').resolve(__dirname, '..'),

	templatesDirectory: require('path').resolve(__dirname,'../templates'),

	before: require('./before'),

	after: require('./after'),

	targets: {

		'.': {
			pre: function(scope, cb) {

				var modules = 'backend';

				if (scope.frontend === undefined)
					modules.concat(['gruntfile', 'frontend']);

				return cb(null, ['backend','gruntfile', 'frontend']);
				
			}
		},
		'./.gitignore': { copy: 'gitignore' },
		'./.editorconfig': { copy: 'editorconfig.template' },
		'./README.md': { template: './README.md' },
		'./package.json': { jsonfile: packageJSON },
		'./.sailsrc': { jsonfile: sailsrc },
		'./app.js': { copy: 'app.js' }
	}
};


