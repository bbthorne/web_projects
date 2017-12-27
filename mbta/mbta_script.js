/* Lists all coordinates of stops for use in markers and polylines */
coord = [
        {'lat': 42.395428, 'long': -71.142483, 'title': "Alewife"},
        {'lat': 42.39674, 'long': -71.121815, 'title': "Davis"},
        {'lat': 42.3884, 'long': -71.11914899999999, 'title': "Porter Square"},
        {'lat': 42.373362, 'long': -71.118956, 'title': "Harvard Square"},
        {'lat': 42.365486, 'long': -71.103802, 'title': "Central Square"},
        {'lat': 42.36249079, 'long': -71.08617653, 'title': "Kendall/MIT"},
        {'lat': 42.361166, 'long': -71.070628, 'title': "Charles/MGH"},
        {'lat': 42.35639457, 'long': -71.0624242, 'title': "Park Street"},
        {'lat': 42.355518, 'long': -71.060225, 'title': "Downtown Crossing"},
        {'lat': 42.352271, 'long': -71.05524200000001, 'title': "South Station"},
        {'lat': 42.342622, 'long': -71.056967, 'title': "Broadway"},
        {'lat': 42.330154, 'long': -71.057655, 'title': "Andrew"},
        {'lat': 42.320685, 'long': -71.052391, 'title': "JFK/UMass"},
        {'lat': 42.275275, 'long': -71.029583, 'title': "North Quincy"},
        {'lat': 42.2665139, 'long': -71.0203369, 'title': "Wollaston"},
        {'lat': 42.251809, 'long': -71.005409, 'title': "Quincy Center"},
        {'lat': 42.233391, 'long': -71.007153, 'title': "Quincy Adams"},
        {'lat': 42.2078543, 'long': -71.0011385, 'title': "Braintree"},
        {'lat': 42.31129, 'long': -71.053331, 'title': "Savin Hill"},
        {'lat': 42.300093, 'long': -71.061667, 'title': "Fields Corner"},
        {'lat': 42.29312583, 'long': -71.06573796000001, 'title': "Shawmut"},
        {'lat': 42.284652, 'long': -71.06448899999999, 'title': "Ashmont"},
];

/* Sets markers for MBTA stops on the map */
function set_markers(map)
{
        request = new XMLHttpRequest();

        request.open("GET", "https://salty-savannah-87519.herokuapp.com/redline.json");
        request.onreadystatechange = function () {
                if (request.readyState == 4 && request.status == 200) {
                        data = JSON.parse(request.responseText);
                        setStopMarkers(map);
                }
        }
        request.send();
}

function setStopMarkers(map) {
        markers = [];
        iconBase = 'arrow.png';

        for (i = 0; i < coord.length; i++) {
                markers[i] = new google.maps.Marker({
                        position: new google.maps.LatLng(coord[i].lat, coord[i].long),
                        title: coord[i].title,
                        icon: iconBase
                });
                markers[i].setMap(map);

                var stopWindow = new google.maps.InfoWindow();
                google.maps.event.addListener(markers[i], 'click', function () {
                        info = getInfo(this.title);
                        stopWindow.setContent(this.title + "<br />" + info);
                        stopWindow.open(map, this);
                });
        }
}

function getInfo(stopName)
{
        var Ashmont = "To Ashmont: ";
        var Braintree = "To Braintree: ";
        var Alewife = "To Alewife: "

        for (var i = 0; i < data.TripList.Trips.length; i++) {
                if (data.TripList.Trips[i].Destination == "Ashmont") {
                        for (var j = 0; j < data.TripList.Trips[i].Predictions.length; j++) {
                                if (data.TripList.Trips[i].Predictions[j].Stop === stopName) {
                                        Ashmont += Math.round(data.TripList.Trips[i].Predictions[j].Seconds / 60) + " mins, ";
                                }
                        }
                } else if (data.TripList.Trips[i].Destination == "Braintree") {
                        for (var k = 0; k < data.TripList.Trips[i].Predictions.length; k++) {
                                if (data.TripList.Trips[i].Predictions[k].Stop === stopName) {
                                        Braintree += Math.round(data.TripList.Trips[i].Predictions[k].Seconds / 60) + " mins, ";
                                }
                        }
                } else if (data.TripList.Trips[i].Destination == "Alewife") {
                        for (var m = 0; m < data.TripList.Trips[i].Predictions.length; m++) {
                                if (data.TripList.Trips[i].Predictions[m].Stop === stopName) {
                                        Alewife += Math.round(data.TripList.Trips[i].Predictions[m].Seconds / 60) + " mins, ";
                                }
                        }
                }
        }
        Ashmont = Ashmont.slice(0,-2);
        Braintree = Braintree.slice(0,-2);
        Alewife = Alewife.slice(0,-2);
        return Ashmont + "<br />" + Braintree + "<br />" + Alewife + "<br />";
}

