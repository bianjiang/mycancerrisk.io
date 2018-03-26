'use strict';

angular.module('CRCRiskApp.risk', ['ngRoute','schemaForm', 'angular-loading-bar', 'ngCookies'])
    .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
        cfpLoadingBarProvider.latencyThreshold = 50;
        cfpLoadingBarProvider.includeSpinner = false;
        cfpLoadingBarProvider.includeBar = true;
        cfpLoadingBarProvider.loadingBarTemplate = '<div id="loading-bar"><span class="fa">Working hard...</span><div class="bar"><div class="peg"></div></div></div>';

    }])
    .controller('CRCRiskCtrl', ['$scope', '$rootScope', '$http', '$location','$timeout', 'cfpLoadingBar','$cookies', function($scope, $rootScope, $http, $location, $timeout, cfpLoadingBar, $cookies) {

        $scope.pretty = function(){
            return typeof $scope.response === 'string' ? $scope.response : JSON.stringify($scope.response, undefined, 2);
        };
        // check user existence
        if ($cookies.get('logged_in') != 'true') {
            $location.path('/welcome');
        }
        console.log('test');
        $http({
            method: 'post',
            url: '/starttest',
            data: {
                      info: 'start'
                  }
        }).then(function (response) {
            console.log(response.data);
        },function (error){
            console.log(error, 'test start failed');
        });

        $scope.age = 0
        $http({
            method: 'get',
            url: '/getuserinfo'
        }).then(function (response) {
            $scope.age = response.data['age'];
            $scope.response = {'age': $scope.age};
        },function (error){
            console.log(error);
        });

        var final_response = {};

        var sections = ['demographics', 'diet', 'medical_history', 'medications', 'physical_activity', 'miscellaneous', 'family'];
        //var sections = ['diet'];
        var previous_section = []
        var next_section = function (sectionId) {
          previous_section.push(sectionId)
          $http({
              method: 'get',
              url: '/static/app/asset/crc/' + sectionId + '.json'
          }).then(function (response) {
              $scope.error = null;
              $scope.loading = false;
              $scope.schema = response.data.schema;
              $scope.form = response.data.form;
              if(final_response[sectionId] != undefined) {
                $scope.response = final_response[sectionId]
              } else {
                $scope.response = {}
              }
              $scope.sectionId = sectionId;
              if(sectionId == 'demographics') {
                $scope.response = {'age': $scope.age};
              };
          },function (error){
              console.log(error);
          });
        };


        $scope.submit = function(form) {
            // First we broadcast an event so all fields validate themselves
            $scope.$broadcast('schemaFormValidate');

            // Then we check if the form is valid
            if (form.$valid) {
              // ... do whatever you need to do with your data.
              if(responseForm.gender && responseForm.gender.value == "Male") {
                console.log(responseForm.gender.value);
                sections[4] = 'male_miscellaneous';
              }
              final_response[$scope.sectionId] = $scope.response;

              var next_sectionId = sections.shift();
              if (next_sectionId) {
                if (next_sectionId == 'miscellaneous'){
                    next_sectionId = (final_response['demographics']['gender'] == 'Male')?'male_miscellaneous':'female_miscellaneous';
                }
                next_section(next_sectionId);
              }else{
                // final
                cfpLoadingBar.start();
                $http({
                  method: 'POST',
                  url: '/saveuserinfo',
                  data: {
                      info: final_response
                  }
                  }).then(function(response) {
                      $rootScope.result_time = response.data.message;
                  }, function(error) {
                      console.log(error);
                  });

                $timeout(function(){
                    cfpLoadingBar.complete();
                    $location.path('/risk-results');
                },1000);
              }
            }
        }

        $scope.goback = function() {
              var current_section = previous_section.pop()
              sections.unshift(current_section)
               $http({
                  method: 'get',
                  url: '/static/app/asset/crc/' + previous_section[previous_section.length-1] + '.json'
              }).then(function (response) {
                  $scope.error = null;
                  $scope.loading = false;
                  $scope.schema = response.data.schema;
                  $scope.form = response.data.form;
                  $scope.sectionId = previous_section[previous_section.length-1];
                  $scope.response = final_response[$scope.sectionId]
              },function (error){
                  console.log(error);
              });
        }
        $scope.startover = function() {
              sections = ['demographics', 'diet', 'medical_history', 'medications', 'physical_activity', 'miscellaneous', 'family'];
              previous_section = [];
              final_response = {}
              next_section(sections.shift());
        }
        next_section(sections.shift());
        $rootScope.$on('cfpLoadingBar:completed', function(event){
          console.log(event);
      });

    }])
