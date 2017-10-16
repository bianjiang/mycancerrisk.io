'use strict';

angular.module('CRCRiskApp.user', ['ngRoute','schemaForm','ui.bootstrap'])

    .controller('UserCtrl', ['$scope','$rootScope', '$http', '$window', '$route','$location', '$uibModal', '$timeout',function($scope, $rootScope, $http, $window,$route,$location,$uibModal,$timeout) {

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
        $http.get("/checkuser")
            .success(function (response) {
              if (response.message != undefined) {
                console.log(response.message)
                if (response.message['status'] == 'newuser') {
                    $rootScope.newuser = true;
                    $timeout(function() {
                        angular.element(document.querySelector('.consentform_bnt')).click();
                    }, 0);
                } else {
                   $rootScope.newuser = false;
                }
              }
            }).error(function(error) {
              console.log("not login");
            });
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
        $http.get("/getuserinfo")
            .success(function (response) {
                if(response.status == 'ERROR') {
                    response.message = {'email' : $rootScope.fbemail}
                    $scope.response_user = response.message;
                } else {
                    $scope.response_user = response;
                }
                // if($scope.response_user['email'] != undefined) {
                //     $http({
                //       method: 'POST',
                //       url: '/checkemail',
                //       data: {
                //           info: $scope.response_user['email']
                //       }
                //       }).then(function(response) {
                //           $scope.warning = response.data.message;
                //           console.log($scope.warning);
                //           $scope.schema_user = {
                //                         "type": "object",
                //                         "properties": {
                //                             "fname": {
                //                                 "type": "string",
                //                                 "minLength": 2,
                //                                 "title": "First Name"
                //                             },
                //                             "lname": {
                //                                 "type": "string",
                //                                 "minLength": 2,
                //                                 "title": "Last Name"
                //                             },
                //                             "age": {
                //                                 "title": "Age",
                //                                 "type": "number"
                //                             },
                //                             "email": {
                //                                 "title": "Email",
                //                                 "type": "string",
                //                                 "pattern": "^\\S+@\\S+$",
                //                                 "description": $scope.warning
                //                             },
                //                             "phone": {
                //                                 "title": "Phone Number",
                //                                 "type": "string",
                //                                 "pattern": "^[0-9]*$"
                //                             }
                //                         },
                //                          "required": [
                //                             "fname",
                //                             "lname",
                //                             "age",
                //                             "email"
                //                           ]
                //                     };
                //           // $scope.schema_user['properties']['email']['description'] = $scope.warning;
                //           $(function(){
                //               $("#precheck").removeClass('hidden');
                //             });
                //       }, function(error) {
                //           console.log(error);
                //       });
                // }
            }).error(function(error) {
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
                      info: $scope.response_user
                  }
                  }).then(function(response) {
                      // $scope.info = response.data.message;
                      console.log(response.data.message);
                  }, function(error) {
                      console.log(error);
                  });
                $location.path('#welcome')
                // $http({
                //     method: 'POST',
                //     url: '/checkemail',
                //     data: {
                //         info: $scope.response_user['email']
                //     }
                //     }).then(function(response) {
                //         $scope.warning = response.data.message;
                //         $scope.schema_user['properties']['email']['description'] = $scope.warning;
                //         console.log($scope.schema_user)
                //         // $(function(){
                //         //     $("#my-div").removeClass('hidden');
                //         // });
                //         // $route.reload();
                //         $location.path('#welcome')
                //     }, function(error) {
                //         console.log(error);
                //     });
            }
        }

     //    console.log(UserData);
}])
    .controller('consentformCtrl', ['$scope','$rootScope','$http', function ($scope,$rootScope,$http) {
        $scope.close = function () {
              $scope.modalInstance.dismiss('cancel');
        };
        $scope.confirm_consent = function () {
              $http({
                    method: 'POST',
                    url: '/confirm_consent',
                    data: {
                        info: true
                    }
                    }).then(function(response) {
                      $scope.modalInstance.dismiss('cancel');
                       console.log(response.data.message);
                    }, function(error) {
                        console.log(error);
                    });
        };
        if($rootScope.newuser != true) {
            $(function(){
                $(".close_bnt").removeClass('hidden');
            });
        };
}]);