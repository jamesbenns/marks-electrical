// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.factory('shoppingCart',['$rootScope', function($rootScope){
  return {
    addToCart: function( product ){
          $rootScope.inCart.push(product);
          return true;
    },
    removeFromCart: function( index ){
              $rootScope.inCart.splice(index, 1);
        }
    }
}])

.directive('stars', function() {
  return {
    restrict: 'E',
    scope: {
      customerInfo: '=rating'
    },
    template: function(elem, attr) {
      var fullStars = Math.round(attr.rating);
      var emptyStars = 5 - fullStars;
      var fullIcon = '<i class="icon ion-ios-star"></i>';
      var emptyIcon = '<i class="icon ion-ios-star grey"></i>';
      return fullIcon.repeat(fullStars) + emptyIcon.repeat(emptyStars);
    }
  };
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
    .state('app.home', {
      url: '/home',
      views: {
        'menuContent': {
          templateUrl: 'templates/home.html',
          controller: 'HomeCtrl'
        }
      }
    })

  .state('app.category', {
    url: '/category/:categoryName',
    views: {
      'menuContent': {
        templateUrl: 'templates/category.html',
        controller: 'CategoryCtrl'
      }
    }
  })

  .state('app.finder', {
    url: '/finder/:categories',
    views: {
      'menuContent': {
        templateUrl: 'templates/finder.html',
        controller: 'FinderCtrl'
      }
    }
  })

  .state('app.product', {
    url: '/product/:product',
    views: {
      'menuContent': {
        templateUrl: 'templates/product.html',
        controller: 'ProductCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
