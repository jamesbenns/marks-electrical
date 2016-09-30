// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'angularMoment'])

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
          console.log($rootScope.inCart);
          return true;
    },
    removeFromCart: function( index ){
          $rootScope.inCart.splice(index, 1);
    },
    checkoutCart: function(){
      var line = [];
      var id = 0;

      for (i = 0; i < $rootScope.inCart.length; i++) { 
          var object = {"type": "item"};
          object.id = id;
          object.qty = $rootScope.inCart[i].quantity;
          object.total = $rootScope.inCart[i].price;
          object.price = $rootScope.inCart[i].quantity * $rootScope.inCart[i].price;
          object.item = {};
          object.item.name = $rootScope.inCart[i].name;
          object.item.sku = $rootScope.inCart[i].url.split('_')[0];
          object.item.price = $rootScope.inCart[i].price;
          object.item.image = $rootScope.inCart[i].images[0];
          object.item.url = $rootScope.inCart[i].url + ".html";
          object.addons = {
                            "warranty": {
                              "item": {
                                "sku": "5YRE23DW2",
                                "name": "5YRE23DW2 5 Year warranty 2+3 year Dishwasher",
                                "price": "124.37",
                                "url": "http://new.markselectrical.co.uk:8081/5YRE23DW2_5-Year-warranty-2%252B3-year-Dishwasher.html",
                                "image": "https://s3-eu-west-1.amazonaws.com/media.markselectrical.co.uk/item-images/bigthumb/_notfound.png"
                              }
                            },
                            "service": [
                              {
                                "item": {
                                  "sku": "OLDPRODCOL",
                                  "name": "Recycle Product Recycle Product",
                                  "price": "14.99",
                                  "url": "http://new.markselectrical.co.uk:8081/OLDPRODCOL_Recycle-Product.html",
                                  "image": "https://s3-eu-west-1.amazonaws.com/media.markselectrical.co.uk/item-images/bigthumb/_notfound.png"
                                }
                              },
                              {
                                "item": {
                                  "sku": "UNWRAP",
                                  "name": "Unbranded Recycle Packaging Recycle Packaging",
                                  "price": "4.99",
                                  "url": "http://new.markselectrical.co.uk:8081/UNWRAP_Unbranded-Recycle-Packaging.html",
                                  "image": "https://s3-eu-west-1.amazonaws.com/media.markselectrical.co.uk/item-images/bigthumb/_notfound.png"
                                },
                                "added": "1"
                              }
                            ]
                          };
            line.push(object);
          id++
      };

      var cartObject = {
                          "basket": {
                            "summary": {
                              "num": $rootScope.inCart.length,
                              "total": (function() {
                                                      var total = 0;
                                                      for (var i = 0; i < $rootScope.inCart.length ; i++) {
                                                          total += $rootScope.inCart[i].price * $rootScope.inCart[i].quantity
                                                      }
                                                      return total;
                                                    })()
                            },
                            "finance": {
                              "minimum": "278",
                              "available": "1",
                              "product": "Classic Credit 36 Months 15.9%",
                              "repayment": "86.39"
                            },
                            "lines": {
                              "line": line
                            }
                          }
                        }
        $rootScope.cartObj = cartObject;
        }
    }
}])

.directive('stars', function() {
    return {
        restrict: 'E',
        scope: {
            rating: '=',
            type: '='
        },
        link: function(scope, elem, attr) {

            scope.$watch('rating', function(){

                var fullStars = Math.round(scope.rating);
                var emptyStars = 5 - fullStars;
                var fullIcon = '<i class="icon ion-ios-star"></i>';
                var emptyIcon = '<i class="icon ion-ios-star grey"></i>';
                var templateString = fullIcon.repeat(fullStars) + emptyIcon.repeat(emptyStars);
                elem.html(templateString);

            });
            
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

  .state('app.track', {
    url: '/track',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html',
        controller: 'TrackCtrl'
      }
    }
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
          templateUrl: 'templates/browse.html',
          controller: 'ContactCtrl'
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
