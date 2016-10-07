/**
 * Module dependencies
 */

var util = require('util');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');


/**
 * before()
 *
 * Runs before this generator begins processing targets.
 *
 * @param  {Dictionary} scope
 * @param  {Function} done
 */

module.exports = function before (scope, done) {

  var args0 = scope.args[0];

  // Use a reasonable default app name
  var defaultAppName = args0;

  // Ensure that default app name is not "." or "" and does not contain slashes.
  if (defaultAppName === '.' || defaultAppName === './' || !defaultAppName) {
    defaultAppName = path.basename(process.cwd());
  }
  defaultAppName = defaultAppName.replace(/\//, '-');


  var author = process.env.USER || 'anonymous node/sails user';

  var owner = author;

  _.defaults(scope, {
    appName: defaultAppName,
    author: author,
    owner: owner,
    year: (new Date()).getFullYear(),
    github: {
      username: author,
      owner: owner
    },
    modules: {},
    website: util.format('https://github.com/%s', owner)
  });

  // Allow for alternate --no-front-end cli option
  if (scope['front-end'] === false) {
    scope['frontend'] = false;
  }

  if (scope['frontend'] === false) {
    scope.modules['frontend'] = false;
    scope.modules['gruntfile'] = false;
    scope.modules['views'] = false;
  }

  // TODO: deprecate this environment variable (just use scope instead)
  if (process.env.SAILS_NEW_LINK && scope.link !== false) {
    scope.link = true;
  }

  // Make changes to the rootPath where the sails project will be created
  scope.rootPath = path.resolve(process.cwd(), args0 || '');

  // Ensure we aren't going to inadvertently delete any files.
  try {
    var files = fs.readdirSync(scope.rootPath);
    if (files.length > 0) {
      return done(new Error('Couldn\'t create a new Sails app in "'+scope.rootPath+'" (directory already exists and is not empty)'));
    }
  }
  catch (e) { }

  return done();
};
