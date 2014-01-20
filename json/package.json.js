/**
 * Module dependencies
 */

var _ = require('lodash')
	, util = require('util');



/**
 * 
 * @param  {[type]} scope [description]
 * @return {[type]}       [description]
 */
module.exports = function dataForPackageJSON (scope) {

	var package = scope.sailsPackageJSON || {};

	var sailsVersionDependency = '~' + package.version;

	// Override sails version temporarily
	sailsVersionDependency = 'git://github.com/balderdashy/sails.git#v0.10';


	return _.defaults(scope.appPackageJSON || {}, {
		name: scope.appName,
		private: true,
		version: '0.0.0',
		description: 'a Sails application',
		keywords: [],
		dependencies: {
			'sails'     : sailsVersionDependency,
			'sails-disk': getDependencyVersion(package, 'sails-disk'),
			'ejs'       : getDependencyVersion(package, 'ejs'),
			'grunt'     : getDependencyVersion(package, 'grunt'),
			'grunt-contrib-sync': getDependencyVersion(package, 'grunt-contrib-sync'),
			'grunt-contrib-copy': getDependencyVersion(package, 'grunt-contrib-copy'),
	    'grunt-contrib-clean': getDependencyVersion(package, 'grunt-contrib-clean'),
	    'grunt-contrib-concat': getDependencyVersion(package, 'grunt-contrib-concat'),
	    'grunt-sails-linker': getDependencyVersion(package, 'grunt-contrib-linker'),
	    'grunt-contrib-jst': getDependencyVersion(package, 'grunt-contrib-jst'),
	    'grunt-contrib-watch': getDependencyVersion(package, 'grunt-contrib-watch'),
	    'grunt-contrib-uglify': getDependencyVersion(package, 'grunt-contrib-uglify'),
	    'grunt-contrib-cssmin': getDependencyVersion(package, 'grunt-contrib-cssmin'),
	    'grunt-contrib-less': getDependencyVersion(package, 'grunt-contrib-less'),
	    'grunt-contrib-coffee': getDependencyVersion(package, 'grunt-contrib-coffee')
		},
		scripts: {
			start: 'node app.js',
			debug: 'node debug app.js'
		},
		main: 'app.js',
		repository: {
			type: 'git',
			url: util.format('git://github.com/%s/%s.git', scope.github.username, scope.appName)
		},
		author: scope.author || '',
		license: ''
	});
};





/**
 * getDependencyVersion
 * 
 * @param  {Object} packageJSON
 * @param  {String} module
 * @return {String}
 * @api private
 */

function getDependencyVersion (packageJSON, module) {
	return (
		packageJSON.dependencies[module] ||
		packageJSON.devDependencies[module] ||
		packageJSON.optionalDependencies[module]
	);
}
