var _ = require('lodash');
var path = require('path');

/**
 * sails-generate-new
 * 
 * Usage:
 * `sails-generate-new`
 * 
 * @type {Object}
 */
module.exports = function (scope, sb) {

	_.defaults(scope, {
		author: 'a Node.js/Sails.js Contributor',
		year: (new Date()).getFullYear(),
		appName: (scope.args[0] === '.' || !scope.args[0]) ? path.basename(process.cwd()) : scope.args[0],
	});

	scope.rootPath = path.resolve(process.cwd(), scope.args[0] || ''),

	sb();
};

