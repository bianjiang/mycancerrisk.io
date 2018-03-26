'use strict';
var _env = {};

// Declare app level module which depends on views, and components
var CRCRiskApp = angular.module('CRCRiskApp', [
  'ngRoute',
  'CRCRiskApp.risk',
  'CRCRiskApp.risk-results',
  'CRCRiskApp.test-results',
  'CRCRiskApp.about',
  'CRCRiskApp.welcome',
  'CRCRiskApp.user',
  'CRCRiskApp.version',
  'CRCRiskApp.global',
  'ngCookies'
]);
CRCRiskApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/', {
    // templateUrl: '../static/app/index/index.html',
    // controller: 'IndexCtrl'
    redirectTo: '/welcome'
  })
    .when('/about', {
    templateUrl: '../static/app/about/about.html',
    controller: 'AboutCtrl'
  })
    .when('/risk', {
    templateUrl: '../static/app/crc-risk/crc-risk.html',
    controller: 'CRCRiskCtrl'
  })
    .when('/risk-results', {
    templateUrl: '../static/app/crc-risk/crc-risk-results.html',
    controller: 'CRCRiskResultsCtrl'
  })
    .when('/user', {
    templateUrl: '../static/app/user/user.html',
    controller: 'UserCtrl'
  })
    .when('/test-results', {
    templateUrl: '../static/app/test-results/test-results.html',
    controller: 'TestResultsCtrl'
  })
    .when('/welcome', {
    templateUrl: '../static/app/welcome/welcome.html',
    controller: 'welcomeCtrl'
  })
  //   .when('/consentform', {
  //     templateUrl: '../static/app/welcome/consentform.html',
  //     controller: 'consentformCtrl'
  // })
  .otherwise({redirectTo: '/welcome'});
}])

CRCRiskApp.run(['$rootScope', '$location', '$window', '$routeParams',
  function($rootScope,$location,$window,$routeParams) {

    $rootScope.$on('$routeChangeSuccess', function(e, current, pre) {
      var route = $location.path().substring(1);
      console.log('Current route name: ' + route);
      // Get all URL parameter
      //console.log($routeParams);
      angular.element(document.querySelector('.nav.navbar-nav > li.active')).removeClass('active');
      if (route != '') {
        angular.element(document.querySelector('.nav.navbar-nav > li#' + route)).addClass('active');
      }
    });

}]);

CRCRiskApp.controller('GlobalCtrl', ['$scope', '$http','$cookies','$location', '$route', '$window', function($scope,$http,$cookies,$location,$route,$window) {
    $scope.logout = function() {
      $http({
                method: 'get',
                url: '/logout'
            }).then(function (response) {
                    $cookies.remove('logged_in');
                    $cookies.remove('status');
                    $cookies.remove('confirm_consent');
                    $window.location.reload();
            },function (error){
                console.log(error, '"not log out"');
            });
    };
}]);

// Import variables if present(from env.js)
if(window){
  Object.assign(__env, window.__env);
}




