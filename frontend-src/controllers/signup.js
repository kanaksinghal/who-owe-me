module.exports = function($scope, $http, $localStorage, $state) {
	$scope.user={};

	$scope.signup = function() {
		$http.post('/api/user/register', {user:$scope.user})
			.then(res => {
				if(res.status == 500)
					throw res;
				$localStorage.user = res.data;
				$state.go('main');
			})
			.catch(err => {
				alert(err.data.data.message || "Internal Error!")
			})
	}
}