var app = angular.module('userman', ['kinvey', 'ngRoute', 'controllers']);
var kinveyCredentialsObj = {
    host: '',//kinvey host url
    appKey: '',//key for the app registered on kinvey.
    appSecret: ''//app secret for the registered app.
}
//Routing.
app.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
    $routeProvider.
    when('/login', {
        templateUrl: 'templates/login.html',
        controller: 'LoginController'
    }).
    when('/logout', {
        template: '',
        controller: 'LogoutController'
    }).
    when('/reset_password', {
        templateUrl: 'templates/reset_password.html',
        controller: 'ResetPasswordController'
    }).
    when('/sign_up', {
        templateUrl: 'templates/sign_up.html',
        controller: 'SignUpController'
    }).
    when('/logged_in', {
        templateUrl: 'templates/logged_in.html',
        controller: 'LoggedInController'
    }).
    otherwise({
        redirectTo: '/login'
    });
}]);

app.run(['$location', '$kinvey', function($location, $kinvey) {
    //initializing kinvey
    $kinvey.init(kinveyCredentialsObj);
    //ping kinvey to verify setup
    var promise = $kinvey.ping();
    promise.then(function(response) {
        console.log('Kinvey Ping Success. Kinvey Service is alive, version: ' + response.version + ', response: ' + response.kinvey);
    }, function(error) {
        console.log('Kinvey Ping Failed. Response: ' + error);
    });
}]);
