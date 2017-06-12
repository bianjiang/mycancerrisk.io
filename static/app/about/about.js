'use strict';

angular.module('CRCRiskApp.about', ['ngRoute', 'ui.bootstrap'])
	.controller('AboutCtrl', ['$scope', '$http', '$location', '$rootScope', function($scope, $http, $location, $rootScope) {
        // check user existence
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
}]);