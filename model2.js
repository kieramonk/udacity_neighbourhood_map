var ajaxLocations = [{
        name: 'Buckingham Palace',
        location: {
            lat: 51.504469,
            lng: -0.154474
        },
    },
    {
        name: 'St James Palace',
        location: {
            lat: 51.505965,
            lng: -0.133917
        },
    },
    {
        name: 'The Ivy',
        location: {
            lat: 51.490122,
            lng: -0.176704
        },
    },
    {
        name: 'Hakkasan Mayfair',
        location: {
            lat: 51.518250,
            lng: -0.134003
        },
    },
    {
        name: 'Victoria Park',
        location: {
            lat: 51.540143,
            lng: -0.023324
        },
    },
    {
        name: 'Battersea Park',
        location: {
            lat: 51.491324,
            lng: -0.104456
        },
    }
];

var map;
// Create a new blank array for all the listing markers.
var markers = [];
var largeInfowindow;
var url;
//marker variable so can set visible in view model
var marker;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 51.504469,
            lng: -0.154474
        },
        zoom: 10,
        mapTypeControl: false
    });

    largeInfowindow = new google.maps.InfoWindow();

    //marker function was running before api was finishing so url was always coming back as undefined,
    //so have called api once clicked so marker is complete before api is called.

    for (var i = 0; i < ajaxLocations.length; i++) {
        //console.log(url);
        // Get the position from the location array.
        var position = ajaxLocations[i].location;
        var positionLat = ajaxLocations[i].location.lat;
        var positionLng = ajaxLocations[i].location.lng;
        var title = ajaxLocations[i].name;
        // Create a marker per location, and put into markers array.
        marker = new google.maps.Marker({
            position: position,
            positionLat: positionLat,
            positionLng: positionLng,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i
        });
        // Push the marker to our array of markers.
        ajaxLocations[i].marker = marker;
        markers.push(marker);
        marker.addListener('click', handler);
        marker.setMap(map);
    }

    // onclick event to open an infowindow at each marker.
        function handler() {
            populateInfoWindow(this, largeInfowindow);
            bounceMarker(this);
        }

    function displayMarkerList() {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
        }
    }
    ko.applyBindings(new viewModelTwo());
}

function bounceMarker(marker) {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    window.setTimeout(function() {
            marker.setAnimation(null);
        },
        1200
    );
}

function populateInfoWindow(marker, infowindow) {
    var fourUrl =
        'https://api.foursquare.com/v2/venues/search?ll=' + marker.positionLat + ',' +
        marker.positionLng + '&query=' + marker.title +
        '&client_id=YRV0H2C0KUFTDPSUO13OEEO1IBIS032VRJHTV1MPMLHQSM3E&client_secret=O1JGJMWA0NQWNXYPRAI1CSYXSNM42U0ISUPZGTPPVJNE2RGP&v=20170101';

    $.ajax({
        url: fourUrl,
        dataType: "json",
        }).done(function(data) {
            var url = data.response.venues[0].url;
            if (data.response.venues[0].url == undefined) {
                url = 'Unable to retrive URL info';
            }
            var here = data.response.venues[0].hereNow.count;
            if (data.response.venues[0].hereNow.count == undefined) {
                here = 'Unsure on number of people';
            }
            var phone = data.response.venues[0].contact.phone;
            if (data.response.venues[0].contact.phone == undefined) {
                phone = 'Google it';
            }
            // Check to make sure the infowindow is not already opened.
            if (infowindow.marker != marker) {
                infowindow.marker = marker;
                infowindow.setContent('<div>' + marker.title + '</div><div>Foursquare Info:</div><div>' + url + '</div><div>People here now: ' + here + '</div><div>Phone: ' + phone + '</div>');
                infowindow.open(map, marker);
                // Make sure the marker cleared if the infowindow is closed.
                infowindow.addListener('closeclick', function() {
                    infowindow.marker = null;
                });
            }
        }).fail(function() {
            if (infowindow.marker != marker) {
                infowindow.marker = marker;
                infowindow.setContent('<div>' + marker.title + '<div>Unable to get Foursquare info at present</div>');
                infowindow.open(map, marker);
            // Make sure the marker cleared if the infowindow is closed.
                infowindow.addListener('closeclick', function() {
                    infowindow.marker = null;
                });
            }
        });
}

function googleError() {
    alert("Cannot load the map at present.");
    $('#map').html("Please try again later");
}
