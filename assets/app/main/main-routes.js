(function(ng) {

    'use strict';

    ng.module('hackjob')
        .config(function($stateProvider, $urlRouterProvider) {

            $urlRouterProvider
                .when('/', '/who-is-hiring')
                .when('', '/who-is-hiring');

            $stateProvider
                .state('who-is-hiring', {
                    url: '/who-is-hiring',
                    controller: function WhoIsHiringCtrl($scope) {
                        $scope.app = {
                            name: 'hackjob',
                            description: 'Who is hiring on Hacker News?',
                            flavor: 'Use tags to find jobs! Try searching for technologies (<code>Java</code>, <code>C</code>, <code>Node.js</code>), locations (<code>Los-Angeles</code>, <code>NYC</code>, <code>SF</code>), or perks (<code>free-lunch</code>).',
                            route: 'who-is-hiring',
                            dataBinding: 'hiringPosts'
                        };

                        $scope.tags = [ 'NYC', 'Java', 'full-time' ];
                    },
                    templateUrl: 'app/main/main.html'
                }).state('who-wants-to-be-hired', {
                    url: '/who-wants-to-be-hired',
                    controller: function WhoWantsToBeHiredCtrl($scope) {
                        $scope.app = {
                            name: 'hackjob',
                            description: 'Who wants to be hired on Hacker News?',
                            flavor: 'Need help finding your next teammate? Search for educational level (<code>PhD</code>, <code>B.S.</code>), locations (<code>Bostom</code>, <code>Seattle</code>, <code>Atlanta</code>), or skills (<code>full-stack</code>, <code>generalist</code>).',
                            route: 'who-wants-to-be-hired',
                            dataBinding: 'wantstobehiredPosts'
                        };

                        $scope.tags = [ 'PhD', 'Python' ];
                    },
                    templateUrl: 'app/main/main.html'
                }).state('freelancer-seeking-freelancer', {
                    url: '/freelancer-seeking-freelancer',
                    controller: function WhoWantsToBeHiredCtrl($scope) {
                        $scope.app = {
                            name: 'hackjob',
                            description: 'Freelander or seeking freelancer on Hacker News?',
                            flavor: 'If you\'re looking for a freelancer, use the <code>seeking-work</code> tag with specific technologies or skills (<code>C#</code>, <code>Go</code>, <code>iOS</code>). If you\'re a freelancer looking for opportunities, try using the <code>seeking-freelancer</code> tag.',
                            route: 'freelancer-seeking-freelancer',
                            dataBinding: 'freelancerPosts'
                        };

                        $scope.tags = [ 'seeking-work', 'remote', 'C#' ];
                    },
                    templateUrl: 'app/main/main.html'
                });

        })
        .controller('HackJobCtrl', function ($scope, $http, $log, $q, hnResourceService, utilService) {

          $scope.max = 100;
          $scope.progress = 0;
          $scope.loaded = false;
          $scope.nfound = false;

          $scope.jobs = [];
          $scope.foundJobs = [];

          $scope.$watch('progress', function() {
            if ($scope.progress === $scope.max) {
              $scope.loaded = true;
            }
          });

          $scope.$watch('app', function() {
            $scope.loaded = false;
            $scope._populate($scope.app.dataBinding);
          });

          $scope._populate = function(type) {
            // reset
            $scope.jobs.splice(0, $scope.jobs.length);
            hnResourceService.getPosts().then(function (posts) {
              var postsArr = posts[type];
              postsArr.sort();
              // get most recent hiring post
              return postsArr[postsArr.length-1];
            }).then( function (post) {
              hnResourceService.getItem(post).then(function (data) {
                $scope.max = data.kids.length;
                for (var child in data.kids) {
                  hnResourceService.getItem(data.kids[child]).then(function (data) {
                    $scope.jobs.push(data);
                  }).finally( function () {
                    ++$scope.progress;
                  });
                }
              });
            });
          };

          $scope.findJobs = function(tags) {
            $log.log(tags);
            $scope.foundJobs = [];
            $scope.nfound = false;
            for (var job in $scope.jobs) {
              if (utilService.validJob($scope.jobs[job], tags)) {
                utilService.prettify($scope.jobs[job]);                
                $scope.foundJobs.push($scope.jobs[job]);
              }
            }
            if ($scope.foundJobs.length === 0) {
              $scope.nfound = true;
            }
          };

        })
        .directive('bindHtmlCompile', ['$compile', function ($compile) {
          return {
            restrict: 'A',
            link: function (scope, element, attrs) {
              scope.$watch(function () {
                return scope.$eval(attrs.bindHtmlCompile);
              }, function (value) {
                element.html(value);
                $compile(element.contents())(scope);
              });
            }
          };
        }])
        .directive('a', function() {
          return {
            restrict: 'E',
            link: function(scope, elem, attrs) {
              attrs.$observe('href', function() {
                var a = elem[0];
                if (location.host.indexOf(a.hostname) !== 0)
                  a.target = '_blank';
              })
            }
          }
        });
})(
    window.angular
);
