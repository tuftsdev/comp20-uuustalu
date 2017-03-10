var username = "eKAxYriw";

var myLat = 0;
var myLng = 0;

var myOptions = {
	zoom: 15,
	center: myPosition,
	mapTypeId: google.maps.MapTypeId.ROADMAP
};

var icons = {
	"me": {
		url: "me_icon.png",
		size: new google.maps.Size(50, 50)
	},
	"drivers": {
		url: "driver_icon.png",
		size: new google.maps.Size(75, 30)
	},
	"passengers": {
		url: "passenger_icon.png",
		size: new google.maps.Size(40, 40)
	}
};

var myPosition;
var position;
var map;
var marker;
var infowindow;
var distance;

var request = new XMLHttpRequest();
var dataURL = "https://defense-in-derpth.herokuapp.com/submit";
var data;
var showType;

var i = 0;
var lat = 0;
var lng = 0;
var metersInMile = 1609.344;



function init()
{
	map = new google.maps.Map(document.getElementById("map"), myOptions);
	getMyLocation();
}

function getMyLocation()
{
	if ("geolocation" in navigator) {
		navigator.geolocation.getCurrentPosition(function(position) {
			myLat = position.coords.latitude;
			myLng = position.coords.longitude;
			getData();
		});
	}
	else {
		alert("Your browser does not support geolocation. SAD!");
		return;
	}
}

function getData() {
	request.open("POST", dataURL, true);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.send("username=" + username + "&lat=" + myLat + "&lng=" + myLng);
	request.onreadystatechange = function() {
		if (request.readyState == 4 && request.status == 200) {
			data = JSON.parse(request.responseText);
			processData();
		}
	};
}

function processData() {
	if(data["passengers"] !== undefined) {
		showType = "passengers";
	}
	else if(data["drivers"] !== undefined) {
		showType = "drivers";
	}

	if(showType === undefined) {
		alert("Unable to retrieve vital data. SAD!");
		return;
	}
	else {
		renderMap();
	}
}

function renderMap()
{
	myPosition = new google.maps.LatLng(myLat, myLng);
	
	map.panTo(myPosition);

	marker = new google.maps.Marker({
		position: myPosition,
		icon: {url: icons["me"].url, scaledSize: icons["me"].size},
		title: '<div class="username" id="me">'+username+'</div>'
	});
	marker.setMap(map);
		
	infowindow = new google.maps.InfoWindow();

	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(this.title);
		infowindow.open(map, this);
	});

	populateMap();
}

function populateMap()
{
	for (i = 0; i < data[showType].length; i++) {

		lat = data[showType][i].lat;
		lng = data[showType][i].lng;
		position = new google.maps.LatLng(lat, lng);

		distance = google.maps.geometry.spherical.computeDistanceBetween(myPosition, position);
		distance = distance / metersInMile;

		marker = new google.maps.Marker({
			position: position,
			icon: {url: icons[showType].url, scaledSize: icons[showType].size},
			title: '<div class="username">'+data[showType][i].username+'</div>'+'<div class="distance">'+distance+'</div>'
		});
		marker.setMap(map);

		google.maps.event.addListener(marker, 'click', addInfoWindow);
	}
}

function addInfoWindow()
{
	infowindow.setContent(this.title);
	infowindow.open(map, this);
}