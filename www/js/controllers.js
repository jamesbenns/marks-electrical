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
  $scope.home = {search:"", results:{}};

	$http.get('http://markselectrical.co.uk/categories?api=').success(function(data) {
      $scope.categories = data.categories;
      console.log(data.categories)
	});

  $scope.searchFunc = function(){
    $http.get('http://markselectrical.co.uk/search?api=&keyword=' + $scope.home.search).success(function(data) {
        $scope.home.results = data.items;
        console.log($scope.home.results);
        $scope.loading = false;
    });
    $scope.loading = true;
  };

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

.controller('CategoryCtrl', function($scope, $stateParams, $ionicPopup, $http) {

  var category = $stateParams.categoryName;

  var pageNumber = 1;

  $scope.products = [];

  $scope.more = true;

  var maxPrice = 0;

  var minPrice = Infinity;

  $scope.order = 'popular-order-asc';

  $scope.orderChange = function(){
    $scope.more = true;
    pageNumber = 1;
    $scope.products = [];
    console.log('watch order' + $scope.order)
    $scope.loadMore()    
  };

  $http.get('http://markselectrical.co.uk/' + category + '?api').success(function (data) {
    
    $scope.numberOfItems = data.meta.totalNumItems;

    $scope.minRangeSlider = {
        minValue: Math.floor(data.meta.pricemin),
        maxValue: Math.ceil(data.meta.pricemax),
        options: {
            floor: Math.floor(data.meta.pricemin),
            ceil: Math.ceil(data.meta.pricemax),
            step: 1,
            translate: function(price) {
              return '£' + price;
            }
        }
    };

    $scope.loadMore = function() {

      var url = 'http://markselectrical.co.uk/' + category + '-' + 'page-' + pageNumber + '-sort-' + $scope.order + '-' + 'show-12A' + '?api';

      console.log(url);

      if ($scope.products.length < $scope.numberOfItems) {

          console.log("load more called");
          
          // Load the data from Marks Electrical api. 
          $http.get(url).success(function (data) {
            console.log(data);
            angular.forEach(data.items, function (value, key) {

              $scope.products.push(value);

            });

          })
          
          .error (function (data, status, headers) {
            
            // Disable infinite scroll since we've got an error.
            $scope.more = false;        
              
              // Otherwise show general alert.
              $ionicPopup.alert({
                title: 'Sorry, there has been an error',
                template: 'Please try again later.'
              });

          })
          
          .finally(function () {
            
            console.log('finally');
            pageNumber++;
            $scope.init = true;
            $scope.$broadcast('scroll.infiniteScrollComplete');

          });

      } else {

        // Otherwise show general alert.
        $ionicPopup.alert({
          title: 'No More Products',
          template: 'You reached the bottom of the list!'
        });

        $scope.more = false;
      }

    };

  });

  $scope.location = function() {
    return $stateParams;
  }

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
  $ionicSlideBoxDelegate.update();

  $scope.addToCart = function(product) {
    var addFields = product;
    addFields.quantity = 1;
    addFields.index = $rootScope.inCart.length;
    shoppingCart.addToCart(addFields);
    $ionicSideMenuDelegate.toggleRight();
    $scope.$digest;
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
     
      $scope.productData = data[0].images;
      $scope.summary = data[0].summary;
      $scope.description = data[0].description;
      $ionicSlideBoxDelegate.update();
      $scope.productId = data[0].url.split('_')[0];

      $http.get('http://api.bazaarvoice.com/data/reviews.json?apiversion=5.4&passkey=caGNjXYwRCUrhX5c9VuHRgl7vgc4GPmGZYWqgxvKUxtPA&Filter=ProductId:' + $scope.productId + '&Sort=SubmissionTime:desc&Include=Products&Stats=Reviews&Limit=10').success(function(data) {
          $scope.reviewData = data.Results;
          $scope.rating = data.Includes.Products[$scope.productId].ReviewStatistics.AverageOverallRating
          console.log($scope.reviewData);
      });

  });

});
