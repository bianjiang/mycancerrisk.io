'use strict';

angular.module('CRCRiskApp.risk-results', ['ngRoute','schemaForm','smart-table','angular-loading-bar','ui.bootstrap'])
    .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
            cfpLoadingBarProvider.latencyThreshold = 50;
            cfpLoadingBarProvider.includeSpinner = false;
            cfpLoadingBarProvider.includeBar = true;
            cfpLoadingBarProvider.loadingBarTemplate = '<div id="loading-bar"><span class="fa">Working hard...</span><div class="bar"><div class="peg"></div></div></div>';

        }])
    .controller('CRCRiskResultsCtrl', ['$scope', '$http', '$location', '$filter','$timeout', 'cfpLoadingBar', '$rootScope', '$uibModal', function($scope,$http,$location, $filter, $timeout, cfpLoadingBar,$rootScope, $uibModal ) {
        $scope.pretty = function(){
            return typeof $scope.response === 'string' ? $scope.response : JSON.stringify($scope.response, undefined, 2);
        };
        cfpLoadingBar.start();
        $scope.open = function (title) {
            console.log(title);
            var modalScope = $scope.$new();
            modalScope.params = {'title': title};
            var modalInstance = $uibModal.open({
                templateUrl: '../static/app/crc-risk/moreinfo.html',
                controller: 'moreinfoCtrl',
                scope: modalScope,
                size: 'lg'
            });
            modalScope.modalInstance = modalInstance;
            modalInstance.result.then(function (result) {
            }, null);
        }
        $http.get("/checkuser")
          .success(function (response) {
            console.log(response.message)
            if (response.message != undefined) {
              console.log(response.message)
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
        $scope.rowCollection = {};
        // $scope.factors1 = 'Close relatives (parents, brothers, sisters, or children) who have had colorectal cancer. If you have close relatives who have had colorectal cancer, your risk of colorectcal cancer is slightly higher. This is more true if the relative had the cancer at a young age. If you have many close relatives who have had colorectal cancer, the risk can be even higher.';
        // console.log($rootScope.result_time);
        $http({
                method: 'POST',
                url: '/getresult',
                data: {
                    info: $rootScope.result_time
                }
                }).then(function(response) {
                    var temp = [];
                    var race = ['White','Black','Hispanic','Asian'];
                    console.log(response.data);
                    temp.push({ absRsk5: Math.round(response.data['test_result']['absRsk'][0]*10000)/100,
                                absRsk10: Math.round(response.data['test_result']["absRsk"][1]*10000)/100,
                                absRsklife: Math.round(response.data['test_result']["absRsk"][2]*10000)/100,
                                avgRsk5: Math.round(response.data['test_result']["avgrisk"][0]*10000)/100,
                                avgRsk10 : Math.round(response.data['test_result']["avgrisk"][1]*10000)/100,
                                avgRsklife : Math.round(response.data['test_result']["avgrisk"][2]*10000)/100});
                    $scope.rowCollection = temp;
                    $scope.race = race[response.data['user_info']['race']-1];
                    $scope.age = response.data['user_info']['age'];
                    $scope.gender = response.data['user_info']['gender'];
                    if (temp[0]['absRsk5'] > temp[0]['avgRsk5']) {
                        $scope.cmp5 = 'higher than';
                    } else if (temp[0]['absRsk5'] < temp[0]['avgRsk5']) {
                        $scope.cmp5 = 'lower than';
                    } else {
                        $scope.cmp5 = 'equal to';
                    };
                    if (temp[0]['absRsk10'] > temp[0]['avgRsk10']) {
                        $scope.cmp10 = 'higher than';
                    } else if (temp[0]['absRsk10'] < temp[0]['avgRsk10']) {
                        $scope.cmp10 = 'lower than';
                    } else {
                        $scope.cmp5 = 'equal to';
                    };
                    if (temp[0]['absRsklife'] > temp[0]['avgRsklife']) {
                        $scope.cmplife = 'higher than';
                    } else if (temp[0]['absRsklife'] < temp[0]['avgRsklife']) {
                        $scope.cmplife = 'lower than';
                    } else {
                        $scope.cmp5 = 'equal to';
                    };
                }, function(error) {
                    console.log(error);
                });

    }])
    .controller('moreinfoCtrl', ['$scope','$rootScope','$http', function ($scope,$rootScope,$http) {
        $scope.close = function () {
              $scope.modalInstance.dismiss('cancel');
        };
        console.log($scope.params)
        $scope.title = $scope.params.title;
        $http.get('/static/app/asset/crc/factors.json').success(function(data) {
            $scope.content = data[$scope.title]
            // console.log(data[$scope.title])
          }).error(function() {
            $scope.error = 'Failed to load...';
          });
}]);