angular.module('khatebartar.filters', [])

  .filter('rawHtml', function ($sce) {
    return function (val) {
      return $sce.trustAsHtml(val);
    };
  })

  .filter('parseDate', function () {
    return function (value) {
      return Date.parse(value);
    };
  })
  .filter('trusted', ['$sce', function ($sce) {
    return function (url) {
      return $sce.trustAsResourceUrl(url);
    };
  }]);
;
