/**
 * Module dependencies
 */

var path = require('path');
var sailsgen = require('sails-generate');
var Generator = require('../lib');


//
// This script exists so we can run our generator
// directly from the command-line for convenience
// during development.
//


sailsgen(Generator, {
	rootPath: path.resolve(process.cwd(), process.argv[2] || ''),
	sails: {
		version: '0',
		dependencies: {
			'sails-disk': '1.2.3',
			'ejs': '1.2.3',
			'grunt': '1.2.3'
		}
	}

	// You can stub other scope variables here, e.g.
	// foo: 'bar'

}, function (err) {
	if (err) throw err;

	// It worked!
	console.log('Done.');
});
