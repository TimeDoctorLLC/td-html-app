angular.module("todo")
  .service('Msg', function ($rootScope, $location, DS) {
  'use strict';

  var socket = io((new URL(DS.defaults.basePath)).origin, {
    path: '/api/1.0/socket', transports: ['websocket', 'polling']
  });

  // real-time data modification
  socket.on('notify', function(data) {

    // @todo: remove
    console.log('notify::data', data);

    switch(data.method) {
      case 'post': DS.find(data.resource, data.id); break;
      case 'put': DS.refresh(data.resource, data.id); break;
      case 'delete': DS.eject(data.resource, data.id); break;
    };
  });

  /*
  socket.on('create', function (data) {
    if (data.ownerId && $rootScope.loggedInUser && $rootScope.loggedInUser.id === data.ownerId) {
      DS.find(data.resource, data.id);
    }
    $rootScope.$broadcast('create', data.resource, data.id, data.ownerId);
  });

  socket.on('update', function (data) {
    if (data.id === 'all' && data.seriesId) {
      angular.forEach(DS.filter(data.resource, {seriesId: data.seriesId}), function (instance) {
        DS.refresh(data.resource, instance.id);
      });
    } else {
      DS.refresh(data.resource, data.id);
    }
    $rootScope.$broadcast('update', data.resource, data.id, data.ownerId);
  });

  socket.on('destroy', function (data) {
    if (data.id === 'all' && data.lessonId) {
      DS.ejectAll(data.resource, {lessonId: data.lessonId});
    } else {
      DS.eject(data.resource, data.id);
    }
    $rootScope.$broadcast('destroy', data.resource, data.id, data.ownerId);
  });*/

  return {};
}).run(function (Msg) {
});
