angular.module('khatebartar.controllers', [])

	.controller('AppCtrl', function ($http, $scope, CategoryFactory, $cordovaToast, AppNetwork) {

		AppNetwork.isOnline().then(function (isConnected) {
			if (isConnected == false) {
				$cordovaToast.showLongCenter('اشکال در ارتباط با اینترنت');
			}
		}).catch(function (err) {
			$cordovaToast.showLongCenter(err);
		});

		$scope.selected_tab = "";
		$scope.categories = [];
		$scope.$on('my-tabs-changed', function (event, data) {
			$scope.selected_tab = data.title;
		});

		CategoryFactory.getCategories()
			.then(function (data) {
				if (typeof data === "undefined") {
					$http.get('categories.json').success(function (response) {
						$scope.categories = response;
					});
				} else {
					$scope.categories = data;
				}

			});
	})

	.controller('HomeCtrl', function ($scope) {

	})

	.controller('AgenciesCtrl', function ($scope, $state, $stateParams, $ionicHistory, AgencyFactory, BaseUrl, ApiKey, $cordovaToast, AppNetwork, Loader) {
		var now = new Date();
		var now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
		var catId = Number($stateParams.categoryId);
		var categoryname = $stateParams.categoryname;
		$scope.categoryId = catId;
		$scope.categoryName = categoryname;
		$scope.agencies = [];

		AgencyFactory.getOfflineAgencies(catId).then(function (data) {
			if (data != null) {
				var insertDate = new Date(data.lastModified).getUTCDate() + 1;
				if (insertDate >= now.getUTCDate()) {
					$scope.agencies = JSON.parse(data.agencies);
				} else if (insertDate < now.getUTCDate()) {
					AppNetwork.isOnline().then(function (isConnected) {
						if (isConnected == false) {
							$cordovaToast.showLongCenter('اشکال در ارتباط با اینترنت , لطفا تنظیمات اینترنت خود را چک کنید.');
							$scope.agencies = JSON.parse(data.agencies);
						} else {
							Loader.showLoading("....در حال بروز رسانی اخبار جدید");
							AgencyFactory.getOnlineAgencies(BaseUrl, ApiKey, catId, now_utc.toString()).then(function (data) {
								$scope.agencies = data;
								AgencyFactory.updateAgency(catId, now_utc.toString(), JSON.stringify(data));
								Loader.hideLoading();
							}, function () {
								$cordovaToast.showLongCenter('اشکال در بروز رسانی اخبار جدید , لطفا تنظیمات اینترنت خود را چک کنید.');
								$scope.agencies = JSON.parse(data.agencies);
							});
						}
					}).catch(function (err) {
						Loader.hideLoading();
						Loader.toggleLoadingWithMessage(err.message);
					});

				}
			} else if (data == null) {
				AppNetwork.isOnline().then(function (isConnected) {
					if (isConnected == false) {
						$cordovaToast.showLongCenter('اشکال در ارتباط با اینترنت , لطفا تنظیمات اینترنت خود را چک کنید.');
						Loader.hideLoading();
						$ionicHistory.clearCache().then(
							function () {
								$ionicHistory.goBack();
							});
					} else {
						Loader.showLoading("....در حال بارگذاری اطلاعات ");
						AgencyFactory.getOnlineAgencies(BaseUrl, ApiKey, catId, now_utc.toString()).then(function (data) {
							$scope.agencies = data;
							AgencyFactory.updateAgency(catId, now_utc.toString(), JSON.stringify(data));
							Loader.hideLoading();
						}, function () {
							$cordovaToast.showLongCenter('اشکال در ارتباط با سرور , لطفا تنظیمات اینترنت خود را چک کنید.');
							$ionicHistory.clearCache().then(
								function () {
									$ionicHistory.goBack();
								});
						});
					}
				}).catch(function (err) {
					Loader.hideLoading();
					Loader.toggleLoadingWithMessage(err.message);
				});

			}
		}, function (msg) {
			alert(msg);
		});
	})

	.controller('AgancyNewsCtrl', function ($scope, $state, $stateParams, $http, $ionicHistory, AgencyNewsFactory, $q, BaseUrl, ApiKey, $cordovaToast, AppNetwork, Loader) {
		var currentDate = new Date();
		var now = new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate(), currentDate.getUTCHours(), currentDate.getUTCMinutes(), currentDate.getUTCSeconds());
		$scope.news = [];
		var siteId = Number($stateParams.siteId);
		var categoryId = Number($stateParams.categoryId);
		var categoryname = $stateParams.categoryname;
		$scope.categoryName = categoryname;
		$scope.requestDateTime;
		$scope.staticTitle = "اخبار و مطالب ";
		$scope.isShowDate = true;

		var request = {
			BaseUrl: BaseUrl + 'news/sitecategory',
			ApiKey: ApiKey,
			categoryId: categoryId,
			page: 1,
			requestDateTime: $scope.requestDateTime,
			siteId: siteId,
			isOnline: false
		};

		AgencyNewsFactory.getOfflineAgencyNews(request).then(function (data) {
			if (data != null) {
				var requestDateTime = new Date(data.requestDateTime);
				var insertDate = new Date(requestDateTime.getUTCFullYear(), requestDateTime.getUTCMonth(), requestDateTime.getUTCDate(), requestDateTime.getUTCHours(), (requestDateTime.getUTCMinutes() + 20), requestDateTime.getUTCSeconds());

				var diffMs = (currentDate - requestDateTime);
				var diffHrs = Math.round((diffMs % 86400000) / 3600000);
				var hour = 1;
				if (diffHrs == 0) {
					hour = 1;
				} else {
					hour = diffHrs;
				}
				if (insertDate >= now) {
					$scope.news = JSON.parse(data.list);
					$scope.requestDateTime = data.requestDateTime;
					$scope.siteName = data.siteName;
				} else if (insertDate < now) {
					AppNetwork.isOnline().then(function (isConnected) {
						if (isConnected == false) {
							$cordovaToast.showLongCenter('اشکال در بروز رسانی اخبار ،' + hour + 'ساعت از آخرین بروز رسانی شما می گذرد , لطفا تنظیمات اینترنت خود را چک کنید .');
							$scope.news = JSON.parse(data.list);
							$scope.requestDateTime = data.requestDateTime;
							$scope.siteName = data.siteName;
							$scope.isShowDate = false;
							Loader.hideLoading();
						} else {
							Loader.showLoading("....در حال بروز رسانی اخبار جدید");
							AgencyNewsFactory.getOnlineAgencyNews(request).then(function (data) {
								$scope.news = data.list;
								$scope.requestDateTime = data.requestDateTime;
								$scope.siteName = data.siteName;
								AgencyNewsFactory.updateAgencyNews(request.categoryId, request.siteId, data.siteName, JSON.stringify(data.list), data.requestDateTime);
								Loader.hideLoading();
							}, function () {
								$cordovaToast.showLongCenter('اشکال در بروز رسانی اخبار جدید , لطفا تنظیمات اینترنت خود را چک کنید.');
								$scope.news = JSON.parse(data.list);
								$scope.requestDateTime = data.requestDateTime;
								$scope.siteName = data.siteName;
							});
						}
					}).catch(function (err) {
						Loader.hideLoading();
						Loader.toggleLoadingWithMessage(err.message);
					});

				}
			} else if (data == null) {
				AppNetwork.isOnline().then(function (isConnected) {
					if (isConnected == false) {
						$cordovaToast.showLongCenter('اشکال در ارتباط با اینترنت , لطفا تنظیمات اینترنت خود را چک کنید.');
						Loader.hideLoading();
						$ionicHistory.clearCache().then(
							function () {
								$ionicHistory.goBack();
							});
					} else {
						Loader.showLoading("....در حال بارگذاری اطلاعات ");
						AgencyNewsFactory.getOnlineAgencyNews(request).then(function (data) {
							$scope.news = data.list;
							$scope.requestDateTime = data.requestDateTime;
							$scope.siteName = data.siteName;
							AgencyNewsFactory.updateAgencyNews(request.categoryId, request.siteId, data.siteName, JSON.stringify(data.list), data.requestDateTime);
							Loader.hideLoading();
						}, function () {
							$cordovaToast.showLongCenter('اشکال در ارتباط با سرور , لطفا تنظیمات اینترنت خود را چک کنید.');
							$ionicHistory.clearCache().then(
								function () {
									$ionicHistory.goBack();
								});
							
							// $ionicHistory.clearCache();
							// $ionicHistory.clearHistory();
							// var parameters = { categoryId: categoryId, categoryname: categoryname };
							// $state.go('app.agencies', parameters);
						});
					}
				}).catch(function (err) {
					Loader.hideLoading();
					Loader.toggleLoadingWithMessage(err.message);
				});
			}
		}, function (msg) {
			alert(msg);
		});

		function loadNews(request, callback) {
			AgencyNewsFactory.getOnlineAgencyNews(request).then(function (data) {
				var response = [];
				response = data;
				callback(response);
			}, function () {
				$cordovaToast.showLongCenter('اشکال در ارتباط با سرور , لطفا تنظیمات اینترنت خود را چک کنید.');
				$scope.$broadcast('scroll.refreshComplete');
			});
		}

		$scope.loadNewerNews = function () {

			AppNetwork.isOnline().then(function (isConnected) {
				if (isConnected == false) {
					$cordovaToast.showLongCenter('اشکال در ارتباط با اینترنت , لطفا تنظیمات اینترنت خود را چک کنید.');
					$scope.$broadcast('scroll.refreshComplete');
				} else {

					request.isOnline = true;
					loadNews(request, function (newerNews) {
						$scope.news = newerNews.list;
						$scope.requestDateTime = newerNews.requestDateTime;
						$scope.siteName = newerNews.siteName;
						AgencyNewsFactory.updateAgencyNews(request.categoryId, request.siteId, newerNews.siteName, JSON.stringify(newerNews.list), newerNews.requestDateTime);
						$scope.$broadcast('scroll.refreshComplete');
						$cordovaToast.showLongCenter('اطلاعات با موفقیت بروز رسانی شد.')
					});
				}
			}).catch(function (err) {
				Loader.hideLoading();
				Loader.toggleLoadingWithMessage(err.message);
			});

		};

		$scope.getNews = function (newsId) {
			$state.go('app.news', { 'newsId': newsId });
		}
	})

	.controller('KhatebartarNewsCtrl', function ($scope, $state, $stateParams, $http, $ionicHistory, KhatebartarNewsFactory, $cordovaNetwork, $q, BaseUrl, ApiKey, $cordovaToast, Loader) {
		var currentDate = new Date();
		var now = new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate(), currentDate.getUTCHours(), currentDate.getUTCMinutes(), currentDate.getUTCSeconds());
		var categoryId = Number($stateParams.categoryId);
		var lasted = Number($stateParams.lasted);
		$scope.categoryId = categoryId;
		$scope.isShowDate = true;
		var isOnline = false;
		$scope.news = [];

		function loadNews(BaseUrl, ApiKey, categoryId, lasted, isOnline, callback) {
			Loader.showLoading("....در حال بروز رسانی اخبار جدید");
			KhatebartarNewsFactory.getOnlineNews(BaseUrl, ApiKey, categoryId, lasted, isOnline).then(function (data) {
				var response = [];
				response = data;
				callback(response);
			}, function () {
				$cordovaToast.showLongCenter('اشکال در ارتباط با سرور , لطفا تنظیمات اینترنت خود را چک کنید.');
				$scope.$broadcast('scroll.refreshComplete');
			});
		}

		KhatebartarNewsFactory.getOfflineNews(categoryId, lasted, isOnline).then(function (data) {
			if (data != null) {
				var requestDateTime = new Date(data.lastModified);
				requestDateTime.setMinutes(requestDateTime.getMinutes() + 2);
				var diffMs = (currentDate - requestDateTime);
				var diffHrs = Math.round((diffMs % 86400000) / 3600000);
				var hour = 1;
				if (diffHrs == 0) {
					hour = 1;
				} else {
					hour = diffHrs;
				}
				if (requestDateTime >= now) {
					$scope.news = JSON.parse(data.list);
					$scope.title = data.title;
				} else if (requestDateTime < now) {
					if ($cordovaNetwork.isOnline()) {

						KhatebartarNewsFactory.getOnlineNews(BaseUrl, ApiKey, categoryId, lasted).then(function (data) {
							$scope.news = data.list;
							$scope.title = data.title;
							KhatebartarNewsFactory.updateNews(categoryId, lasted, now.toString(), data.title, JSON.stringify(data.list));
							Loader.hideLoading();
						}, function () {
							$cordovaToast.showLongCenter('اشکال در بروز رسانی اخبار ،' + hour + 'ساعت از آخرین بروز رسانی شما می گذرد , لطفا تنظیمات اینترنت خود را چک کنید .');
							$scope.news = JSON.parse(data.list);
							$scope.title = data.title;
							$scope.isShowDate = false;
							Loader.hideLoading();
						});

					} else {
						$cordovaToast.showLongCenter('اشکال در بروز رسانی اخبار ،' + hour + 'ساعت از آخرین بروز رسانی شما می گذرد , لطفا تنظیمات اینترنت خود را چک کنید .');
						$scope.news = JSON.parse(data.list);
						$scope.title = data.title;
						$scope.isShowDate = false;
						Loader.hideLoading();
					}
				}
			} else if (data == null) {
				if ($cordovaNetwork.isOnline()) {
					Loader.showLoading("....در حال بارگذاری اطلاعات ");
					KhatebartarNewsFactory.getOnlineNews(BaseUrl, ApiKey, categoryId, lasted).then(function (data) {
						$scope.news = data.list;
						$scope.title = data.title;
						KhatebartarNewsFactory.updateNews(categoryId, lasted, now.toString(), data.title, JSON.stringify(data.list));
						Loader.hideLoading();
					}, function () {
						$cordovaToast.showLongCenter('اشکال در ارتباط با سرور , لطفا تنظیمات اینترنت خود را چک کنید.');
						$ionicHistory.clearCache().then(
							function () {
								$ionicHistory.goBack();
							});
					});

				} else {
					$cordovaToast.showLongCenter('اشکال در ارتباط با اینترنت , لطفا تنظیمات اینترنت خود را چک کنید.');
					Loader.hideLoading();
					$ionicHistory.clearCache().then(
						function () {
							$ionicHistory.goBack();
						});
				}
			}
		}, function (msg) {
			$cordovaToast.showLongCenter('اشکال در ارتباط با اینترنت , لطفا تنظیمات اینترنت خود را چک کنید.');
			Loader.hideLoading();
			$ionicHistory.clearCache().then(
				function () {
					$ionicHistory.goBack();
				});
		});

		$scope.loadNewerNews = function () {
			if ($cordovaNetwork.isOnline()) {
				isOnline = true;
				loadNews(BaseUrl, ApiKey, categoryId, lasted, isOnline, function (data) {
					$scope.news = data.list;
					$scope.title = data.title;
					KhatebartarNewsFactory.updateNews(categoryId, lasted, now.toString(), data.title, JSON.stringify(data.list));
					Loader.hideLoading();
					$scope.isShowDate = true;
					$scope.$broadcast('scroll.refreshComplete');
					$cordovaToast.showLongCenter('اطلاعات با موفقیت بروز رسانی شد.');
				});
			} else {
				$cordovaToast.showLongCenter('اشکال در ارتباط با سرور , لطفا تنظیمات اینترنت خود را چک کنید.');
				$scope.isShowDate = false;
				$scope.$broadcast('scroll.refreshComplete');
			};
		};

		$scope.getNews = function (newsId) {
			$state.go('app.news', { 'newsId': newsId });
		};
	})

	.controller('HomeNewsCtrl', function ($scope, $state, $stateParams, $cordovaToast, $ionicHistory, $cordovaNetwork, DSCacheFactory, BaseUrl, ApiKey, HomeNewsFactory, Loader) {
		var suggested = $stateParams.suggested;
		var chacheName = "";
		var cacheKey = "";
		var chacheMessage = "";
		if (suggested == 'true') {
			chacheName = DSCacheFactory.get("suggestedNewsCache");
			cacheKey = "suggested";
			chacheMessage = "...در حال بروز رسانی اخبار پیشنهاد خط برتر";
		} else {
			chacheName = DSCacheFactory.get("latestNewsCache");
			cacheKey = "latested";
			chacheMessage = "...در حال بروز رسانی اخبار برگزیده";
		};

		function offlineData() {
            var offlineData = chacheName.get(cacheKey);
            return offlineData;
        };

		if (offlineData()) {
			$scope.news = chacheName.get(cacheKey);
		} else {
			$scope.news = [];
		};
		function persist() {
			chacheName.put(cacheKey, $scope.news);
		}

		$scope.isShowDate = true;
		$scope.page = 1;
		var currentDate = new Date();
		$scope.requestDateTime = new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate(), currentDate.getUTCHours(), currentDate.getUTCMinutes(), currentDate.getUTCSeconds());
		var request = {
			BaseUrl: BaseUrl + 'news/home',
			ApiKey: ApiKey,
			suggested: suggested,
			page: $scope.page,
			chacheMessage: chacheMessage,
			requestDateTime: $scope.requestDateTime
		};

		chacheName.setOptions({
			onExpire: function (key, value) {
				request.page = 1;
				$scope.page = 1;
				HomeNewsFactory.getOnlineNews(request)
					.then(function (data) {
						$scope.news = data.list;
						$scope.page += 1;
						request.page = $scope.page;
						persist();
					}, function () {
						$cordovaToast.showLongCenter('اشکال در ارتباط با اینترنت , لطفا تنظیمات اینترنت خود را چک کنید.');
						$scope.isShowDate = false;
						Loader.hideLoading();
						chacheName.put(key, value);
					});
			}
		});

		if ($cordovaNetwork.isOnline()) {
			$scope.loadNewerNews = function () {
				request.page = 1;
				$scope.page = 1;
				HomeNewsFactory.getOnlineNews(request)
					.then(function (data) {
						$scope.news = data.list;
						$scope.page += 1;
						request.page = $scope.page;
						persist();
					}, function () {
						$cordovaToast.showLongCenter('اشکال در ارتباط با اینترنت , لطفا تنظیمات اینترنت خود را چک کنید.');
						$scope.isShowDate = false;
						Loader.hideLoading();
						persist();
					}).finally(function () {
						$scope.$broadcast('scroll.refreshComplete');
					});

			};

			$scope.loadOlderNews = function () {
				HomeNewsFactory.getOnlineNews(request)
					.then(function (data) {
						$scope.news = $scope.news.concat(data.list);
						$scope.page += 1;
						request.page = $scope.page;
						persist();
					}, function () {
						$cordovaToast.showLongCenter('اشکال در ارتباط با اینترنت , لطفا تنظیمات اینترنت خود را چک کنید.');
						$scope.isShowDate = false;
						Loader.hideLoading();
						persist();
					}).finally(function () {
						$scope.$broadcast('scroll.infiniteScrollComplete');
					});
			};

		} else {
			if (offlineData()) {
				$cordovaToast.showLongCenter('اشکال در ارتباط با اینترنت , لطفا تنظیمات اینترنت خود را چک کنید.');
				$scope.isShowDate = false;
				Loader.hideLoading();
				persist();
			} else {
				$cordovaToast.showLongCenter('اشکال در ارتباط با اینترنت , لطفا تنظیمات اینترنت خود را چک کنید.');
				$scope.isShowDate = false;
				Loader.hideLoading();
				$ionicHistory.clearCache().then(
					function () {
						$ionicHistory.goBack();
					});
			}

		}


		$scope.getNews = function (newsId) {
			$state.go('app.news', { 'newsId': newsId });
		}

		$scope.newerCanBeLoaded = function () {
			if ($cordovaNetwork.isOnline()) {
				return true;

			} else {
				return false;
			}
		};

		$scope.moreDataCanBeLoaded = function () {
			if ($cordovaNetwork.isOnline()) {
				return $scope.page < 10;

			} else {
				return false;
			}
		};
	})

	.controller('NewsCtrl', function ($scope, $stateParams, $cordovaToast, AppNetwork, $ionicHistory, $cordovaNetwork) {
		if ($cordovaNetwork.isOnline()) {
			var id = Number($stateParams.newsId);
			$scope.link = "http://www.khatebartar.com/mobile/" + id;
		} else {
			$cordovaToast.showShortCenter('برای مشاهده متن خبر باید به اینترنت متصل باشید.');
			$ionicHistory.clearCache().then(
				function () {
					$ionicHistory.goBack();
				});
		}
	})

	.controller('NewsPaperCtrl', function ($scope, $state, $cordovaToast, AppNetwork, $ionicHistory, $cordovaNetwork) {
		if ($cordovaNetwork.isOnline()) {
			$scope.link = "http://www.khatebartar.com/mobile/newspaper";
		} else {
			$cordovaToast.showShortCenter('برای مشاهده روزنامه های امروز باید به اینترنت متصل باشید.');
			$ionicHistory.clearCache().then(
				function () {
					$state.go('app.home');
				});
		}
	})
;
