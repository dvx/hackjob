/* global console */
(function(ng, _, module) {

    'use strict';

    if (!module) {
        throw new Error('Could not load angular module to attach service');
    }

    module
        .value('hnResourceDefinitions', {})
        .service('hnResourceDefinitions', function() {

        })
        .factory('hnResourceService', function($http, $q) {
            return {
                getHiringPosts: function() {
                    var hiringPostsPromise = $q.defer();
                    var hiringPosts = [];
                    var promises = [];
                    this.getUser('whoishiring').success(function (data) {
                        for (var child in data.submitted) {
                            var p = this.getItem(data.submitted[child]).success(function (data) {
                                if (data.title !== undefined && data.title.indexOf('Ask HN: Who is hiring?') >= 0) {
                                    //arr.push(data.id);
                                    hiringPosts.push(data.id);
                                }
                            });
                            promises.push(p);
                        }
                        $q.all(promises).then(function() {
                            hiringPostsPromise.resolve(hiringPosts);
                        })
                    }.bind( this ));
                    return hiringPostsPromise.promise;
                },
                getUser: function(name) {
                    return $http.get('https://hacker-news.firebaseio.com/v0/user/'+name+'.json');
                },
                getItem: function(id) {
                    return $http.get('https://hacker-news.firebaseio.com/v0/item/'+id+'.json');
                }
            }
        });

})(
    window.angular,
    window._,
    window.angular.module('hackjob')
);