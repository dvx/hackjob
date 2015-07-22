/* global console */
(function(ng, _, module) {

    'use strict';

    if (!module) {
        throw new Error('Could not load angular module to attach service');
    }

    module
        .value('utilDefinitions', {})
        .service('utilDefinitions', function() {

        })
        .factory('utilService', function($http, hnResourceService) {
            return {
                validJob: function (job, tags) {
                    if (job.dead || job.deleted || tags.length == 0) {
                        return false;
                    }
                    var haystack = job.text;
                    var found = 0;
                    for (var tag in tags) {
                        var needle = tags[tag].text;
                        // use regex for small strings
                        if (needle.length < 4) {
                            var reg = new RegExp('(\\W|^)' + this.escapeRegExp(needle) + '(\\W|\\A|\\z|$)','i');
                            if (haystack.match(reg)) {
                                found++;
                            } else {
                                // try again replacing dashes with spaces
                                var reg = new RegExp('(\\W|^)' + this.escapeRegExp(needle.replace('-', ' ')) + '(\\W|\\A|\\z|$)','i');
                                if (haystack.match(reg)) {
                                    found++;
                                }
                            }
                        // use indexof for large(r) strings
                        } else {
                            if (haystack.toLowerCase().indexOf(needle.toLowerCase()) >= 0) {
                                found++;
                            } else {
                                // try again replacing dashes with spaces
                                if (haystack.toLowerCase().indexOf(needle.replace('-', ' ').toLowerCase()) >= 0) {
                                    found++;
                                }
                            }
                        }
                    }
                    if (found >= tags.length) {
                        return true;
                    }
                },
                escapeRegExp: function (str) {
                    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
                },
                prettify: function (job) {
                    var title = job.text.substring(0, job.text.indexOf("<p>"));
                    job.title = title.replace(/^(.{192}[^\s]*).*/, "$1");
                    if (job.title.length == 0) {
                        job.title = 'Job posting by ' + job.by;
                    }
                }
            }
        });

})(
    window.angular,
    window._,
    window.angular.module('hackjob')
);