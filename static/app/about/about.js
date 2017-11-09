'use strict';

angular.module('CRCRiskApp.about', ['ngRoute', 'ui.bootstrap'])
    .controller('AboutCtrl', ['$scope', '$http', '$location', '$rootScope', function($scope, $http, $location, $rootScope) {
        // check user existence
        $http({
            method: 'get',
            url: '/checkuser'
        }).then(function (response) {
            if (response.data.message != undefined) {
                    if (response.data.message['logged_in'] != true) {
                        $location.path('/welcome');
                    }
                } else {
                       $location.path('/welcome');
                }
        },function (error){
            console.log(error, '"not login"');
        });
}]);