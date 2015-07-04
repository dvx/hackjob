(function(ng) {

    'use strict';

    ng.module('hackjob')
        .config(function($stateProvider, $urlRouterProvider) {

            $urlRouterProvider
                .when('/', '/jobs')
                .when('', '/jobs');

            $stateProvider
                .state('main', {
                    url: '/jobs',
                    controller: function MainCtrl($scope) {
                        $scope.app = {
                            name: 'hackjob',
                            description: 'An Angular-frontend-based Sails application'
                        };
                    },
                    templateUrl: 'app/main/main.html'
                });
        })
        .controller('HackJobCtrl', function ($scope, $http, $log, $q, hnResourceService, utilService) {

          $scope.max = 100;
          $scope.progress = 0;
          $scope.loaded = false;
          $scope.jobs = [];
          $scope.foundJobs = [];

          hnResourceService.getHiringPosts().then(function (hPosts) {
            hPosts.sort();
            // get most recent hiring post
            return hPosts[hPosts.length-1];
          }).then( function (hPost) {
              hnResourceService.getItem(hPost).success(function (data) {
                $scope.max = data.kids.length;
                for (var child in data.kids) {
                  hnResourceService.getItem(data.kids[child]).success(function (data) {
                      $scope.jobs.push(data);
                  }).finally( function () {
                      $scope.progress++;
                  });
                }
              });
          });

          $scope.$watch('progress', function() {
            if ($scope.progress === $scope.max) {
              $scope.loaded = true;
            }
          });

          $scope.tags = [ 'NYC', 'Java', 'full-time' ];

          $scope.findJobs = function(tags) {
            $log.log(tags);
            $scope.foundJobs = [];
            for (var job in $scope.jobs) {
              if (utilService.validJob($scope.jobs[job], tags)) {
                utilService.prettify($scope.jobs[job]);                
                $scope.foundJobs.push($scope.jobs[job]);
                $log.log($scope.jobs[job]);
              }
            }
          };

        })
        .directive("animateFade", function() {
          return {
            restrict: "C",
            link: function(scope, element) {
              // Get the height of this element and it's parent height
              var height = element[0].offsetHeight;
              var parentHeight = element.parent()[0].offsetHeight;

              // If this element's height is greater than that of the parent,
              // update the parents's height. Always pick the largest one as this
              // will mean no flickering.
              if (height > parentHeight) {
                   element.parent().css('height', height + 'px');
              }
            }
          }
        });
})(
    window.angular
);
