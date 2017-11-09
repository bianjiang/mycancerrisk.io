'use strict';

angular.module('CRCRiskApp.test-results', ['ngRoute','schemaForm','smart-table'])
    .controller('TestResultsCtrl', ['$scope', '$http', '$location', '$filter', '$rootScope', function($scope,$http,$location,$filter,$rootScope) {
        $scope.rowCollection = {}
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
        $http({
            method: 'get',
            url: '/getuserinfo'
        }).then(function (response) {
            var temp = [];
               for (var key in response.data["test_info"]) {
                   temp.push({date: key,
                              absRsk5: Math.round(response.data["test_info"][key]["test_result"]["absRsk"][0]*10000)/100,
                              absRsk10: Math.round(response.data["test_info"][key]["test_result"]["absRsk"][1]*10000)/100,
                              absRsklife: Math.round(response.data["test_info"][key]["test_result"]["absRsk"][2]*10000)/100,
                              avgRsk5: Math.round(response.data["test_info"][key]["test_result"]["avgrisk"][0]*10000)/100,
                              avgRsk10 : Math.round(response.data["test_info"][key]["test_result"]["avgrisk"][1]*10000)/100,
                              avgRsklife : Math.round(response.data["test_info"][key]["test_result"]["avgrisk"][2]*10000)/100});
               }
               $scope.rowCollection = temp;
        },function (error){
            console.log(error);
        });

        $scope.changeScopeTime = function(date) {
          $rootScope.result_time = date;
        }
    }]);
