const angular = require('angular');
const _ = require('underscore');

require('angular-animate');
require('angular-aria');
require('angular-ui-router');
require('ngstorage');

import 'bootstrap/dist/css/bootstrap.css';
import './main.scss';

angular.module('app', [
	'ui.router',
	'ngStorage'
])
.run(function () {

})
.config(($httpProvider, $locationProvider, $urlRouterProvider, $stateProvider) => {
	// $locationProvider.html5Mode(true);

	$urlRouterProvider.otherwise("/");

	const routes = require("./routes");

	_.mapObject(routes, (stateObj, stateName) => {
		$stateProvider.state(stateName, stateObj)
	})

	$httpProvider.interceptors.push(require('./httpInterceptor'));
})