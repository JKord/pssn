'use strict';

angular.module('dynablasterApp', ['LocalStorageModule', 'ngResource', 'ngCookies', 'ngAria', 'ngCacheBuster', 'ngFileUpload',
    'ui.bootstrap', 'ui.router',  'infinite-scroll', 'angular-loading-bar', 'toggle-switch'])

    .run(function ($rootScope, $location, $window, $http, $state, Auth, Principal, ENV, VERSION) {

        $rootScope.ENV = ENV;
        $rootScope.VERSION = VERSION;
        $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
            $rootScope.toState = toState;
            $rootScope.toStateParams = toStateParams;

            if (Principal.isIdentityResolved()) {
                Auth.authorize();
            }


        });

        $rootScope.$on('$stateChangeSuccess',  function(event, toState, toParams, fromState, fromParams) {
            var titleKey = 'dynablaster';

            // Remember previous state unless we've been redirected to login or we've just
            // reset the state memory after logout. If we're redirected to login, our
            // previousState is already set in the authExpiredInterceptor. If we're going
            // to login directly, we don't want to be sent to some previous state anyway
            if (toState.name != 'login' && $rootScope.previousStateName) {
              $rootScope.previousStateName = fromState.name;
              $rootScope.previousStateParams = fromParams;
            }

            // Set the page title key to the one configured in state or use default one
            if (toState.data.pageTitle) {
                titleKey = toState.data.pageTitle;
            }
            $window.document.title = titleKey;
        });

        $rootScope.back = function() {
            // If previous state is 'activate' or do not exist go to 'home'
            if ($rootScope.previousStateName === 'activate' || $state.get($rootScope.previousStateName) === null) {
                $state.go('home');
            } else {
                $state.go($rootScope.previousStateName, $rootScope.previousStateParams);
            }
        };
    })
    .config(function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider,
                      httpRequestInterceptorCacheBusterProvider, AlertServiceProvider, localStorageServiceProvider
    ) {
        // uncomment below to make alerts look like toast
        //AlertServiceProvider.showAsToast(true);

        //enable CSRF
        $httpProvider.defaults.xsrfCookieName = 'CSRF-TOKEN';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRF-TOKEN';

        //Cache everything except rest api requests
        httpRequestInterceptorCacheBusterProvider.setMatchlist([/.*api.*/, /.*protected.*/], true);

        $urlRouterProvider.otherwise('/');
        $stateProvider.state('site', {
            'abstract': true,
            views: {
                'navbar@': {
                    templateUrl: 'scripts/components/navbar/navbar.html',
                    controller: 'NavbarController'
                }
            },
            resolve: {
                authorize: ['Auth',
                    function (Auth) {
                        return Auth.authorize();
                    }
                ]
            }
        });

        $httpProvider.interceptors.push('errorHandlerInterceptor');
        $httpProvider.interceptors.push('authExpiredInterceptor');
        $httpProvider.interceptors.push('notificationInterceptor');

        localStorageServiceProvider.setStorageType('sessionStorage');
    })
    .config(['$urlMatcherFactoryProvider', function($urlMatcherFactory) {
        $urlMatcherFactory.type('boolean', {
            name : 'boolean',
            decode: function(val) { return val == true ? true : val == "true" ? true : false },
            encode: function(val) { return val ? 1 : 0; },
            equals: function(a, b) { return this.is(a) && a === b; },
            is: function(val) { return [true,false,0,1].indexOf(val) >= 0 },
            pattern: /bool|true|0|1/
        });
    }])
    .constant("DIR_RES", "assets/");

var __extends = function(child, parent) {
    for (var key in parent) {
        if (Object.prototype.hasOwnProperty.call(parent, key)) {
            child[key] = parent[key];
        }
    }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
};

var uiClasses = angular.module('dynablasterApp.uiClasses', []);

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};
