app.controller("mainController", function($scope, $http){
    $scope.results = [];
    $scope.filterText = null;
    $scope.availableCategories = [];
    $scope.categoryFilter = null;
   
   
    $scope.init = function() {
    
    var sheet = "od6"; //upcoming classes
    var key = "0AhVWrVLsk5a5dDJyaW1LMXFEVk1UY0FPVlBVcHd1bGc";
    var url = "http://spreadsheets.google.com/feeds/list/" + key + "/" + sheet + "/public/values?alt=json-in-script";
    
    
    
    $http.jsonp(url + '&callback=JSON_CALLBACK', {method: 'GET', headers: {'Content-Type': 'application/json'}}).success(function(data) {
        
        angular.forEach(data, function(value, index){
                angular.forEach(value.entry, function(classes, index){
                    //Create a date string from the timestamp so we can filter on it based on user text input
                    
                    $scope.results.push(classes);
       //Loop through each category
                    angular.forEach(classes.gsx$category, function(category, index){
                    
                        //Only add to the availableCat array if it doesn't already exist
                        var exists = false;
                        angular.forEach($scope.availableCategories, function(avCat, index){
                            if (avCat == category) {
                                exists = true;
                            }
                        });
                        if (exists === false) {
                            $scope.availableCategories.push(category);
                        }
                        //console.log(classes);
                       
                    }); 
                    
                });
                
            });
            
        }).error(function(error) {
 
        });

    };
    
    $scope.setCategoryFilter = function(category) {
    $scope.categoryFilter = category;
   
  };     

});




app.filter('isCategory', function() {
  
    return function(input, category) {
        if (typeof category == 'undefined' || category == null) {
            return input;
        } else {
            var out = [];
            for (var a = 0; a < input.length; a++){
             eachCategory = input[a].gsx$category.$t;

                    if(input[a].gsx$category.$t == category) {
                      
                       out.push(input[a]);

                }
            }
            return out;
        }
    };
});


