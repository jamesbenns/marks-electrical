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
    if ($state.current.name == "app.home" || $state.current.name == "app.browse" || $state.current.name == "app.track") {
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

.controller('HomeCtrl', function($scope, $http, $rootScope, $window) {
  $scope.home = {search:"", results:{}};

  $http.get('http://markselectrical.co.uk/categories?api=').success(function(data) {
      $scope.categories = data.categories;
  });

  $scope.promoClick = function(type, url){
    if(type == "page"){
      var URL = "http://markselectrical.co.uk/" + url;
      window.open(URL, "_blank", "location=no")
    }
    if (type == "category") {
      window.alert("category")
    };
  }

  $http.get('http://markselectrical.co.uk/?api=').success(function(data) {
      $rootScope.promotions = data.promotions;
  });

  $scope.searchFunc = function(){
    $http.get('http://markselectrical.co.uk/search?api=&keyword=' + $scope.home.search).success(function(data) {
        $scope.home.results = data.items;
        $scope.loading = false;
    });
    $scope.loading = true;
  };

})


.controller('TrackCtrl', function($scope, $http, $rootScope) {

  $scope.order = {};

  $scope.go = function(){
    $http.get('http://services.markselectrical.co.uk/services/remote/getorder?orderno=' + $scope.order.no).success(function(data) {
       $scope.orderDetails = data;
    });
  }

})

.controller('ContactCtrl', function($scope, $ionicHistory, $compile) {

      var map;
      (function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 52.6518702, lng: -1.1788397},
          zoom: 12
        });

        //Marker + infowindow + angularjs compiled ng-click
        var contentString1 = "<div><b>Our Showroom</b><br>LE3 5QG</div>";
        var compiled1 = $compile(contentString1)($scope);

        var infowindow1 = new google.maps.InfoWindow({
          content: compiled1[0]
        });

        var contentString2 = "<div><b>Head Office<br>Click&Collect</b><br>LE3 1TU</div>";
        var compiled2 = $compile(contentString2)($scope);

        var infowindow2 = new google.maps.InfoWindow({
          content: compiled2[0]
        });

        var showroom = new google.maps.Marker({
          position: {lat: 52.6343498, lng: -1.1504682},
          map: map,
          title: 'Uluru (Ayers Rock)'
        });

        google.maps.event.addListener(showroom, 'click', function() {
          infowindow1.open(map,showroom);
        });

        var office = new google.maps.Marker({
          position: {lat: 52.6327138, lng: -1.210706},
          map: map,
          title: 'Uluru (Ayers Rock)'
        });

        google.maps.event.addListener(office, 'click', function() {
          infowindow2.open(map,office);
        });

        infowindow1.open(map,showroom);
        infowindow2.open(map,office);

      }())

})

.controller('MenuCtrl', function($scope, $http, $state, $rootScope, shoppingCart, $ionicModal) {

  $rootScope.inCart = [];

  $ionicModal.fromTemplateUrl('templates/checkout.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.checkoutModal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeCheckoutModal = function() {
    $scope.checkoutModal.hide();
  };

  $scope.checkout = function(){
    shoppingCart.checkoutCart();
    $scope.checkoutModal.show();
  };

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

  $scope.list = {};

  $scope.list.order = 'popular-order-asc';

  $scope.orderChange = function(){
    $scope.more = true;
    pageNumber = 1;
    $scope.products = [];
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

      var url = 'http://markselectrical.co.uk/' + category + '-' + 'page-' + pageNumber + '-sort-' + $scope.list.order + '-' + 'show-12A' + '?api';
  
      console.log(url);
      console.log($scope.order);

      if ($scope.products.length < $scope.numberOfItems) {

          
          // Load the data from Marks Electrical api. 
          $http.get(url).success(function (data) {
            angular.forEach(data.items, function (value, key) {

              $http.get("http://api.bazaarvoice.com/data/statistics.json?apiversion=5.4&passkey=caGNjXYwRCUrhX5c9VuHRgl7vgc4GPmGZYWqgxvKUxtPA&filter=productid:" + value.url.split('_')[0] +"&stats=Reviews,NativeReviews").success(function (data) {
                if (data.TotalResults) {
                
                value.rating = data.Results[0].ProductStatistics.ReviewStatistics.AverageOverallRating;
                value.numberOfReviews = data.Results[0].ProductStatistics.ReviewStatistics.TotalReviewCount;

                };

              })

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
            
            pageNumber++;
            $scope.init = true;
            $scope.$broadcast('scroll.infiniteScrollComplete');

          });

      } else {

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
      $scope.productData = data[0].images.slice(1,6);
      $scope.summary = data[0].summary;
      $scope.description = data[0].description;
      $ionicSlideBoxDelegate.update();
      $scope.productId = data[0].url.split('_')[0];

      $http.get('http://api.bazaarvoice.com/data/reviews.json?apiversion=5.4&passkey=caGNjXYwRCUrhX5c9VuHRgl7vgc4GPmGZYWqgxvKUxtPA&Filter=ProductId:' + $scope.productId + '&Sort=SubmissionTime:desc&Include=Products&Stats=Reviews&Limit=10').success(function(data) {
          $scope.reviewData = data.Results;
          $scope.rating = data.Includes.Products[$scope.productId].ReviewStatistics.AverageOverallRating
      });

  });

});
