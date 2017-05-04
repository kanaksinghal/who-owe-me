const path = require('path');
const _ = require('underscore');

module.exports = function ($injector, $localStorage) {
	const API_HOST = "/";
	return {
		request: function(config) {
			if (config.url.startsWith('/api')) {
				config.url = path.join(API_HOST, config.url)
				if($localStorage.user && $localStorage.user.token)
					_.extend(config.headers, {
						authorization: $localStorage.user.token._id,
						id: $localStorage.user._id
					})
			}
			return config;
		},

		requestError: function(config) {
			return config;
		},

		response: function(res) {
			return res;
		},

		responseError: function(res) {
			if(res.config.url.startsWith(API_HOST) && !res.config.url.endsWith('/api/user/logout/') && res.status=="401") {
				// swal((res.data||{}).Message || "Invalid session! Please login again", null, 'warning');
				$injector.get('$state').go('logout');
				return null;
			}
			return res;
		}
	}
}