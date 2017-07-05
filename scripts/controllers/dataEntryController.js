angular.module('statsApp').controller('DataEntryController',function($scope, $rootScope, errorDataService ){

  // ########### STATS ANALYSIS SECTION
  // counts for various fields ...
 

  $scope.changeSuite = function(init =false){
       let level1index = $scope.staticData.findIndex(x => x.level1Name==$scope.level1Name);
      if ((level1index >= 0  && level1index != $scope.level1index)||init==true){ 
          $scope.level1index = level1index;
          $scope.level2index = 0;
       $scope.level2Data = $scope.staticData[$scope.level1index].level2 ;
       $scope.level2Name = $scope.staticData[$scope.level1index].level2[$scope.level2index].level2Name ;
       $scope.items = $scope.staticData[$scope.level1index].level2[$scope.level2index].items ;
       $scope.itemName = $scope.staticData[$scope.level1index].level2[$scope.level2index].items[0].name ;
           $scope.selectItem()
        
      }
  }
  $scope.changeTests = function(){
      let level2index = $scope.staticData[$scope.level1index].level2.findIndex(x => x.level2Name==$scope.level2Name);
      if (level2index >= 0 && level2index != $scope.level2index){ 
          $scope.level2index = level2index;
          $scope.items = $scope.staticData[$scope.level1index].level2[$scope.level2index].items ;
          $scope.itemName = $scope.staticData[$scope.level1index].level2[$scope.level2index].items[0].itemName ;
          $scope.selectItem()
      }
  }
 $scope.selectItem  = function(){
     $scope.selectedItem = $scope.items.find(x=>x.name==$scope.itemName);
     $scope.selectedItem.name = ($scope.itemName);
  }
 $scope.addToCart = function() {
     var newItem = {
         sku : $scope.selectedItem.skuNum,
         name: $scope.selectedItem.name,
         unitCost : $scope.selectedItem.costPrice,
         quantity : $scope.addedItemQuantity,
         totalItemCost: $scope.addedItemQuantity * $scope.selectedItem.costPrice,
         dateOfPurchase: new Date()
         
     }
     $rootScope.totalItems += $scope.addedItemQuantity;
      $rootScope.totalCosts += newItem.totalItemCost ;
      $rootScope.shoppingCart.push(newItem);
     
 //    $scope.addedItenQuantity = 0;
 }
  $scope.init = function (){
      
      $scope.level1index = 0;
      $scope.level2index = 0;
      $scope.staticData = menu;
      $scope.level1Name =  $scope.staticData[$scope.level1index].level1Name ;
      $scope.level1 = $scope.staticData[$scope.level1index] ;
      $scope.changeSuite(true) 
       $scope.neta = String.fromCodePoint(134071)
      if (!$rootScope.totalItems)
          $rootScope.totalItems = 0;
       if (!$rootScope.totalCosts)
          $rootScope.totalCosts = 0 ;
      $scope.addedItenQuantity = 0;
      if (!$rootScope.shoppingCart)
          $rootScope.shoppingCart=[];
      
   //   $scope.changeTests() 
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
