"use strict";

var App = angular.module("todo", ["ui.sortable", "LocalStorageModule", 'js-data'])
  .config(function (DSProvider) {
    DSProvider.defaults.basePath = "https://td-rest-api.herokuapp.com:443/api/1.0"; // etc.
  })
  .run(function (DS, DSHttpAdapter) {

    // @todo: add proper auth
    DSHttpAdapter.defaults.httpConfig.headers = {
      Authorization: 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IlZYTWc5SWhsRWhNQU9ZRnMiLCJyZXYiOjAsImV4cCI6IjIwMTUtMDctMTNUMTc6MzA6MzIrMDA6MDAiLCJkZXYiOiJpVHJhc2gifQ.xmBfGl1P9YMqwoXokIOD-yv7oFvd4gyBz-BPykRRjT8',
      'X-Company-ID': 'VXMhSIhlEhMAOYFt'
    };

    // @todo: refactor
    DSHttpAdapter.defaults.deserialize = function (cfg, res) {
      var data = res.data;
      return (data && data.data) || data;
    };
  })
  // This code won't execute unless you actually
  // inject "Comment" somewhere in your code.
  // Thanks Angular...
  // Some like injecting actual Resource
  // definitions, instead of just "DS"
  .factory('Task', function (DS) {
    return DS.defineResource('tasks');
  })
  .factory('Project', function (DS) {
    return DS.defineResource('projects');
  })
  .factory('Folder', function (DS) {
    return DS.defineResource('folders');
  });
