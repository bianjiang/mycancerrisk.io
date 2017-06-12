'use strict';

angular.module('CRCRiskApp.welcome', ['ngRoute', 'ui.bootstrap'])
    .controller('welcomeCtrl', ['$scope', '$http', '$location', '$rootScope', '$uibModal', '$window', '$route', '$interval', function($scope, $http, $location, $rootScope, $uibModal,$window,$route, $interval) {
        // $scope.open = function() {
        //     if($('.disable_login').text() == 'Login'){
        //         var popup = $window.open('/fblogin', 'C-Sharpcorner', 'width=500,height=400');
        //         var stop = $interval(function() {
        //             $http.get("/checkuser")
        //                 .success(function (response) {
        //                     if (response.message != undefined) {
        //                         console.log(response.message);
        //                         if (response.message['logged_in'] == true) {
        //                             $interval.cancel(stop);
        //                             popup.close();
        //                             $scope.button = 'Take Test';
        //                             $(".welcome-bnt").attr("href", "#/risk");
        //                             if (response.message['status'] == 'newuser') {
        //                                 if (response.message['email'] != 'none') {
        //                                     $rootScope.fbemail = response.message['email'];
        //                                 }
        //                                 $location.path('/user');
        //                             }
        //                             $window.location.reload();
        //                         }
        //                     }
        //                 }).error(function(error) {
        //                     console.log("not login");
        //                 });
        //           }, 2000);
        //     }
        // };
        // check user existence
        $http.get("/checkuser")
            .success(function (response) {
                if (response.message != undefined) {
                    console.log(response.message);
                    if (response.message['logged_in'] == true) {
                        $scope.button = 'Take Test';
                        $(".welcome-bnt").attr("href", "#/risk");
                        if (response.message['status'] == 'newuser') {
                            if (response.message['email'] != 'none') {
                                $rootScope.fbemail = response.message['email'];
                            }
                            $location.path('/user');
                        }
                    }
                } else {
                        $scope.button = 'Login';
                }
            }).error(function(error) {
                console.log("not login");
            });
}]);