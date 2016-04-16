app.controller("mainController", function($scope, $http){
    $scope.results = [];
    $scope.filterText = null;
    $scope.availableCategories = [];
    $scope.availableLocations = [];
    $scope.categoryFilter = null;
    $scope.locationFilter = null;
   
   
    $scope.init = function() {
    
    var sheet = "od6"; //upcoming classes
    var key = "0AhVWrVLsk5a5dDJyaW1LMXFEVk1UY0FPVlBVcHd1bGc";
    var url = "http://spreadsheets.google.com/feeds/list/" + key + "/" + sheet + "/public/values?alt=json-in-script";
    
    
    
    $http.jsonp(url + '&callback=JSON_CALLBACK', {headers: {'MEME-Type': 'application/javascript'}}).success(function(data) {
        
        angular.forEach(data, function(value, index){
                angular.forEach(value.entry, function(classes, index){
                    //Create a date string from the timestamp so we can filter on it based on user text input
                    

                    var startDateTime = new Date(classes.gsx$start.$t);
                    classes.gsx$start.$t  = startDateTime.toLocaleTimeString([], {month: "2-digit", day: "2-digit", year: "numeric", weekday: "short", hour: "numeric", minute: "numeric"});
                    var endDateTime = new Date(classes.gsx$finish.$t);
                    classes.gsx$finish.$t  = startDateTime.toLocaleTimeString([], {month: "2-digit", day: "2-digit", year: "numeric", weekday: "short", hour: "numeric", minute: "numeric"});

                    $scope.results.push(classes);

                    //Loop through each category
                    angular.forEach(classes.gsx$category, function(category, index) {
                    
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
                    
                    //Loop through each location
                    angular.forEach(classes.gsx$location, function(location, index) {
                    
                        //Only add to the availableCat array if it doesn't already exist
                        var exists = false;
                        angular.forEach($scope.availableLocations, function(avCat, index){
                            if (avCat == location) {
                                exists = true;
                            }
                        });
                        if (exists === false) {
                            $scope.availableLocations.push(location);
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

    $scope.setLocationFilter = function(location) {
      $scope.locationFilter = location;
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

app.filter('isLocation', function() {
    return function(input, location) {
        if (typeof location == 'undefined' || location == null) {
            return input;
        } else {
            var out = [];
            for (var a = 0; a < input.length; a++){
              eachLocation = input[a].gsx$location.$t;
              if(input[a].gsx$location.$t == location) {
                out.push(input[a]);
              }
            }
            return out;
        }
    };
});


/* When the 'Only Show Public Classes' box is checked, do not show any classes that have a non-member price of "N/A" */
app.filter('filterPublicClasses', function() {
    return function(input, checked) {
        if (!checked)
            return input;
        else {
            var out = [];
            for (var i = 0; i < input.length; i++) {
                if (input[i].gsx$nprice.$t != "N/A")
                    out.push(input[i]);
            }
            return out;
        }
    };
});
