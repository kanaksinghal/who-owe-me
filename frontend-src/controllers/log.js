const _ = require('underscore');

module.exports = function($scope, $http, $stateParams, $state) {
	$http.get('/api/entity/log/'+$stateParams['entity'])
		.then(resp => {
			$scope.entity = resp.data;
		})

	$scope.logEntry = {
		date: new Date()
	};

	$scope.saveEntity = function() {
		$scope.logEntry._id = $scope.entity._id;
		$http.post('/api/entity/log', $scope.logEntry)
			.then(resp => {
				$scope.entity = resp.data;
				$scope.logEntry = {};
			}, resp => {
				if(resp.data && resp.data.message)
					$scope.eMsg = resp.data.message;
				else
					$scope.eMsg = "Internal Error!";
			})
	}

	$scope.remove = () => {
		if($scope.entity.total!=0)
			return alert("Can't delete while the outstanding amount is not zero")
		if(!confirm("Are you sure you want to remove the Account?"))
			return;

		$http.delete('/api/entity/'+$scope.entity._id)
			.then(data => {
				$state.go('main');
			}, err => {
				alert("Error occured!");
			})
	}
}