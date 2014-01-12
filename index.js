var path = require('path');
var _ = require('lodash');
var packageJSON = require('./json/package.json.js');
var sailsrc = require('./json/sailsrc');



/**
 * sails-generate-new
 * 
 * Usage:
 * `sails-generate-new`
 * 
 * @type {Object}
 */
module.exports = {

	bootstrap: function (scope, sb) {
		_.defaults(scope, {
			author: 'a Node.js/Sails.js Contributor',
			year: (new Date()).getFullYear(),
			appName: 'Untitled'
		});

		sb();
	},

	targets: {

		'.': ['backend','frontend'],
		'./.gitignore': { copy: path.resolve(__dirname, './templates/gitignore') },
		'./README.md': { ejs: path.resolve(__dirname, './templates/README.md') },
		'./package.json': { jsonfile: packageJSON },
		'./.sailsrc': { jsonfile: sailsrc },
		'./app.js': { copy: path.resolve(__dirname, './templates/app.js') }
	}
};


