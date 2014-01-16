var path = require('path');
var _ = require('lodash');
var packageJSON = require('../json/package.json.js');
var sailsrc = require('../json/sailsrc');



/**
 * sails-generate-new
 * 
 * Usage:
 * `sails-generate-new`
 * 
 * @type {Object}
 */
module.exports = {

	moduleDir: require('path').resolve(__dirname, '..'),

	templatesDirectory: require('path').resolve(__dirname,'../templates'),

	before: require('./before'),

	targets: {

		'.': ['backend','frontend'],
		'./.gitignore': { copy: require('path').resolve(__dirname,'../templates/gitignore'), },
		'./README.md': { template: './README.md' },
		'./package.json': { jsonfile: packageJSON },
		'./.sailsrc': { jsonfile: sailsrc },
		'./app.js': { copy: require('path').resolve(__dirname,'../templates/app.js'), }
	}
};


