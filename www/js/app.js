
angular.module('khatebartar', [
  'ionic',
  'khatebartar.controllers',
  'khatebartar.directives',
  'khatebartar.filters',
  'khatebartar.services',
  'khatebartar.config',
  'khatebartar.views',
  'ngCordova',
  'ngSanitize',
  "angular-data.DSCacheFactory"
])

  .run(function ($ionicPlatform, $rootScope, $ionicConfig, $timeout, DbSet, DSCacheFactory) {

    $ionicPlatform.on("deviceready", function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
      DbSet.init();
      DbSet.insertCategory();
    });

    $rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
      if (toState.name.indexOf('app.home') > -1) {
        // Restore platform default transition. We are just hardcoding android transitions to auth views.
        $ionicConfig.views.transition('platform');
        // If it's ios, then enable swipe back again
        if (ionic.Platform.isIOS()) {
          $ionicConfig.views.swipeBackEnabled(true);
        }
        console.log("enabling swipe back and restoring transition to platform default", $ionicConfig.views.transition());
      }
    });

    DSCacheFactory("suggestedNewsCache", { storageMode: "localStorage", maxAge: 900000, deleteOnExpire: "aggressive" });
    DSCacheFactory("latestNewsCache", { storageMode: "localStorage", maxAge: 600000, deleteOnExpire: "aggressive" });

    $ionicPlatform.on("resume", function () {
    });

  })

  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $stateProvider


    
    //MAIN
      .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "views/app/side-menu.html",
        controller: 'AppCtrl'
      })

    //NEWS
      .state('app.home', {
        url: "/home",
        views: {
          'menuContent': {
            templateUrl: "views/app/home.html",
            controller: 'HomeCtrl'
          }
        }
      })

      .state('app.agencies', {
        url: "/agencies/:categoryId/:categoryname",
        views: {
          'menuContent': {
            templateUrl: "views/app/agencies.html",
            controller: 'AgenciesCtrl'
          }
        }
      })

      .state('app.agancy-news', {
        url: "/agancy-news/:categoryId/:siteId",
        views: {
          'menuContent': {
            templateUrl: "views/app/agancy-news.html",
            controller: 'AgancyNewsCtrl'
          }
        }
      })

      .state('app.khatebartar-news', {
        url: "/khatebartar-news/:categoryId/:lasted",
        views: {
          'menuContent': {
            templateUrl: "views/app/khatebartar-news.html",
            controller: 'KhatebartarNewsCtrl'
          }
        }
      })

      .state('app.suggested-news', {
        url: "/suggested-news/:suggested",
        views: {
          'menuContent': {
            templateUrl: "views/app/suggested-news.html",
            controller: 'HomeNewsCtrl'
          }
        }
      })

      .state('app.latest-news', {
        url: "/latest-news/:suggested",
        views: {
          'menuContent': {
            templateUrl: "views/app/latest-news.html",
            controller: 'HomeNewsCtrl'
          }
        }
      })

      .state('app.news', {
        url: "/news/:newsId",
        views: {
          'menuContent': {
            templateUrl: "views/app/news.html",
            controller: 'NewsCtrl'
          }
        }
      })
      .state('app.newspaper', {
        url: "/newspaper",
        views: {
          'menuContent': {
            templateUrl: "views/app/newspaper.html",
            controller: 'NewsPaperCtrl'
          }
        }
      });

    $urlRouterProvider.otherwise('/app/home');
    // $ionicConfigProvider.views.maxCache(5);
    $ionicConfigProvider.views.forwardCache(true);
    $ionicConfigProvider.platform.ios.navBar.alignTitle('left');
    $ionicConfigProvider.backButton.text('').icon('ion-chevron-left').previousTitleText(false);
  })
