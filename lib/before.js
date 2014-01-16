var _ = require('lodash');

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
		appName: 'Untitled'
	});

	sb();
};

