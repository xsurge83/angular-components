'use strict';

angular.module('angularComponentsApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.ckeditorContent = '<h1> This is the inline editor have fun </h1>';
    $scope.config = null;

  });
