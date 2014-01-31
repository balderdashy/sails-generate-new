var fs = require('fs-extra');
var _ = require('lodash');
var path = require('path');
var async = require('async');

module.exports = function (scope, cb) {

		// Read the new package.json file
		var packageJson = require(scope.rootPath+'/package.json');

		// Remove the sails dependency, since we won't be copying it over (and it wouldn't
		// work with the method we're using to copy deps anyway)
		delete packageJson.dependencies.sails;

		async.parallelLimit(_.map(_.keys(packageJson.dependencies), copyDependency), 3, function(err) {

			if (err) return cb(err);

			// Attempt to create a symlink to Sails inside the new project's node_modules,
			// so that any subsequent `npm install` won't try to install it.  If this fails,
			// no biggie.
			fs.symlink(scope.sailsRoot, path.resolve(scope.rootPath, 'node_modules/sails'), 'dir');

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

		_.each(missingModules, function(missingModuleName) {
			_copyDependency(missingModuleName, srcRoot, path.resolve(destRoot, 'node_modules', moduleName));
		});

		return cb && cb(err);
	});
}
