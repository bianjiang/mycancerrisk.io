'use strict';

angular.module('CRCRiskApp.welcome', ['ngRoute', 'ui.bootstrap', 'ngCookies'])
    .controller('welcomeCtrl', ['$scope', '$http', '$location', '$rootScope', '$uibModal', '$window', '$route', '$interval','$cookies', function($scope, $http, $location, $rootScope, $uibModal,$window,$route, $interval, $cookies) {

        // $cookies.put('test', 1)
        if ($cookies.get('logged_in') != 'true') {
            // console.log($cookies.get('logged_in'))
            $http({
                method: 'get',
                url: '/checkuser'
            }).then(function (response) {
                // console.log(response.data)
                if (response.data.message != undefined) {
                        console.log(response.data.message )
                        if (response.data.message['logged_in'] == true) {
                            $cookies.put('logged_in', true);
                            $cookies.put('status', response.data.message['status']);
                            $cookies.put('confirm_consent', response.data.message['confirm_consent']);
                            $scope.button = 'Take Test';
                            $(".welcome-bnt").attr("href", "#!/risk");
                            if (response.data.message['status'] == 'newuser') {
                                if (response.data.message['email'] != 'none') {
                                    $rootScope.fbemail = response.data.message['email'];
                                }
                                $location.path('/user');
                            }
                        } else {
                            $scope.button = 'Login';
                            $cookies.remove('logged_in');
                            $cookies.remove('status');
                            $cookies.remove('confirm_consent');
                        }
                    }
            },function (error){
                console.log(error, '"not login"');
            });
        } else {
            // console.log($cookies.get('confirm_consent'))
            if ($cookies.get('confirm_consent') != 'true') {
                $location.path('/user')
            }
            $scope.button = 'Take Test';
            $(".welcome-bnt").attr("href", "#!/risk");
            $(".welcome-bnt").css("margin-left", "31%");
        }

}]);