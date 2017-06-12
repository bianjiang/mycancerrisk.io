'use strict';

angular.module('CRCRiskApp.test-results', ['ngRoute','schemaForm','smart-table'])
    .controller('TestResultsCtrl', ['$scope', '$http', '$location', '$filter', '$rootScope', function($scope,$http,$location,$filter,$rootScope) {
        $scope.rowCollection = {}
        $http.get("/checkuser")
            .success(function (response) {
              console.log(response.message)
              if (response.message != undefined) {
                if (response.message['status'] == 'newuser') {
                  if  (response.message['email'] != 'none') {
                            $rootScope.fbemail = response.message['email'];
                          }
                  $location.path('/user')
                }
              }
            }).error(function(error) {
              console.log("not login");
            });
        $http.get("/getuserinfo")
            .success(function (response) {
               var temp = [];
               for (var key in response["test_info"]) {
                   temp.push({date: key,
                              absRsk5: Math.round(response["test_info"][key]["test_result"]["absRsk"][0]*10000)/100,
                              absRsk10: Math.round(response["test_info"][key]["test_result"]["absRsk"][1]*10000)/100,
                              absRsklife: Math.round(response["test_info"][key]["test_result"]["absRsk"][2]*10000)/100,
                              avgRsk5: Math.round(response["test_info"][key]["test_result"]["avgrisk"][0]*10000)/100,
                              avgRsk10 : Math.round(response["test_info"][key]["test_result"]["avgrisk"][1]*10000)/100,
                              avgRsklife : Math.round(response["test_info"][key]["test_result"]["avgrisk"][2]*10000)/100});
               }
               $scope.rowCollection = temp;
            }).error(function(error) {
                 console.log(error);
            });
        $scope.changeScopeTime = function(date) {
          $rootScope.result_time = date;
        }
    }]);
