/**
 * Module dependencies
 */

var path = require('path');
var exec = require('child_process').exec;
var spawn = require('cross-spawn');
var _ = require('lodash');
var async = require('async');
var fsx = require('fs-extra');


/**
 * after()
 *
 * Runs after this generator has successfully finished
 * processing all of its targets.
 *
 * (if any target fails, then it would run the `error` LC instead)
 *
 * @param  {Dictionary}   scope
 * @param  {Function} cb
 */

module.exports = function afterGenerate(scope, cb) {

  // Read the contents of the newly created package.json file.
  var pathToPackageJson = path.resolve(scope.rootPath, './package.json');
  var pjData = fsx.readJsonSync(pathToPackageJson);

  // Delete the sails dependency--we'll add it separately.
  // (it always gets npm linked)
  delete pjData.dependencies.sails;

  // Keep track of any non-fatal errors that occur below
  // when we try to create symlinks.
  var nonFatalErrorsWhenCreatingSymlinks = [];

  // Get the installed NPM version, if possible.
  exec('npm -v', function(err, stdout, stderr) {

    var version;
    // The strategy for NPM 3+ will always work, regardless of the
    // actual NPM version (as long as NPM is installed).  So we
    // default to the '3.0.0' strategy if `npm -v` doesn't work
    // for some reason.
    if (err) {
      version = '3.0.0';
    }
    else {
      version = stdout;
    }

    if (version.split('.')[0] < 3 || scope.link === true) {
      async.auto({

        // Create the node_modules folder
        create_node_modules: function (cb) {
          fsx.mkdir(path.resolve(scope.rootPath, './node_modules'), cb);
        },

        // Create links to all necessary dependencies
        dependencies: ['create_node_modules', function(results, cb) {

          async.parallel(_.map(_.keys(pjData.dependencies), function copyDependency(moduleName){

            // Make a symlink between the dependency in the sails node_modules folder,
            // and the new app's node_modules.
            return function _copyDependency(next) {
              var srcModulePath = path.resolve(scope.sailsRoot, 'node_modules', moduleName);
              var destModulePath = path.resolve(scope.rootPath, 'node_modules', moduleName);

              // Use the "junction" option for Windows
              fsx.symlink(srcModulePath, destModulePath, 'junction', function(symLinkErr) {
                // If a symbolic link fails, push it to the `nonFatalErrorsWhenCreatingSymlinks` stack,
                if (symLinkErr) {
                  nonFatalErrorsWhenCreatingSymlinks.push(symLinkErr);
                }
                // >- but keep going either way.
                return next();
              });
            };

          }), cb);//</async.parallel>

        }],//</dependencies>

        // Create a link to the sails we used to create the app
        create_sails_link: ['create_node_modules', function create_sails_link(results, cb) {
          fsx.symlink(scope.sailsRoot, scope.rootPath + '/node_modules/sails', 'junction', function(symLinkErr) {
            // If a symbolic link fails, push it to the `nonFatalErrorsWhenCreatingSymlinks` stack,
            if (symLinkErr) {
              nonFatalErrorsWhenCreatingSymlinks.push(symLinkErr);
            }
            // but keep going either way.
            cb();
          });
        }]
      },

      doneGeneratingApp);
    }//</if this is npm 3>
    else {

      async.auto({

        // Create the node_modules folder
        create_node_modules: function create_node_modules(cb) {
          fsx.mkdir(scope.rootPath + '/node_modules', cb);
        },

        // Create a link to the sails we used to create the app
        create_sails_link: ['create_node_modules', function create_sails_link(results, cb) {
          fsx.symlink(scope.sailsRoot, scope.rootPath + '/node_modules/sails', 'junction', function(symLinkErr) {
            // If a symbolic link fails, push it to the `nonFatalErrorsWhenCreatingSymlinks` stack,
            if (symLinkErr) {
              nonFatalErrorsWhenCreatingSymlinks.push(symLinkErr);
            }
            // but keep going either way.
            cb();
          });
        }],

        // Install other dependencies with NPM
        install_other_deps: ['create_sails_link', function(results, cb) {
          console.log(
            '=====================================================\n'+
            'You seem to be using NPM >= v3.0.0, which no longer\n'+
            'supports symbolic links in the `node_modules/` folder.\n'+
            'As of Feb. 2016, the Sails team is still working on a\n'+
            'speedier solution to optimize `sails new` that will\n'+
            'be released as a 0.12.x patch. But in the mean time,\n'+
            'your new Sails app\'s dependencies must be set up\n'+
            'using `npm install`.\n'+
            'Because of this, creating your new Sails app will\n'+
            'take longer than you might be used to. Please bear\n'+
            'with us; or if you have a need for speed, downgrade\n'+
            'to NPM < v3.0.0 in the mean time.  Thanks!\n'+
            '====================================================='+
            '\n'+
            'Installing dependencies... (this could take a little while)'
          );

          var npmInstall = spawn('npm', ['install'], {cwd: scope.rootPath, stdio: 'inherit'});
          npmInstall.on('close', cb);
        }]

      },

      doneGeneratingApp);

    }//</else>

  });//</`npm -v` (child process)>

  function doneGeneratingApp(err) {
    if (err) { return cb(err); }

    // SUCCESS!
    cb.log.info('Created a new Sails app `' + scope.appName + '`!');

    // Warn that user needs to run `npm install`:
    if (nonFatalErrorsWhenCreatingSymlinks.length > 0) {
      cb.log.warn('Could not create symbolic links in the newly generated `node_modules` folder');
      cb.log.warn('(usually this is due to a permission issue on your filesystem)');
      cb.log.warn('Before you run your new app, `cd` into the directory and run:');
      cb.log.warn('$ npm install');
    }
    return cb();
  }

};
