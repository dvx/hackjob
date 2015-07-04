/* global console */
(function(ng, _, module) {

    'use strict';

    if (!module) {
        throw new Error('Could not load angular module to attach service');
    }

    module
        .value('sailsResourceDefinitions', {})
        .service('SailsResourceDefinitions', function(sailsResourceDefinitions, Restangular, $q) {
            function _get(model_name) {
                return Restangular
                    .one(model_name, 'definition')
                    .get()
                    .then(function(definition) {
                        sailsResourceDefinitions[model_name] = definition;
                        return definition;
                    });
            }
            this.get = function getModelDefinition(model_name) {
                return $q.when(sailsResourceDefinitions[model_name] || _get(model_name));
            };
        })
        .factory('SailsResourceService', function(Restangular) {

            function _list() {
                return Restangular.all(this.model_name).getList();
            };

            function _get(id) {
                return Restangular.one(this.model_name, id).get();
            };

            function SailsResourceService(model_name) {
                this.model_name = model_name;
                this.list = _.bind(_list, this);
                this.get = _.bind(_get, this);
            }

            SailsResourceService.prototype.save = function(model, collection) {
                model = model || {};
                var action = (!_.isUndefined(model.id) || model.id > 0) ?
                    'update' :
                    'add';
                return this[action](model, collection)
                    .then(function(res) {
                        return res;
                    }, function(err) {
                        console.error('An error occured: ' + err);
                        return err;
                    });
            };

            SailsResourceService.prototype.add = function add(model, collection) {
                if (collection && !_.isUndefined(collection.length)) {
                    return collection
                        .post(model)
                        .then(function(saved_model) {
                            collection.push(saved_model);
                        });
                }
                return model.save();
            };

            SailsResourceService.prototype.update = function update(model) {
                return model.put();
            };

            SailsResourceService.prototype.remove = function remove(model, collection) {
                collection = _.isArray(collection) ? collection : [];
                return model.remove()
                    .then(function(res) {
                        var idx = _.findIndex(collection, {
                            id: model.id
                        });
                        if (idx >= 0) {
                            collection.splice(idx, 1);
                        }
                        return res;
                    });
            };

            return SailsResourceService;
        });

})(
    window.angular,
    window._,
    window.angular.module('hackjob')
);