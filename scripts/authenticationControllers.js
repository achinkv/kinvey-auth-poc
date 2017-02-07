var controllers = angular.module('controllers', []);

//Controller handling Login functionality.
controllers.controller('LoginController', ['$scope', '$kinvey', "$location", function($scope, $kinvey, $location) {
    console.log('Inside login controller');
    $scope.login = function() {
      $scope.submittedError = false;
        //validation checks
        var isFormInvalid = false;
        if ($scope.loginForm.email.$error.email || $scope.loginForm.email.$error.required) {
            $scope.submittedEmail = true;
            isFormInvalid = true;
        } else {
            $scope.submittedEmail = false;
        }
        if ($scope.loginForm.password.$error.required) {
            $scope.submittedPassword = true;
            isFormInvalid = true;
        } else {
            $scope.submittedPassword = false;
        }
        if (isFormInvalid) {
            return;
        }

        //kinvey login start here
        var user = new $kinvey.User();
        var promise = user.login({
            username: $scope.username,
            password: $scope.password
        });
        promise.then(function(user) {
             //login success
            $scope.submittedError = false;
            $location.path('/logged_in');
            $scope.$apply();
        }).catch(function(error) {
            $scope.submittedError = true;
            $scope.errorDescription = error.message;
            $scope.$apply();
            console.log("Error login" + error);
        });
    };
    $scope.forgotPassword = function() {
        console.log("forgotPassword");
        $location.path("/reset_password");
    };
    $scope.signUp = function() {
        console.log("signUp");
        $location.path("/sign_up");
    };
}]);

// Controller handling Reset password functionality.
// As of now Kinvey's reset password functionality seems to be flawed because it expects to have an activated user,whereas reset password functionality's basis premise is when user has forgotten password and wants to login.So there is no active user.It works when there is a logged in user.
controllers.controller('ResetPasswordController', ['$q', '$scope', '$kinvey', "$location", function($q, $scope, $kinvey, $location) {
    $scope.resetPassword = function() {
        //validation checks
        if ($scope.resetPasswordForm.email.$error.email || $scope.resetPasswordForm.email.$error.required) {
            $scope.submitted = true;
            return;
        } else {
            $scope.submitted = false;
        }

        var promise = $q(function(resolve) {
            resolve($kinvey.User.getActiveUser());
        });
        promise.then(function(user) {
            if (user) {
                return user.resetPassword();
            }
            console.log(user);
            return user;
        }).then(function() {
            $location.path("/login");
        }).catch(function(error) {
            console.log('error in resetting password');
        });
    };
    $scope.logIn = function() {
        console.log("logIn");
        $location.path("/login");
    };
}]);

//Controller handling Signup functionality.
controllers.controller('SignUpController', ['$scope', '$kinvey', "$location", function($scope, $kinvey, $location) {
    $scope.signUp = function() {
        console.log("signup");
        //validation checks
        var isFormInvalid = false;
        if ($scope.registrationForm.email.$error.email || $scope.registrationForm.email.$error.required) {
            $scope.submittedEmail = true;
            isFormInvalid = true;
        } else {
            $scope.submittedEmail = false;
        }
        if ($scope.registrationForm.password.$error.required) {
            $scope.submittedPassword = true;
            isFormInvalid = true;
        } else {
            $scope.submittedPassword = false;
        }
        if (isFormInvalid) {
            return;
        }
        //registration of user starts here.
        var user = new $kinvey.User();
        var promise = user.signup({
            username: $scope.email,
            password: $scope.password,
            email: $scope.email
        });
        promise.then(function(user) {
            //success scenario
            $scope.submittedError = false;
            console.log("signup success");
            console.log('user>>', user);
            $location.path("/logout");
            $scope.$apply();
        }).catch(function(error) {
            $scope.submittedError = true;
            $scope.errorDescription = error.message;
            $scope.$apply();
            console.log("signup error: " + error.message);
        });
    };
}]);

//Logged in page comes up when user successfully logs in.
controllers.controller('LoggedInController', ['$q', '$scope', '$kinvey', '$location', function($q, $scope, $kinvey, $location) {
    $scope.logout = function() {
        console.log("logout");
        $location.path("/logout");
    };

    $scope.username = $kinvey.User.getActiveUser().username;//sets username to show on the page.

}]);

// Controller for handling logout.
controllers.controller('LogoutController', ['$q', '$scope', '$kinvey', '$location', function($q, $scope, $kinvey, $location) {
    var promise = new $q(function(resolve) {
        resolve($kinvey.User.getActiveUser());//gets active user.
    });
    promise.then(function(user) {
        if (user) {
            console.log('logout');
            return user.logout();
        }
        return user;
    }).then(function(user) {
        $location.path("/login");
    }).catch(function(error) {
        alert("Error logout: " + JSON.stringify(error));
    });

}]);
