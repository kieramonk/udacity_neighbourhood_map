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

