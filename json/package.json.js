
/**
 * 
 * @param  {[type]} scope [description]
 * @return {[type]}       [description]
 */
module.exports = function dataForPackageJSON (scope) {

	scope.sailsPackageJSON = { version: '?.?.?', dependencies: {} };

	// Override sails version temporarily
	var sailsVersionDependency = '~' + scope.sailsPackageJSON.version;
	sailsVersionDependency = 'git://github.com/balderdashy/sails.git#v0.10';

	return {
		name: scope.appName,
		'private': true,
		version: '0.0.0',
		description: 'a Sails application',
		dependencies: {
			'sails'     : sailsVersionDependency,
			'sails-disk': scope.sailsPackageJSON.dependencies['sails-disk'],
			'ejs'       : scope.sailsPackageJSON.dependencies['ejs'],
			'grunt'     : scope.sailsPackageJSON.dependencies['grunt'],
			'grunt-contrib-sync': scope.sailsPackageJSON.dependencies['grunt-contrib-sync'],
			'grunt-contrib-copy': scope.sailsPackageJSON.dependencies['grunt-contrib-copy'],
	    'grunt-contrib-clean': scope.sailsPackageJSON.dependencies['grunt-contrib-clean'],
	    'grunt-contrib-concat': scope.sailsPackageJSON.dependencies['grunt-contrib-concat'],
	    'grunt-sails-linker': scope.sailsPackageJSON.dependencies['grunt-contrib-linker'],
	    'grunt-contrib-jst': scope.sailsPackageJSON.dependencies['grunt-contrib-jst'],
	    'grunt-contrib-watch': scope.sailsPackageJSON.dependencies['grunt-contrib-watch'],
	    'grunt-contrib-uglify': scope.sailsPackageJSON.dependencies['grunt-contrib-uglify'],
	    'grunt-contrib-cssmin': scope.sailsPackageJSON.dependencies['grunt-contrib-cssmin'],
	    'grunt-contrib-less': scope.sailsPackageJSON.dependencies['grunt-contrib-less'],
	    'grunt-contrib-coffee': scope.sailsPackageJSON.dependencies['grunt-contrib-coffee']
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
};
