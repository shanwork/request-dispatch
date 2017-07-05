angular.module('statsApp').service('errorDataService', function() {
  // copy paste data
  //"total": "123", "pending":"50", "passing": "70", "failing": "3",
  this.getRegressionErrors = function (x) {
      return errorData;
  }
  this.getErrorLookups = function(x) {
    return errorLookups;
  }
  });
