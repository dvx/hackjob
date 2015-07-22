/**
 * grunt/pipeline.js
 *
 * The order in which your css, javascript, and template files should be
 * compiled and linked from your views and static HTML files.
 *
 * (Note that you can take advantage of Grunt-style wildcard/glob/splat expressions
 * for matching multiple files.)
 */



// CSS files to inject in order
//
// (if you're using LESS with the built-in default config, you'll want
//  to change `assets/styles/importer.less` instead.)
var cssFilesToInject = [
  //'vendor/bootstrap/dist/css/bootstrap.min.css',
  //'vendor/bootstrap/dist/css/bootstrap-theme.min.css',

  'vendor/bootflat/bootstrap/bootstrap.min.css',
  'vendor/bootflat/css/bootflat.css',
  'vendor/bootflat/css/bootflat-square.css',
  'vendor/bootflat/css/font-awesome.min.css',

  'vendor/ng-tags-input/ng-tags-input.min.css',

  'styles/**/*.css'
];


// Client-side javascript files to inject in order
// (uses Grunt-style wildcard/glob/splat expressions)
var jsFilesToInject = [
  'vendor/sails.io.js/dist/sails.io.js',
  'vendor/jquery/dist/jquery.min.js',
  'vendor/angular/angular.min.js',
  'vendor/angular-sanitize/angular-sanitize.min.js',
  'vendor/lodash/dist/lodash.min.js',
  'vendor/restangular/dist/restangular.min.js',
  'vendor/angular-ui-router/release/angular-ui-router.min.js',

  'vendor/angular-animate/angular-animate.min.js',

  'vendor/angular-bootstrap/ui-bootstrap-tpls.min.js',
  'vendor/angular-sails/dist/angular-sails.min.js',

  'vendor/ng-tags-input/ng-tags-input.min.js',

  'vendor/firebase/firebase.js',
  'vendor/angularfire/angularfire.min.js',

  'app/app.js',
  'app/**/*.js'
];


// Client-side HTML templates are injected using the sources below
// The ordering of these templates shouldn't matter.
// (uses Grunt-style wildcard/glob/splat expressions)
//
// By default, Sails uses JST templates and precompiles them into
// functions for you.  If you want to use jade, handlebars, dust, etc.,
// with the linker, no problem-- you'll just want to make sure the precompiled
// templates get spit out to the same file.  Be sure and check out `tasks/README.md`
// for information on customizing and installing new tasks.
var templateFilesToInject = [
  'templates/**/*.html'
];



// Prefix relative paths to source files so they point to the proper locations
// (i.e. where the other Grunt tasks spit them out, or in some cases, where
// they reside in the first place)
module.exports.cssFilesToInject = cssFilesToInject.map(function(path) {
  return '.tmp/public/' + path;
});
module.exports.jsFilesToInject = jsFilesToInject.map(function(path) {
  return '.tmp/public/' + path;
});
module.exports.templateFilesToInject = templateFilesToInject.map(function(path) {
  return 'assets/' + path;
});
