module.exports ={
	main: {
		url: "/",
		template: require("./templates/user.html"),
		controller: require("./controllers/user")
	},
	log: {
		url: "/log/{entity:[0-9a-fA-F]{24}}",
		template: require("./templates/log.html"),
		controller: require("./controllers/log")
	},
	login: {
		url: "/login",
		template: require("./templates/login.html"),
		controller: require("./controllers/login")
	},
	logout: {
		url: "/logout",
		template: "Loading...",
		controller: function($state, $localStorage, $http, $timeout) {
			$http.get('/api/user/logout/');
			$state.go('login');
			$timeout(() => {
				delete $localStorage.user;
			})
		}
	}
}