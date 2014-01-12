var path = require('path');
var _ = require('lodash');


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
		'./package.json': { jsonfile: { data: dataForPackageJSON() } },
		'./app.js': { copy: path.resolve(__dirname, './templates/app.js') }
	}
};



/**
 * 
 * @param  {[type]} scope [description]
 * @return {[type]}       [description]
 */
function dataForPackageJson (scope) {

	var sails = scope.sails;

	// Override sails version temporarily
	var sailsVersionDependency = '~' + sails.version;
	sailsVersionDependency = 'git://github.com/balderdashy/sails.git#v0.10';

	return {
		name: options.appName,
		'private': true,
		version: '0.0.0',
		description: 'a Sails application',
		dependencies: {
			'sails'			: sailsVersionDependency,
			'sails-disk'	: sails.dependencies['sails-disk'],
			'ejs'			: sails.dependencies['ejs'],
			'grunt'			: sails.dependencies['grunt']
		},
		scripts: {
			// TODO: Include this later when we have "sails test" ready.
			// test: './node_modules/mocha/bin/mocha -b',
			start: 'node app.js',
			debug: 'node debug app.js'
		},
		main: 'app.js',
		repository: '',
		author: scope.author,
		license: ''
	};
}
