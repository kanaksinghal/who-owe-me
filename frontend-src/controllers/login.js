module.exports = function($scope, $http, $localStorage, $state) {
	$scope.user={};

	$scope.login = function() {
		$http.post('/api/user/login', $scope.user)
			.then(res => {
				if(res.status == 500)
					throw res;
				$localStorage.user = res.data;
				$state.go('main');
			})
			.catch(err => {
				console.log(err)
				alert(err.data.data.message || "Internal Error!")
			})
	}
}