app.controller("mainController", function($scope, $http){
    $scope.results = [];
    $scope.filterText = null;
    $scope.availableCategories = [];
    $scope.categoryFilter = null;
   
    $scope.init = function() {
    
    var sheet = "od6"; //upcoming classes
    var key = "0AhVWrVLsk5a5dDJyaW1LMXFEVk1UY0FPVlBVcHd1bGc";
    var url = "http://spreadsheets.google.com/feeds/list/" + key + "/" + sheet + "/public/values?alt=json-in-script";
    
    
    
    $http.jsonp(url + '&callback=JSON_CALLBACK').success(function(data) {
        
        angular.forEach(data, function(value, index){
                //The API stores the full date separately from each episode. Save it so we can use it later
                //var start = value.gsx$start.$t;
                //For each episodes, add it to the results array
                angular.forEach(value.entry, function(classes, index){
                    //Create a date string from the timestamp so we can filter on it based on user text input
                    
                    $scope.results.push(classes);
                    
                    
       //Loop through each category
                    angular.forEach(classes.gsx$category, function(category, index){
                    
                    
                        //Only add to the availableGenres array if it doesn't already exist
                        var exists = false;
                        angular.forEach($scope.availableCategories, function(avCat, index){
                            if (avCat == category) {
                                exists = true;
                            }
                        });
                        if (exists === false) {
                            $scope.availableCategories.push(category);
                        }
                        console.log(classes);
                       
                    }); 
                    
                });
                
            });
            
        }).error(function(error) {
 
        });

    };
    
    $scope.setCategoryFilter = function(category) {
    $scope.categoryFilter = category;
   
  };     
 console.log($scope.categoryFilter);
});




app.filter('isCategory', function() {
  
    return function(input, category) {
        if (typeof category == 'undefined' || category == null) {
            return input;
        } else {
            var out = [];
            for (var a = 0; a < input.length; a++){
             eachCategory = input[a].gsx$category.$t;
               // for (var b = 0; b < eachCategory.length; b++){

                    if(input[a].gsx$category.$t == category) {
                      
                       out.push(input[a]);
                         
                   // }
                }
            }
            return out;
        }
    };
});

