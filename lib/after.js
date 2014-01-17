var fs = require('fs-extra');
var _ = require('lodash');
var path = require('path');
var async = require('async');

module.exports = function (scope, cb) {


		async.parallel(_.map(['ejs', 'sails-disk', 'grunt'], copyDependency), function(err) {

			if (err) return cb(err);
			cb.log.info('Created a new Sails app `'+scope.appName+'`!');
			return cb();

		});

		function copyDependency(moduleName) {
			return function(cb) {
				_copyDependency(moduleName, scope.sailsRoot, scope.rootPath, cb);
			}
		}

};

function _copyDependency (moduleName, srcRoot, destRoot, cb) {
	var srcModulePath = path.resolve(srcRoot, 'node_modules', moduleName);
	var destModulePath = path.resolve(destRoot, 'node_modules',moduleName);
	// console.log('src:',srcModulePath);
	// console.log('dest:',destModulePath);

	fs.copy(srcModulePath, destModulePath, function(err) {
		if (err) return cb && cb(err);

		// Parse the module's package.json
		var packageJSONPath = path.resolve(srcRoot, 'node_modules', moduleName, 'package.json');
		var packageJSON;
		try {
			packageJSON = JSON.parse(fs.readFileSync(packageJSONPath, 'utf-8'));
		} catch (e) {
			// Ignore missing package.json
			packageJSON = {
				dependencies: {}
			};
		}

		// Get actual dependencies in this module's node_modules directory
		var dependencies;
		try {
			dependencies = fs.readdirSync(path.resolve(srcRoot, 'node_modules', moduleName, 'node_modules'));
			// Remove hidden files
			_.without(dependencies, function(val) {
				return val.match(/\..+/);
			});
		} catch (e) {
			// Assume empty dependencies in the event of an error
			dependencies = {};
		}

		// If there are any missing dependencies which are available in the parent package.json
		// copy them from that node_modules directory.
		var missingModules = _.difference(_.keys(packageJSON.dependencies || {}), _.values(dependencies));
		// console.log('stated deps of ' + moduleName + ' ::' , packageJSON.dependencies);
		// console.log('actual deps of ' + moduleName + ' ::' , dependencies);
		// console.log('missing from ' + moduleName + ' ::' , missingModules);
		_.each(missingModules, function(missingModuleName) {
			// console.log('Resolving ' + moduleName + '\'s missing dependency (' + missingModuleName + ') using the version in Sails.');
			_copyDependency(missingModuleName, srcRoot, path.resolve(destRoot, 'node_modules', moduleName));
		});

		return cb && cb(err);
	});
}
