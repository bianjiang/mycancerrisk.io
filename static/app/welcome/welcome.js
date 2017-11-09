'use strict';

angular.module('CRCRiskApp.welcome', ['ngRoute', 'ui.bootstrap'])
    .controller('welcomeCtrl', ['$scope', '$http', '$location', '$rootScope', '$uibModal', '$window', '$route', '$interval', function($scope, $http, $location, $rootScope, $uibModal,$window,$route, $interval) {

        $http({
            method: 'get',
            url: '/checkuser'
        }).then(function (response) {
            if (response.data.message != undefined) {
                    if (response.data.message['logged_in'] == true) {
                        $scope.button = 'Take Test';
                        $(".welcome-bnt").attr("href", "#/risk");
                        if (response.data.message['status'] == 'newuser') {
                            if (response.data.message['email'] != 'none') {
                                $rootScope.fbemail = response.data.message['email'];
                            }
                            $location.path('/user');
                        }
                    }
                } else {
                        $scope.button = 'Login';
                }
        },function (error){
            console.log(error, '"not login"');
        });


}]);