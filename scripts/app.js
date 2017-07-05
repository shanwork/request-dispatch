var statsApp = angular.module('statsApp', ['nvd3','ngRoute']);
statsApp.config(function($routeProvider){
    $routeProvider
     .when ('/default',
         {
            // controller: 'errorDataController',
             templateUrl:'testCrud.html'
         }
      )
      .when ('/test',
         {
             controller: 'errorDataController',
             templateUrl:'views/tables.html'
         }
      )
      .when ('/entry',
         {
             controller: 'DataEntryController',
             templateUrl:'views/dataEntry.html'
         }
      )
      .otherwise( {redirectTo : '/entry'});
})