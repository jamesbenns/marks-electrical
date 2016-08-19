angular.module('starter.controllers', ['rzModule'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $location, $window, $state) {

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

  $scope.setCategory = function (object, url) {

    if (object) {

      var jsonString = JSON.stringify(object);
      var base64 = btoa(jsonString);
      $state.go('app.finder', { 'categories': base64 });
      $window.scrollTo(0,0)

    } if (!object) {
      console.log(url);
      $state.go('app.category', { 'categoryName': url });

    }

  };

  $scope.setProduct = function (object) {

      var jsonString = JSON.stringify(object);
      var base64 = btoa(jsonString);
      $state.go('app.product', { 'product': base64 });
      $window.scrollTo(0,0)

  };


  $scope.isEnabled = function() {
    if ($state.current.name == "app.home") {
      return true
    } else {
      return false
    }
  }

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

.controller('HomeCtrl', function($scope, $http, $rootScope) {

	$http.get('http://markselectrical.co.uk/categories?api=').success(function(data) {
      $scope.categories = data.categories;
	});

})

.controller('MenuCtrl', function($scope, $http, $state, $rootScope, shoppingCart) {

  $rootScope.inCart = [];

  $scope.changeQuantity = function(direction, index) {
    if (direction == "up") {
      $rootScope.inCart[index].quantity++
    }
    if (direction == "down" && $rootScope.inCart[index].quantity > 1) {
      $rootScope.inCart[index].quantity--
    }
  }

  // $scope.cartQuantity = function() {
  //   var quantity = 0;
  //   for (var i = 0; i < $rootScope.inCart.length ; i++) {
  //       quantity += $rootScope.inCart[i].quantity;
  //       console.log($rootScope.inCart)
  //   }
  //   return quantity;
  // }

  $scope.cartTotal = function() {
    var total = 0;
    for (var i = 0; i < $rootScope.inCart.length ; i++) {
        total += $rootScope.inCart[i].price * $rootScope.inCart[i].quantity
    }
    return total;
  }

  $scope.removeItem = function (productId) {
    shoppingCart.removeFromCart(productId);
  }

	$scope.showCategories = false;
	$scope.show = [];

	$scope.toggle2 = function (id) {
		$scope.show[id] = !$scope.show[id]
	}

	$scope.toggle = function () {
		$scope.showCategories = !$scope.showCategories;
	}

	$http.get('categories.json').success(function(data) {
	    $scope.categories = data.categories;
	});

})

.controller('CategoryCtrl', function($scope, $stateParams, $http) {

  $scope.price = {
    maxPrice: 16998,
    minPrice: 151,
    upperRange: 10000,
    lowerRange: 200
  }

  var category = $stateParams.categoryName;
  console.log($stateParams);

  $scope.order = {"order":["price", "price", "rating"], "sort": "0"};

  $scope.location = function() {
    return $stateParams;
  }

  $scope.price = {};

  $http.get('http://markselectrical.co.uk/' + category + '?api').success(function(data) {

      console.log(data);

      $scope.products = data.items;

      var minPrice = Infinity;
      var maxPrice = 0;

      for (var i = $scope.products.length - 1; i >= 0; i--) {
        if ($scope.products[i].price > maxPrice) {
          maxPrice = $scope.products[i].price;
        };
        if ($scope.products[i].price < minPrice) {
          minPrice = $scope.products[i].price;
        }
      };

      $scope.minRangeSlider = {
          minValue: Math.floor(minPrice),
          maxValue: Math.ceil(maxPrice),
          options: {
              floor: Math.floor(minPrice),
              ceil: Math.ceil(maxPrice),
              step: 1,
              translate: function(value) {
                return '£' + value;
              }
          }
      };

      $scope.init = true;

  });

})

.controller('FinderCtrl', function($scope, $rootScope, $stateParams, $http) {

  var toString = atob($stateParams.categories);
  $scope.categories = JSON.parse(toString);

})

.controller('ProductCtrl', function($scope, $stateParams, $http, shoppingCart, $ionicSideMenuDelegate, $ionicSlideBoxDelegate, $rootScope) {

  var toString = atob($stateParams.product);
  console.log(toString);
  $scope.product = JSON.parse(toString);
  console.log($scope.product);
  $ionicSlideBoxDelegate.update()

  $scope.addToCart = function(product) {
    var addFields = product;
    addFields.quantity = 1;
    addFields.index = $rootScope.inCart.length;
    shoppingCart.addToCart(addFields);
    $ionicSideMenuDelegate.toggleRight();
    $scope.$digest
  }

  $scope.checkCart = function(productId) {
    for (var i = 0; i < $rootScope.inCart.length ; i++) {
        if ($rootScope.inCart[i].id == productId) {
          return true;
        }
    }
  }

  $scope.tab = 1;

  $scope.title = function() {
    return $stateParams.productName;
  }

  $http.get('http://markselectrical.co.uk/' + $scope.product.url + '?api').success(function(data) {
      $scope.productData = data;
      console.log(data)
  });

});
