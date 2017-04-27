const _ = require('underscore');

module.exports = function($scope, $http, $localStorage, $state) {
	$scope.entities = [];
	$scope.user = $localStorage.user;

	if(!$scope.user)
		return $state.go('logout');

	$http.get('/api/entity/my-list')
		.then(resp => {
			$scope.entities = resp.data;
			$scope.total = _.reduce(resp.data, (a,b) => {
				return {total: (a.total+b.total)}
			}, {total:0}).total;
		})

	$scope.entity = {}

	$scope.saveEntity = function() {
		$http.post('/api/entity/save', $scope.entity)
			.then(resp => {
				$scope.entities.push(resp.data);
				$scope.entity = {};
			}, resp => {
				if(resp.data && resp.data.message)
					$scope.eMsg = resp.data.message;
				else
					$scope.eMsg = "Internal Error!";
			})
	}
}