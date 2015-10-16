var db = null;

angular.module('khatebartar.services', [])

  .service('AppNetwork', ['$ionicPlatform', '$q', function ($ionicPlatform, $q) {
    var Connection = window.Connection || {
      "CELL": "cellular",
      "CELL_2G": "2g",
      "CELL_3G": "3g",
      "CELL_4G": "4g",
      "ETHERNET": "ethernet",
      "NONE": "none",
      "UNKNOWN": "unknown",
      "WIFI": "wifi"
    };

    var asyncGetConnection = function () {
      var q = $q.defer();
      $ionicPlatform.ready(function () {
        if (navigator.connection) {
          q.resolve(navigator.connection);
        } else {
          q.reject('navigator.connection is not defined');
        }
      });
      return q.promise;
    };

    return {
      isOnline: function () {
        return asyncGetConnection().then(function (networkConnection) {
          var isConnected = false;

          switch (networkConnection.type) {
            case Connection.ETHERNET:
            case Connection.WIFI:
            case Connection.CELL_2G:
            case Connection.CELL_3G:
            case Connection.CELL_4G:
            case Connection.CELL:
              isConnected = true;
              break;
          }
          return isConnected;
        });
      }
    };
  }])

  .factory('timestampMarker', [function () {
    var timestampMarker = {
      request: function (config) {
        config.requestTimestamp = new Date().getTime();
        return config;
      },
      response: function (response) {
        response.config.responseTimestamp = new Date().getTime();
        return response;
      }
    };
    return timestampMarker;
  }])

  .factory('Loader', ['$ionicLoading', '$timeout', function ($ionicLoading, $timeout) {

    var LOADERAPI = {

      showLoading: function (text) {
        text = text || '... در حال بارگذاری اطلاعات';
        $ionicLoading.show({
          template: text
        });
      },

      hideLoading: function () {
        $ionicLoading.hide();
      },

      toggleLoadingWithMessage: function (text, timeout) {
        var self = this;

        self.showLoading(text);

        $timeout(function () {
          self.hideLoading();
        }, timeout || 3000);
      }

    };
    return LOADERAPI;
  }])

  .factory('DbSet', function ($http, $cordovaSQLite, $q, $ionicPlatform) {
    var self = this;

    self.query = function (query, parameters) {
      parameters = parameters || [];
      var q = $q.defer();
      $ionicPlatform.ready(function () {
        db = $cordovaSQLite.openDB({ name: "khatebartar.db", bgType: 1 });
        $cordovaSQLite.execute(db, query, parameters)
          .then(function (result) {
            q.resolve(result);
          }, function (error) {
            q.reject(error);
          });
      });
      return q.promise;
    }

    self.init = function () {
      $ionicPlatform.ready(function () {
        db = $cordovaSQLite.openDB({ name: "khatebartar.db", bgType: 1 });
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS category (categories TEXT)");
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS agancy (categoryId INTEGER NOT NULL PRIMARY KEY,lastModified TEXT,agencies TEXT)");
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS news (categoryId INTEGER NOT NULL,lasted INTEGER NOT NULL,lastModified TEXT,title TEXT,list TEXT,PRIMARY KEY ('categoryId', 'lasted' ASC))");
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS agancynews (categoryId INTEGER NOT NULL,siteId INTEGER NOT NULL,siteName TEXT,list TEXT,requestDateTime TEXT,PRIMARY KEY ('categoryId', 'siteId' ASC))");
      });
    };

    self.insertCategory = function () {
      self.db = $cordovaSQLite.openDB({ name: "khatebartar.db", bgType: 1 });
      $http.get('categories.json').success(function (response) {
        var data = JSON.stringify(response);
        var selectQuery = "SELECT categories FROM category limit 1";
        self.query(selectQuery).then(function (result) {
          if (result.rows.length == 0) {
            var insertQuery = "INSERT INTO category (categories) VALUES (?)";
            return self.query(insertQuery, [data]);
          };
        });
      });
    };
    return self;
  })

  .factory('CategoryFactory', function ($cordovaSQLite, DbSet) {
    var self = this;
    self.getCategories = function () {
      return DbSet.query("SELECT categories FROM category")
        .then(function (result) {
          if (result.rows.length > 0) {
            var data = JSON.parse(result.rows.item(0).categories)
            return data;
          }
        });
    }
    return self
  })

  .factory('AgencyFactory', function ($http, $q, $ionicHistory, $state, $cordovaSQLite, DbSet, $cordovaToast, AppNetwork, Loader) {

    function updateAgency(catId, lastModified, data) {
      var query = "INSERT OR REPLACE INTO agancy (categoryId,lastModified,agencies) VALUES (?,?,?)";
      var parameters = [catId, lastModified, data];
      DbSet.query(query, parameters);
    }

    function getOfflineAgencies(catId) {
      Loader.showLoading();
      var data = null;
      return DbSet.query("SELECT categoryId,lastModified,agencies FROM agancy Where categoryId = (?);", [catId])
        .then(function (result) {
          if (result.rows.length > 0) {
            data = result.rows.item(0)
            Loader.hideLoading();
            return data;
          } else {
            Loader.hideLoading();
            return data;
          }
        });
    }

    function getOnlineAgencies(BaseUrl, ApiKey, catId, lastModified) {
      Loader.showLoading('... در حال بروز رسانی اطلاعات');
      var deferred = $q.defer();
      var url = BaseUrl + 'category/site';
      $http({
        url: url,
        method: "POST",
        data: { ApiKey: ApiKey, categoryId: catId },
        timeout: 15000,
        headers: { 'Content-Type': 'application/json;charset=utf-8' }
      }).success(function (data) {
        deferred.resolve(data);
        Loader.hideLoading();
      }).error(function () {
        deferred.reject();
        Loader.hideLoading();
      });
      return deferred.promise;
    }

    return {
      getOfflineAgencies: getOfflineAgencies,
      getOnlineAgencies: getOnlineAgencies,
      updateAgency: updateAgency
    };

  })

  .factory('AgencyNewsFactory', function ($http, $q, $ionicHistory, $state, $cordovaSQLite, DbSet, $cordovaToast, AppNetwork, Loader) {

    function updateAgencyNews(categoryId, siteId, siteName, news, requestDateTime) {
      var insertQuery = "INSERT OR REPLACE INTO agancynews (categoryId,siteId,siteName,list,requestDateTime) VALUES (?,?,?,?,?);";
      var parameters = [categoryId, siteId, siteName, news, requestDateTime];
      DbSet.query(insertQuery, parameters);
    }

    function getOfflineAgencyNews(request) {
      var data = null;
      Loader.showLoading();
      var parameters = [request.categoryId, request.siteId];
      return DbSet.query("SELECT categoryId,siteId,siteName,list,requestDateTime FROM agancynews Where categoryId = (?) AND siteId = (?) limit 1;", parameters)
        .then(function (result) {
          if (result.rows.length > 0 && request.isOnline == false) {
            data = result.rows.item(0);
            Loader.hideLoading();
            return data;
          } else {
            Loader.hideLoading();
            return data;
          }
        });
    }

    function getOnlineAgencyNews(request) {
      Loader.showLoading('... در حال بروز رسانی اطلاعات');
      var deferred = $q.defer();
      $http({
        url: request.BaseUrl,
        method: "POST",
        data: { ApiKey: request.ApiKey, categoryId: request.categoryId, page: request.page, requestDateTime: request.requestDateTime, siteId: request.siteId },
        timeout: 15000,
        headers: { 'Content-Type': 'application/json;charset=utf-8' }
      }).success(function (data) {
        Loader.hideLoading();
        deferred.resolve(data);
      }).error(function () {
        Loader.hideLoading();
        deferred.reject();
      });
      return deferred.promise;
    }

    return {
      getOfflineAgencyNews: getOfflineAgencyNews,
      getOnlineAgencyNews: getOnlineAgencyNews,
      updateAgencyNews: updateAgencyNews
    };
  })

  .factory('KhatebartarNewsFactory', function ($http, $q, DbSet, Loader) {

    function updateNews(categoryId, lasted, lastModified, title, list) {
      var insertQuery = "INSERT OR REPLACE INTO news (categoryId,lasted,lastModified,title,list) VALUES (?,?,?,?,?);";
      var parameters = [categoryId, lasted, lastModified, title, list];
      DbSet.query(insertQuery, parameters);
    };

    function getOfflineNews(categoryId, lasted, isOnline) {
      var data = null;
      Loader.showLoading();
      var parameters = [categoryId, lasted];
      return DbSet.query("SELECT categoryId,lasted,lastModified,title,list FROM news Where categoryId = (?) AND lasted = (?) limit 1;", parameters)
        .then(function (result) {
          if (result.rows.length > 0 && isOnline == false) {
            data = result.rows.item(0);
            Loader.hideLoading();
            return data;
          } else {
            Loader.hideLoading();
            return data;
          }
        });
    }

    function getOnlineNews(BaseUrl, ApiKey, categoryId, lasted) {
      Loader.showLoading('... در حال بروز رسانی اطلاعات');
      var deferred = $q.defer();
      $http({
        url: BaseUrl + "/category/news",
        method: "POST",
        data: { ApiKey: ApiKey, categoryId: categoryId, lasted: lasted },
        timeout: 15000,
        headers: { 'Content-Type': 'application/json;charset=utf-8' }
      }).success(function (data) {
        Loader.hideLoading();
        deferred.resolve(data);
      }).error(function () {
        Loader.hideLoading();
        deferred.reject();
      });
      return deferred.promise;
    }

    return {
      getOfflineNews: getOfflineNews,
      getOnlineNews: getOnlineNews,
      updateNews: updateNews
    };
  })

  .factory('HomeNewsFactory', function ($http, $q, $cordovaToast, DbSet, Loader) {

    function getOnlineNews(request) {
      var deferred = $q.defer();
      Loader.showLoading(request.chacheMessage);
      $http({
        url: request.BaseUrl,
        method: "POST",
        data: { ApiKey: request.ApiKey, suggested: request.suggested, page: request.page, requestDateTime: request.requestDateTime },
        timeout: 15000,
        headers: { 'Content-Type': 'application/json;charset=utf-8' }
      }).success(function (data) {
        Loader.hideLoading();
        deferred.resolve(data);
      }).error(function () {
        Loader.hideLoading();
        deferred.reject();
      });
      return deferred.promise;
    }

    return {
      getOnlineNews: getOnlineNews
    };
  })
;
