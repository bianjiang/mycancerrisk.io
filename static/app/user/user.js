'use strict';

angular.module('CRCRiskApp.user', ['ngRoute','schemaForm','ui.bootstrap','ngCookies'])

    .controller('UserCtrl', ['$scope','$rootScope', '$http', '$window', '$route','$location', '$uibModal', '$timeout', '$cookies', function($scope, $rootScope, $http, $window,$route,$location,$uibModal,$timeout,$cookies) {

        $scope.response_user={};
        $scope.warning = '';
        $scope.info = '';
        $scope.open = function () {
            console.log('opening pop up');
            var modalScope = $scope.$new();
            var modalInstance = $uibModal.open({
                templateUrl: '../static/app/user/consentform.html',
                controller: 'consentformCtrl',
                scope: modalScope,
                size: 'xl',
                backdrop  : 'static',
                keyboard  : false
            });
            modalScope.modalInstance = modalInstance;
            modalInstance.result.then(function (result) {
            }, null);
        }
        if ($cookies.get('logged_in') != 'true') {
            $location.path('/welcome');
        } else {
            if ($cookies.get('confirm_consent') != 'true') {
                $timeout(function() {
                    angular.element('.consentform_bnt').triggerHandler('click');
                }, 0);
            }
        }
        // $http({
        //     method: 'get',
        //     url: '/checkuser'
        // }).then(function (response) {
        //     if (response.data.message != undefined) {
        //             if (response.data.message['logged_in'] != true) {
        //                 $location.path('/welcome');
        //             }
        //             else {
        //                 if (response.data.message['confirm_consent'] != true) {
        //                     $timeout(function() {
        //                         angular.element('.consentform_bnt').triggerHandler('click');
        //                     }, 0);
        //                 }
        //             }
        //         } else {
        //                $location.path('/welcome');
        //         }
        // },function (error){
        //     console.log(error, '"not login"');
        // });
        $scope.form_user = [
                                        {
                                            "key": "fname",
                                            "placeholder": ""
                                        },
                                        {
                                            "key": "lname",
                                            "placeholder": ""
                                        },
                                        {
                                            "key": "age",
                                            "placeholder": ""
                                        },
                                        {
                                            "key": "email",
                                            "placeholder": "test@gmail.com"
                                        },
                                        {
                                            "type": "submit",
                                            "style": "submit_userinfo_bnt",
                                            "title": "Save and Exit"
                                        }
                                    ];
        $scope.schema_user = {
                                        "type": "object",
                                        "properties": {
                                            "fname": {
                                                "type": "string",
                                                "minLength": 2,
                                                "title": "First Name"
                                            },
                                            "lname": {
                                                "type": "string",
                                                "minLength": 2,
                                                "title": "Last Name"
                                            },
                                            "age": {
                                                "title": "Age",
                                                "type": "number"
                                            },
                                            "email": {
                                                "title": "Email",
                                                "type": "string",
                                                "pattern": "^\\S+@\\S+$",
                                                "description": ''
                                            },
                                            "phone": {
                                                "title": "Phone Number",
                                                "type": "string",
                                                "pattern": "^[0-9]*$"
                                            }
                                        },
                                         "required": [
                                            "fname",
                                            "lname",
                                            "age",
                                            "email"
                                          ]
                                    };
        $http({
            method: 'get',
            url: '/getuserinfo'
        }).then(function (response) {
            if(response.status == 'ERROR') {
                    response.data.message = {'email' : $rootScope.fbemail}
                    $scope.response_user = response.data.message;
                } else {
                    $scope.response_user.email = response.data.email;
                    $scope.response_user.lname = response.data.lname;
                    $scope.response_user.fname = response.data.fname;
                    $scope.response_user.age = response.data.age;
                    $rootScope.confirm_consent = response.data.confirm_consent;
                }
        },function (error){
            console.log(error);
        });
        $scope.submit = function(form) {
            // First we broadcast an event so all fields validate themselves
            $scope.$broadcast('schemaFormValidate');
            // Then we check if the form is valid
            if (form.$valid) {
                $http({
                  method: 'POST',
                  url: '/update',
                  data: {
                      info: $scope.response_user,
                      consentform: $rootScope.confirm_consent
                  }
                  }).then(function(response) {
                      if (response.data.status == "ERROR") {
                        $location.path('#user');
                      } else {
                        $cookies.put('confirm_consent',true);
                        $location.path('#welcome');
                      }
                  }, function(error) {
                      console.log(error);
                  });

            }
        }

     //    console.log(UserData);
}])
    .controller('consentformCtrl', ['$scope','$rootScope','$http', '$cookies', function ($scope,$rootScope,$http,$cookies) {
        $scope.close = function () {
              $scope.modalInstance.close(false);
        };
        $scope.confirm_consent = function () {
              // $http({
              //       method: 'POST',
              //       url: '/confirm_consent',
              //       data: {
              //           info: true
              //       }
              //       }).then(function(response) {
              //         $scope.modalInstance.close(false);
              //          console.log(response.data.message);
              //       }, function(error) {
              //           console.log(error);
              //       });
              $rootScope.confirm_consent = true;
              $scope.modalInstance.close(false);
        };
        if($rootScope.newuser != true) {
            $(function(){
                $(".close_bnt").removeClass('hidden');
            });
        };
}]);