var viewModelTwo = function() {

    var self = this;
    self.people = ko.observable(ajaxLocations);

    self.displayInfoWindow = function(point) {
        for (var i = 0; i < ajaxLocations.length; i++) {
            if (point.name === ajaxLocations[i].name) {
                var pointMarker = markers[i];
                bounceMarker(pointMarker);
                populateInfoWindow(pointMarker, largeInfowindow);
            }
        }
    };

    self.searchSpace = ko.observable('');
    //filter
    self.searches = ko.computed(function() {
        var searchSpace = self.searchSpace().toLowerCase();

        return ko.utils.arrayFilter(self.people(), function(list) {
            var searchOutput = list.name.toLowerCase().indexOf(searchSpace) > -1;
            list.marker.setVisible(searchOutput);
            return searchOutput;
        });
    }, self);
};
        /*just couldn't get it to filter so came up with the above with help from knockout blogs.
        if(!searchSpace) {
                    for(var i = 0; i < self.people.length; i++) {
                        self.people()[i].marker.setVisible(true);
                    }
                    return self.people();
                }
                else {
                    return ko.utils.arrayFilter(self.people, function(item) {
                        var match = item.name.toLowerCase().indexOf(searchSpace)!==-1;
                        item.marker.setVisible(match);
                        return match;
                    })
        }*/
