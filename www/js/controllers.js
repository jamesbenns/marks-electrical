angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('IndexCtrl', function($scope, $http) {

	$http.get('content.json').success(function(data) {
	    $scope.categories = data.categories;
	    console.log(data)
	});

	$http.get('slides.json').success(function(data) {
	    $scope.slides = data.slides;
	    console.log(data)
	});


})

.controller('MenuCtrl', function($scope, $http) {

	$scope.showCategories = false;
	$scope.show = [];

	$scope.toggle2 = function (id) {
		$scope.show[id] = !$scope.show[id]
	}

	$scope.toggle = function () {
		$scope.showCategories = !$scope.showCategories;
	}

	$http.get('content.json').success(function(data) {
	    $scope.categories = data.categories;
	    console.log(data)
	});

})

.controller('PlaylistCtrl', function($scope, $stateParams, $location, $http) {
	$scope.category = function() {
		return $location.hash()
	}

  $http.get('products.json').success(function(data) {
      $scope.products = data.products;
  });

});