/* Draws red polylines that follow the red line on the map */
function draw_redline(map)
{
        var alewife_to_jfk = [];
        var jfk_to_braintree = [];
        var jfk_to_ashmont = [{lat: coord[12].lat, lng: coord[12].long}];

        for (var i = 0; i < 13; i++) {
                alewife_to_jfk[i] = {lat: coord[i].lat, lng: coord[i].long};
        }
        var path1 = new google.maps.Polyline({
                path: alewife_to_jfk,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
        });
        path1.setMap(map);

        for (var j = 12; j < 18; j++) {
                jfk_to_braintree.push({lat: coord[j].lat, lng: coord[j].long});
        }
        var path2 = new google.maps.Polyline({
                path: jfk_to_braintree,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
        });
        path2.setMap(map);

        for (var k = 18; k < coord.length; k++) {
                jfk_to_ashmont.push({lat: coord[k].lat, lng: coord[k].long});
        }
        var path3 = new google.maps.Polyline({
                path: jfk_to_ashmont,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
        });
        path3.setMap(map);
}

/* Uses the navigator api to determine the user's current location on the map. */
function getCurrentLocation(map)
{
        if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
			myLat = position.coords.latitude;
			myLng = position.coords.longitude;
                        renderMap(map);

		});
        } else {
                alert("Geolocation is not supported in your browser :(");
        }
}

/* Puts user's marker on map, also defines behavior when user's marker is clicked */
function renderMap(map)
{
        var infowindow = new google.maps.InfoWindow();
        myPos = new google.maps.LatLng(myLat, myLng);

        map.panTo(myPos);

        myPosMarker = new google.maps.Marker({
		position: myPos,
		title: "Current Location"
	});
        myPosMarker.setMap(map);

        findClosestStop();
        generatePolyline(myLat, myLng, closestStop, map);

        google.maps.event.addListener(myPosMarker, 'click', function() {
		infowindow.setContent(closestStop.title + ", " + Math.round(shortest * 100) / 100 + " mi away");
		infowindow.open(map, myPosMarker);
	});
}

/* Determines the closest red line stop to the user's marker */
function findClosestStop()
{
        closestStop = coord[0];
        shortest = distance(myLat, myLng, coord[0].lat, coord[0].long);

        for (var i = 0; i < coord.length; i++) {
                if (distance(myLat, myLng, coord[i].lat, coord[i].long) < shortest) {
                        shortest = currentDistance;
                        closestStop = coord[i];
                }
        }
}

/* Generates a polyline between the user and the closest T stop */
function generatePolyline(myLat, myLng, closestStop, map)
{
        var nearestStop = [
                {lat: myLat, lng: myLng},
                {lat: closestStop.lat, lng: closestStop.long}
        ];

        var path = new google.maps.Polyline({
                path: nearestStop,
                geodesic: true,
                strokeColor: 'Green',
                strokeOpacity: 1.0,
                strokeWeight: 2
        });
        path.setMap(map);
}

/* Taken from Stack Overflow's implementation of Haversine distance formula */
function distance(myLat, myLng, newLat, newLng)
{
        function toRad(x) {
                return x * Math.PI / 180;
        }

        var lat2 = newLat;
        var lon2 = newLng;
        var lat1 = myLat;
        var lon1 = myLng;

        var R = 6371; // km

        //has a problem with the .toRad() method below.
        var x1 = lat2-lat1;
        var dLat = toRad(x1);
        var x2 = lon2-lon1;
        var dLon = toRad(x2);
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;

        currentDistance = d / 1.60934; // conversion from km to miles
        return currentDistance;
}

/* Sets up a Google Map, Markers, and Polylines */
function init()
{
        var center = new google.maps.LatLng(coord[9].lat, coord[9].long);

        var map_setup = {
                zoom: 13,
                center: center,
                mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById("map"), map_setup);

        set_markers(map);
        draw_redline(map);
        getCurrentLocation(map);
}
