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
    // http://spreadsheets.google.com/feeds/list/0AhVWrVLsk5a5dDJyaW1LMXFEVk1UY0FPVlBVcHd1bGc/od6/public/values?alt=json-in-script
    
    var formatDate = function(aDate) {
        var zExt = function(x) {
            if(x < 10) {
                return "0" + x;
            } else {
                return "" + x;
            }
        };
        // E.g. Thu, 06/23/2016, 6:00 PM
        var formatted = "";
        var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        formatted += days[aDate.getDay()];
        formatted += ", ";
        formatted += zExt(aDate.getMonth() + 1);
        formatted += "/";
        formatted += zExt(aDate.getDate());
        formatted += "/";
        formatted += aDate.getFullYear();
        formatted += " ";

        var hour = aDate.getHours();
        var hourp1, hourp2;
        if(0 == hour) {
            hourp1 = 12;
            hourp2 = "AM";
        } else if(hour < 12) {
            hourp1 = hour;
            hourp2 = "AM";
        } else if(12 == hour) {
            hourp1 = 12;
            hourp2 = "PM";
        } else {
            hourp1 = hour - 12;
            hourp2 = "PM";
        }
        formatted += hourp1;
        formatted += ":";
        formatted += zExt(aDate.getMinutes());
        formatted += " ";
        formatted += hourp2;

        return formatted;
    };

    $http.jsonp(url + '&callback=JSON_CALLBACK', {headers: {'MEME-Type': 'application/javascript'}}).success(function(data) {
        
        angular.forEach(data, function(value, outerIndex){
                angular.forEach(value.entry, function(classes, index){
                    //Create a date string from the timestamp so we can filter on it based on user text input
                    

                    var dateRE = /([01]+[0-9][/][0-3]+[0-9][/][0-9]* )[^0-9]*([0-9]*:[0-9]* [apAP]m)/i;
                    var startDateTime = new Date(classes.gsx$start.$t.replace(/-/g, '/'));
                    classes.gsx$start.$t  = formatDate(startDateTime); // + "  " + startDateTime.toLocaleTimeString([], {month: "2-digit", day: "2-digit", year: "numeric", weekday: "short", hour: "numeric", minute: "numeric"});

                    var endDateTimeMatch = dateRE.exec(classes.gsx$finish.$t);
                    if(endDateTimeMatch && endDateTimeMatch[1] && endDateTimeMatch[2]) {
                        var endDateTime = new Date((endDateTimeMatch[1] + endDateTimeMatch[2]).replace(/-/g, '/'));
                        classes.gsx$finish.$t = formatDate(endDateTime); // endDateTime.toLocaleTimeString([], {month: "2-digit", day: "2-digit", year: "numeric", weekday: "short", hour: "numeric", minute: "numeric"});
                    }

                    //classes.gsx$finish.$t  = endDateTime.toLocaleTimeString([], {month: "2-digit", day: "2-digit", year: "numeric", weekday: "short", hour: "numeric", minute: "numeric"});

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
