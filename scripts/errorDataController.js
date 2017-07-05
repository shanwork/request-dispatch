angular.module('statsApp').controller('errorDataController',function($scope,  errorDataService ){

  // ########### STATS ANALYSIS SECTION
  // counts for various fields ...
  $scope.scanAndAddSubList = function(fieldArray,key, custom=false )
  {
    $scope.sortField = key ;
     var sortedRegressionErrors = $scope.regressionErrorList.sort(
        function(a,b,key) {
          if (a[$scope.sortField] < b[$scope.sortField])
            return -1;
          if (a[$scope.sortField] > b[$scope.sortField])
              return 1;
           return 0;
        });
    var fieldArrayIndex = 0;
    var firstKey = sortedRegressionErrors[0][key];
    if (custom == true){
      var element = {
       build: sortedRegressionErrors[0].buildId,
       count: sortedRegressionErrors[0].buildNotes.indexOf('## SUCCESS ###') >=0 ?'na': 1,
       commandLine: sortedRegressionErrors[0].commandLine,
       segmentOfDay: sortedRegressionErrors[0].segmentOfDay,
       buildNotes: sortedRegressionErrors[0].buildNotes,
       gitChange: sortedRegressionErrors[0].gitChange,
       browsersFailing: sortedRegressionErrors[0].browsersFailing
     };
    }
    else {
      var element = {
       build: sortedRegressionErrors[0].build,
       field: firstKey,
       count: 1.0
     };
    }
    if(firstKey !='' )
      fieldArray.push(element);


    for (var i =1; i < sortedRegressionErrors.length;i++){
      if(sortedRegressionErrors[i][key] =='' )
         continue;
      if (sortedRegressionErrors[i][key] != firstKey){
        firstKey = sortedRegressionErrors[i][key];

            var element = {
              build: sortedRegressionErrors[i].buildId,
              field: firstKey,
              count: 1
            };
        fieldArray.push(element);
        fieldArrayIndex++;
      }
      else {
        fieldArray[fieldArrayIndex].count++;
        if (custom != true)
          fieldArray[fieldArrayIndex].build += ", " + sortedRegressionErrors[i].build;
        else
          fieldArray[fieldArrayIndex].buildNotes = sortedRegressionErrors[i].buildNotes
      }
    }
  }
  function compare(a,b,key) {
    if (a[key] < b[key])
      return -1;
    if (a[key] > b[key])
        return 1;
     return 0;
  }
  $scope.saveChanges = function()
  {
    var fh = fopen("../data/MyFile.txt", 3); // Open the file for writing

    if(fh!=-1) // If the file has been successfully opened
    {
        var str = JSON.stringify($scope.regressionErrors);
        fwrite(fh, str); // Write the string to a file
        fclose(fh); // Close the file
    }
  }
  $scope.scanAndUpdateSubList = function(fieldArray,key, build, value)
  {
    var found = null ;
    found = fieldArray.filter(function (object) { return object[key] == value});
    if (found != null && found.length > 0) {
      found.build += ',' + build ;
      found.count++;
    }
    else {
      var element = {
        build: build,
        field: value,
        count: 1
      };
    }
    fieldArray.push(element);
  }
  // ... ### STATS SECTION
  $scope.sort = function(keyname){
          $scope.sortKey = keyname;   //set the sortKey to the param passed
          $scope.reverse = !$scope.reverse; //if true make it false and vice versa
      }
  $scope.init = function (toAddFlag = true, refresh=false){
    $scope.mydata = errorData;
      $scope.errorClass='';
      $scope.regressionErrorList = [];
      $scope.toAdd=toAddFlag;
      $scope.regressionErrors = errorDataService.getRegressionErrors();
      $scope.errorLookups = errorDataService.getErrorLookups();
      $scope.regressionErrorCount = $scope.regressionErrors.length;
      $scope.regressionErrors.forEach( function (object){
           object.errorList.forEach(function (errorLine){
             if (errorLine.error != 'success')
               $scope.regressionErrorList.push(errorLine);
           });
      });
      // tracks current build information being entered
      // When clicking 'add', this will match against build Id entered on the form
      // if they are different, a record is added to the errorList array
      $scope.currentBuildId = $scope.regressionErrorCount > 0 ? $scope.regressionErrors[$scope.regressionErrorCount-1].buildId : '';
      if (!refresh){
        $scope.toggle=true;
        $scope.showStatus=false ;
        $scope.showAllTable = true ;
        $scope.showSummaryTable = true;
        $scope.showLevelErrors = true;
        $scope.showGraph = true;
      }
      $scope.errorTypes = [];
      $scope.level1Errors = [];
      $scope.level2Errors = [];
      $scope.level3Errors = [];
      $scope.level4Errors = [];
      $scope.level5Errors = [];
      $scope.buildSummaryList = [];
      $scope.buildSegnentOfDay = '';
      key ="build"
      if ($scope.regressionErrorList.length > 0){
          $scope.scanAndAddSubList($scope.errorTypes,"errorClass")
          $scope.scanAndAddSubList($scope.level1Errors,"level1")
          $scope.scanAndAddSubList($scope.level2Errors,"level2")
          $scope.scanAndAddSubList($scope.level3Errors,"level3")
          $scope.scanAndAddSubList($scope.level4Errors,"level4")
      }
      $scope.totalSummaryRecords = $scope.regressionErrors.length;
      $scope.totalErrorRecords = $scope.regressionErrorList.length;
      $scope.options = {
    chart: {
        type: 'discreteBarChart',
        height: 450,
        margin : {
            top: 20,
            right: 20,
            bottom: 60,
            left: 55
        },
        x: function(d){ return d.label; },
        y: function(d){ return d.value; },
        showValues: true,
         showToolTip:true,
        transitionDuration: 500,
        xAxis: {
            axisLabel: 'X Axis'
        },
        yAxis: {
            axisLabel: 'Y Axis',
            axisLabelDistance: 30
        }
    }
};

$scope.errorTypeData = [{
    key: "error types",
    values: [

    ]
}];
$scope.level1Data = [{
    key: "Level1",
    values: [

    ]
}];
 for (var et=0 ; et < $scope.errorTypes.length;et++){
       $scope.errorTypeData[0].values.push(
         {
           "label": et,
           "value": $scope.errorTypes[et].count,
       });
 }
 for (var l1=0 ; l1 < $scope.level1Errors.length;l1++){
       $scope.level1Data[0].values.push(
         {
           "label": l1,//$scope.level1Errors[l1].field? $scope.level1Errors[et].field.substring(0,2):'',
           "value": $scope.level1Errors[l1].count,
       });
 }
    }
    $scope.init();
    $scope.showJsonIndent = function()
    {
      var declareArray = [] ;
      declareArray.push('var errorData = [');
      for (var i = 0 ; i < $scope.regressionErrors.length; i++){
         declareArray.push('{');
         var keyIndex = 0;
         for (var key in $scope.regressionErrors[i]) {
           if (key != "errorList"){
              if(keyIndex++ > 0)
                   declareArray.push(',"' + key  + '":"' + $scope.regressionErrors[i][key] +'"');
              else
                  declareArray.push(  '"' + key  + '":"' + $scope.regressionErrors[i][key] +'"');
            }
            else
               declareArray.push(',"errorList":[]');
         }
         declareArray.push('}');

      }
      declareArray.push('];');



      return declareArray ;
    }
    $scope.showJson = function()
    {
      var declareArray = [] ;

      declareArray.push(
        'var errorData = '
            .concat ( JSON.stringify($scope.regressionErrors) ).concat (';')
        );

      declareArray.push(
         'var errorLookups = '
            .concat(JSON.stringify($scope.errorLookups) ).concat (';'));

      return declareArray ;
    }
    // new method, using master detail formatting
    $scope.addregressionError = function() {
      alert($scope.errorLookups.find(function(errorClassName)
       {
         return errorClassName==$scope.errorClass;
       }));
      if ($scope.errorLookups.find(function(errorClassName)
       {
         return errorClassName==$scope.errorClass;
       }) == undefined){
         $scope.errorLookups.push($scope.errorClass);
       }
      var buildId = $scope.build  ;
      // for a new buildId, we instantaite a blank object and push it
      if (buildId != $scope.currentBuildId) {
      //  if ($scope.currentBuildId=='')
      //  {
          var newBuildRecord = {
            buildId: buildId,
            gitChange: '',
            segmentOfDay: '',
            buildNotes:'',
            buildCommandLine: '',
            buildStatus:'',
            timeAndDate: $scope.time,
            errorList:[]
          }
          $scope.regressionErrors.push(newBuildRecord);
      //  }
        $scope.regressionErrorCount = $scope.regressionErrors.length;
        $scope.currentBuildId = buildId;
      }
      $scope.regressionErrors[$scope.regressionErrors.length-1].gitChange = $scope.gitChange;
      $scope.regressionErrors[$scope.regressionErrors.length-1].buildNotes = $scope.buildNotes;
      $scope.regressionErrors[$scope.regressionErrors.length-1].segmentOfDay = $scope.buildSegnentOfDay;
      $scope.regressionErrors[$scope.regressionErrors.length-1].buildCommandLine = $scope.buildCommandLine;
      $scope.regressionErrors[$scope.regressionErrors.length-1].buildStatus = $scope.buildStatus;
      if ($scope.error == 'success'){
         $scope.regressionErrors[$scope.regressionErrors.length-1].buildNotes = '##SUCCESS ##' + $scope.buildNotes;
         return;
      }
      var newErrorLine = {
        buildId: $scope.currentBuildId,
        suite: $scope.suite,
        test: $scope.test,
        error: $scope.error,
        errorClass: $scope.errorClass,
        subTest: $scope.subTest,
        level5: $scope.level5,
        level4: $scope.level4,
        level3: $scope.level3,
        level2: $scope.level2,
        level1: $scope.level1,
        timeAndDate: $scope.time
      }

      $scope.regressionErrors[$scope.regressionErrors.length-1].errorList.push(newErrorLine);
      // this doesnt work, so calling $scope.init
      // $scope.scanAndUpdateSubList($scope.errorTypes,"field", $scope.build, $scope.error);
      $scope.init(false,true);
    }

    /* old method
    $scope.addregressionError = function() {

      var newObject = {
        build: $scope.build,
        gitChange: $scope.gitChange,
        buildNotes: $scope.buildNotes,
        segmentOfDay: $scope.buildSegnentOfDay,
        suite: $scope.suite,
        test: $scope.test,
        error: $scope.error,
        subTest: $scope.subTest,
        level5: $scope.level5,
        level4: $scope.level4,
        level3: $scope.level3,
        level2: $scope.level2,
        level1: $scope.level1,
        timeAndDate: $scope.time
      }

      $scope.regressionErrors.push(newObject);
      // this doesnt work, so calling $scope.init
  //    $scope.scanAndUpdateSubList($scope.errorTypes,"field", $scope.build, $scope.error);
  $scope.init(false,true);
    }
    */


});
