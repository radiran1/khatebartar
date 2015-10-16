angular.module("khatebartar.views", []).run(["$templateCache", function($templateCache) {$templateCache.put("views/app/agancy-news.html","<ion-view class=\"agancy-news-view\">\r\n  <ion-nav-title>\r\n    <span>{{staticTitle}} {{siteName}}</span>\r\n  </ion-nav-title>\r\n  <ion-content>\r\n\r\n    <ion-refresher pulling-text=\"بکشید و رها کنید...\" on-refresh=\"loadNewerNews()\">\r\n    </ion-refresher>\r\n\r\n    <div class=\"entries-list\">\r\n      <div ng-show=\"news.length\" ng-repeat=\"n in news\" class=\"list card entry-item\" ng-click=\"getNews(n.id)\">\r\n        <div class=\"news-heading item item-text-wrap\">\r\n          <h2 class=\"news-title\" ng-bind-html=\"n.title | rawHtml\"></h2>\r\n          <p class=\"news-date\" ng-show=\"isShowDate\">\r\n            تاریخ انتشار : <span>{{n.date}}</span>\r\n          </p>\r\n        </div>\r\n        <div class=\"news-content item item-text-wrap\">\r\n          <p class=\"news-excerpt\" dynamic-anchor-fix ng-bind-html=\"n.abstract | rawHtml\"></p>\r\n          <div class=\"news-actions row\">\r\n            <div class=\"read-more col col-center\" dynamic-anchor-fix>\r\n              <a class=\"button button-small button-block button-assertive\" ui-sref=\"app.news({newsId: n.id})\">\r\n                ادامه مطلب\r\n              </a>\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </ion-content>\r\n</ion-view>");
$templateCache.put("views/app/agencies.html","<ion-view class=\"agencies-view\">\n  <ion-nav-title>\n    <span> گروه {{categoryName}}</span>\n  </ion-nav-title>\n  <ion-content>\n    <ion-list class=\"agencies\">\n      <a class=\"item item-icon-left\" href=\"#/app/khatebartar-news/{{categoryId}}/1\">\n        <div class=\"thumbnail-outer\">\n          <pre-img ratio=\"_1_1\" helper-class=\"\">\n            <img class=\"thumbnail\" ng-cache ng-src=\"img/ionic.png\" spinner-on-load>\n          </pre-img>\n        </div>\n        <div>\n          <span class=\"title\">آخرین عناوین {{categoryName}}</span>\n        </div>\n        <i class=\"icon ion-arrow-left-c\"></i>\n      </a>\n      <a class=\"item item-icon-left\" ui-sref=\"app.khatebartar-news({categoryId: categoryId, lasted:0})\">\n        <div class=\"thumbnail-outer\">\n          <pre-img ratio=\"_1_1\" helper-class=\"\">\n            <img class=\"thumbnail\" ng-cache ng-src=\"img/ionic.png\" spinner-on-load>\n          </pre-img>\n        </div>\n        <div>\n          <span class=\"title\">اخبار برگزیده {{categoryName}}</span>\n        </div>\n        <i class=\"icon ion-arrow-left-c\"></i>\n      </a>\n    </ion-list>\n    <div class=\"list agencies\">\n      <a ng-repeat=\"agancy in agencies\" class=\"item item-icon-left\" ui-sref=\"app.agancy-news({categoryId: agancy.categoryId, siteId:agancy.id})\">\n        <div class=\"thumbnail-outer\">\n          <pre-img ratio=\"_1_1\" helper-class=\"\">\n            <img class=\"thumbnail\" ng-cache ng-src=\"img/ionic.png\" spinner-on-load>\n          </pre-img>\n        </div>\n        <div>\n          <span class=\"title\">{{agancy.persianName}}</span>\n          <!--<p class=\"description\">{{agancy.siteName}}</p>-->\n        </div>\n        <i class=\"icon ion-arrow-left-c\"></i>\n      </a>\n    </div>\n  </ion-content>\n</ion-view>");
$templateCache.put("views/app/home.html","<ion-view class=\"categories-view\">\n  <ion-nav-buttons side=\"right\">\n    <button menu-toggle=\"right\" class=\"button button-icon icon ion-navicon\"></button>\n  </ion-nav-buttons>\n  <ion-nav-title>\n    <span>دسته های خبری</span>\n  </ion-nav-title>\n  <ion-content>\n    <div class=\"row categories-list\">\n      <div class=\"col col-50\">\n        <a class=\"category\" ui-sref=\"app.latest-news({suggested:\'false\'})\">\n          <pre-img ratio=\"_1_1\" helper-class=\"square-image\">\n            <img class=\"category-image\" ng-cache ng-src=\"img/news.jpg\" spinner-on-load>\n          </pre-img>\n          <div class=\"category-bg\"></div>\n          <span class=\"category-title\"> اخبار برگزیده</span>\n        </a>\n      </div>\n      <div class=\"col col-50\">\n        <a class=\"category\" ui-sref=\"app.suggested-news({suggested:\'true\'})\">\n          <pre-img ratio=\"_1_1\" helper-class=\"square-image\">\n            <img class=\"category-image\" ng-cache ng-src=\"img/suggested-news.jpg\" spinner-on-load>\n          </pre-img>\n          <div class=\"category-bg\"></div>\n          <span class=\"category-title\">پیشنهاد خط برتر </span>\n        </a>\n      </div>\n      <div class=\"col col-50\">\n        <a class=\"category\" ui-sref=\"app.agencies({categoryId:\'1\',categoryname:\'سیاست\'})\">\n          <pre-img ratio=\"_1_1\" helper-class=\"square-image\">\n            <img class=\"category-image\" ng-cache ng-src=\"img/politics.jpg\" spinner-on-load>\n          </pre-img>\n          <div class=\"category-bg\"></div>\n          <span class=\"category-title\">سیاست </span>\n        </a>\n      </div>\n      <div class=\"col col-50\">\n        <a class=\"category\" ui-sref=\"app.agencies({categoryId:\'3\',categoryname:\'ورزش\'})\">\n          <pre-img ratio=\"_1_1\" helper-class=\"square-image\">\n            <img class=\"category-image\" ng-cache ng-src=\"img/sports.jpg\" spinner-on-load>\n          </pre-img>\n          <div class=\"category-bg\"></div>\n          <span class=\"category-title\">ورزش </span>\n        </a>\n      </div>\n      <div class=\"col col-50\">\n        <a class=\"category\" ui-sref=\"app.agencies({categoryId:\'5\',categoryname:\'دانش و فناوری اطلاعات\'})\">\n          <pre-img ratio=\"_1_1\" helper-class=\"square-image\">\n            <img class=\"category-image\" ng-cache ng-src=\"img/technology.jpg\" spinner-on-load>\n          </pre-img>\n          <div class=\"category-bg\"></div>\n          <span class=\"category-title\">دانش و فناوری اطلاعات </span>\n        </a>\n      </div>\n      <div class=\"col col-50\">\n        <a class=\"category\" ui-sref=\"app.agencies({categoryId:\'6\',categoryname:\'سلامت\'})\">\n          <pre-img ratio=\"_1_1\" helper-class=\"square-image\">\n            <img class=\"category-image\" ng-cache ng-src=\"img/health.png\" spinner-on-load>\n          </pre-img>\n          <div class=\"category-bg\"></div>\n          <span class=\"category-title\">سلامت </span>\n        </a>\n      </div>\n      <div class=\"col col-50\">\n        <a class=\"category\" ui-sref=\"app.agencies({categoryId:\'4\',categoryname:\'فرهنگ و هنر\'})\">\n          <pre-img ratio=\"_1_1\" helper-class=\"square-image\">\n            <img class=\"category-image\" ng-cache ng-src=\"img/entertainment.jpg\" spinner-on-load>\n          </pre-img>\n          <div class=\"category-bg\"></div>\n          <span class=\"category-title\">فرهنگ و هنر </span>\n        </a>\n      </div>\n      <div class=\"col col-50\">\n        <a class=\"category\" ui-sref=\"app.agencies({categoryId:\'2\',categoryname:\'اقتصاد\'})\">\n          <pre-img ratio=\"_1_1\" helper-class=\"square-image\">\n            <img class=\"category-image\" ng-cache ng-src=\"img/business.jpg\" spinner-on-load>\n          </pre-img>\n          <div class=\"category-bg\"></div>\n          <span class=\"category-title\">اقتصاد </span>\n        </a>\n      </div>\n\n    </div>\n  </ion-content>\n</ion-view>");
$templateCache.put("views/app/khatebartar-news.html","<ion-view class=\"agancy-news-view\">\r\n  <ion-nav-title>\r\n    <span>{{title}}</span>\r\n  </ion-nav-title>\r\n  <ion-content>\r\n\r\n    <ion-refresher pulling-text=\"بکشید و رها کنید...\" on-refresh=\"loadNewerNews()\">\r\n    </ion-refresher>\r\n\r\n    <div class=\"entries-list\">\r\n      <div ng-show=\"news.length\" ng-repeat=\"n in news\" class=\"list card entry-item\" ng-click=\"getNews(n.id)\">\r\n        <div class=\"news-heading item item-text-wrap\">\r\n          <h2 class=\"news-title\" ng-bind-html=\"n.title | rawHtml\"></h2>\r\n          <p class=\"news-date\" ng-show=\"isShowDate\">\r\n            تاریخ انتشار : <span>{{n.date}}</span>\r\n          </p>\r\n          <p class=\"news-date\">\r\n            منبع : <span>{{n.site}}</span>\r\n          </p>\r\n        </div>\r\n        <div class=\"news-content item item-text-wrap\">\r\n          <p class=\"news-excerpt\" dynamic-anchor-fix ng-bind-html=\"n.abstract | rawHtml\"></p>\r\n          <div class=\"news-actions row\">\r\n            <div class=\"read-more col col-center\" dynamic-anchor-fix>\r\n              <a class=\"button button-small button-block button-assertive\" ui-sref=\"app.news({newsId: n.id})\">\r\n               ادامه مطلب {{n.site}}\r\n              </a>\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </ion-content>\r\n</ion-view>");
$templateCache.put("views/app/latest-news.html","<ion-view cache-view=\"false\" class=\"agancy-news-view\">\r\n  <ion-nav-title>\r\n    <span>اخبار برگزیده</span>\r\n  </ion-nav-title>\r\n  <ion-content>\r\n\r\n    <ion-refresher ng-if=\"newerCanBeLoaded()\" pulling-text=\"بکشید و رها کنید...\" on-refresh=\"loadNewerNews()\">\r\n    </ion-refresher>\r\n\r\n    <div class=\"entries-list\">\r\n      <div ng-show=\"news.length\" ng-repeat=\"n in news\" class=\"list card entry-item\" ng-click=\"getNews(n.id)\">\r\n        <div class=\"news-heading item item-text-wrap\">\r\n          <h2 class=\"news-title\" ng-bind-html=\"n.title | rawHtml\"></h2>\r\n          <p class=\"news-date\" ng-show=\"isShowDate\">\r\n            تاریخ انتشار : <span>{{n.date}}</span>\r\n          </p>\r\n          <p class=\"news-date\">\r\n            منبع : <span>{{n.site}}</span>\r\n          </p>\r\n        </div>\r\n        <div class=\"news-content item item-text-wrap\">\r\n          <p class=\"news-excerpt\" dynamic-anchor-fix ng-bind-html=\"n.abstract | rawHtml\"></p>\r\n          <div class=\"news-actions row\">\r\n            <div class=\"read-more col col-center\" dynamic-anchor-fix>\r\n              <a class=\"button button-small button-block button-assertive\" ui-sref=\"app.news({newsId: n.id})\">\r\n                ادامه مطلب {{n.site}}\r\n              </a>\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n    <ion-infinite-scroll ng-if=\"moreDataCanBeLoaded()\" on-infinite=\"loadOlderNews()\" distance=\"1%\"></ion-infinite-scroll>\r\n  </ion-content>\r\n</ion-view>");
$templateCache.put("views/app/news.html","<ion-view class=\"news-view\">\n  <ion-nav-title>\n    <span></span>\n  </ion-nav-title>\n  <ion-content scroll=\"true\" overflow-scroll=\"true\" class=\"iframe-wrapper\">\n    <iframe data-tap-disabled=\"true\" ng-src=\"{{link | trusted}}\"></iframe>\n  </ion-content>\n</ion-view>");
$templateCache.put("views/app/newspaper.html","<ion-view class=\"news-view\">\r\n  <ion-nav-title>\r\n    <span></span>\r\n  </ion-nav-title>\r\n  <ion-content scroll=\"true\" overflow-scroll=\"true\" class=\"iframe-wrapper\">\r\n    <iframe data-tap-disabled=\"true\" ng-src=\"{{link | trusted}}\"></iframe>\r\n  </ion-content>\r\n</ion-view>");
$templateCache.put("views/app/side-menu.html","<ion-side-menus enable-menu-with-back-views=\"false\">\n  <ion-side-menu-content class=\"post-size-14px\">\n    <ion-nav-bar class=\"bar app-top-bar\">\n      <ion-nav-back-button class=\"button-clear\">\n        <i class=\"icon ion-chevron-left\"></i><img ng-src=\"img/favicon32.png\">\n      </ion-nav-back-button>\n      <ion-nav-buttons side=\"right\">\n        <button class=\"button button-icon button-clear ion-navicon\" menu-toggle=\"right\">\n        </button>\n      </ion-nav-buttons>\n    </ion-nav-bar>\n    <ion-nav-view name=\"menuContent\"></ion-nav-view>\n  </ion-side-menu-content>\n\n  <ion-side-menu side=\"right\" class=\"main-menu\" expose-aside-when=\"large\">\n    <ion-content>\n      <ion-list>\n        <ion-item class=\"heading-item item item-avatar\" nav-clear menu-close ui-sref=\"app.home\">\n          <h2 class=\"greeting\">خط برتر</h2>\n          <p class=\"message\">دیدبان خبری شما</p>\n          <div class=\"user-image-container\">\n            <pre-img ratio=\"_1_1\" helper-class=\"rounded-image\">\n              <img class=\"user-image\" ng-cache ng-src=\"img/ionic.png\" spinner-on-load>\n            </pre-img>\n          </div>\n        </ion-item>\n        <ion-item class=\"item-icon-right\" nav-clear menu-close ui-sref=\"app.newspaper\">\n          <i class=\"icon ion-asterisk\"></i>\n          <h2 class=\"menu-text\">روزنامه های امروز</h2>\n        </ion-item>\n      </ion-list>\n      <ion-list ng-repeat=\"category in categories\">\n        <ion-item class=\"item-icon-right\" nav-clear menu-close ui-sref=\"app.agencies({categoryId:category.id,categoryname:category.persianName})\">\n          <i class=\"icon ion-asterisk\"></i>\n          <h2 class=\"menu-text\">{{category.persianName}}</h2>\n        </ion-item>\n    </ion-content>\n  </ion-side-menu>\n</ion-side-menus>");
$templateCache.put("views/app/suggested-news.html","<ion-view cache-view=\"false\" class=\"agancy-news-view\">\r\n  <ion-nav-title>\r\n    <span>پیشنهاد خط برتر </span>\r\n  </ion-nav-title>\r\n  <ion-content>\r\n\r\n    <ion-refresher ng-if=\"newerCanBeLoaded()\" pulling-text=\"بکشید و رها کنید...\" on-refresh=\"loadNewerNews()\">\r\n    </ion-refresher>\r\n\r\n    <div class=\"entries-list\">\r\n      <div ng-show=\"news.length\" ng-repeat=\"n in news\" class=\"list card entry-item\" ng-click=\"getNews(n.id)\">\r\n        <div class=\"news-heading item item-text-wrap\">\r\n          <h2 class=\"news-title\" ng-bind-html=\"n.title | rawHtml\"></h2>\r\n          <p class=\"news-date\" ng-show=\"isShowDate\">\r\n            تاریخ انتشار : <span>{{n.date}}</span>\r\n          </p>\r\n          <p class=\"news-date\">\r\n            منبع : <span>{{n.site}}</span>\r\n          </p>\r\n        </div>\r\n        <div class=\"news-content item item-text-wrap\">\r\n          <p class=\"news-excerpt\" dynamic-anchor-fix ng-bind-html=\"n.abstract | rawHtml\"></p>\r\n          <div class=\"news-actions row\">\r\n            <div class=\"read-more col col-center\" dynamic-anchor-fix>\r\n              <a class=\"button button-small button-block button-assertive\" ui-sref=\"app.news({newsId: n.id})\">\r\n                ادامه مطلب {{n.site}}\r\n              </a>\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n    <ion-infinite-scroll ng-if=\"moreDataCanBeLoaded()\" on-infinite=\"loadOlderNews()\" distance=\"1%\"></ion-infinite-scroll>\r\n  </ion-content>\r\n</ion-view>");
$templateCache.put("views/common/multi-bg.html","<div class=\"multi-bg-outer\" ng-class=\"{ \'finish-loading\': loaded }\">\n	<img bg class=\"multi-bg {{ helperClass }}\" ng-src=\"{{ bg_img }}\"/>\n	<span class=\"bg-overlay\"></span>\n	<ion-spinner ng-show=\"!loaded\" class=\"spinner-on-load\"></ion-spinner>\n	<!-- <span ng-show=\"!loaded\" class=\"spinner-on-load ion-load-c\"></span> -->\n	<ng-transclude></ng-transclude>\n</div>\n");
$templateCache.put("views/common/my-tab.html","<div class=\"tab-content ng-cloak ng-hide\" ng-cloak ng-show=\"selected\" ng-transclude></div>\n");
$templateCache.put("views/common/my-tabs.html","<div class=\"item item-divider card-heding\">\n	<div class=\"tabs-striped\">\n		<div class=\"tabs\">\n			<a ng-repeat=\"tab in tabs\" ng-click=\"select(tab)\" ng-class=\"{ active: tab.selected }\" class=\"tab-item\">{{tab.title}}</a>\n		</div>\n	</div>\n</div>\n<div class=\"item item-body\">\n	<div class=\"tabs-content\" ng-transclude></div>\n</div>\n");
$templateCache.put("views/common/pre-img.html","<div class=\"pre-img {{ratio}} {{ helperClass }}\" ng-class=\"{ \'finish-loading\': loaded }\">\n	<ion-spinner ng-show=\"!loaded\" class=\"spinner-on-load\"></ion-spinner>\n	<!-- <span ng-show=\"!loaded\" class=\"spinner-on-load ion-load-c\"></span> -->\n	<ng-transclude></ng-transclude>\n</div>\n");}]);