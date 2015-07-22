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
        .factory('hnResourceService', function($q, $log) {
            return {
                getPosts: function() {
                    var hiringPostsPromise = $q.defer();

                    var hiringPosts = [];
                    var freelancerPosts = [];
                    var wantstobehiredPosts = [];

                    var promises = [];

                    this.getUser('whoishiring').then(function (data) {
                        for (var child in data.submitted) {
                            var p = this.getItem(data.submitted[child]).then(function (data) {
                                if (data.title === undefined) {
                                    return;
                                } else if (data.title.indexOf('Ask HN: Who is hiring?') >= 0) {
                                    //arr.push(data.id);
                                    hiringPosts.push(data.id);
                                } else if (data.title.indexOf('Ask HN: Freelancer? Seeking freelancer?') >= 0) {
                                    freelancerPosts.push(data.id);
                                } else if (data.title.indexOf('Ask HN: Who wants to be hired?') >= 0) {
                                    wantstobehiredPosts.push(data.id);
                                }
                            });
                            promises.push(p);
                        }
                        $q.all(promises).then(function() {
                            hiringPostsPromise.resolve({
                                'hiringPosts': hiringPosts,
                                'freelancerPosts': freelancerPosts,
                                'wantstobehiredPosts' : wantstobehiredPosts
                            });
                        })
                    }.bind( this ));
                    return hiringPostsPromise.promise;
                },
                getUser: function(name) {
                    // return $http.get('https://hacker-news.firebaseio.com/v0/user/'+name+'.json');
                    return $q(function(resolve, reject) {
                        new Firebase('https://hacker-news.firebaseio.com/v0/user/').child(name).on('value', function(snap) {
                            resolve(snap.val());
                        }, function(err) {
                            $log.log('Firebase error', err);
                        });
                    });
                },

                getItem: function(id) {
                    // return $http.get('https://hacker-news.firebaseio.com/v0/item/'+id+'.json');
                    return $q(function(resolve, reject) {
                        new Firebase('https://hacker-news.firebaseio.com/v0/item/').child(id).on('value', function(snap) {
                            resolve(snap.val());
                        }, function(err) {
                            $log.log('Firebase error', err);
                        });
                    });                    
                }
            }
        });
})(
    window.angular,
    window._,
    window.angular.module('hackjob')
);