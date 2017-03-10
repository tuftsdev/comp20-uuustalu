var username = "eKAxYriw";

var myLat = 0;
var myLng = 0;

var myOptions = {
	zoom: 15, // The larger the zoom number, the bigger the zoom
	center: position,
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

var position;
var map;
var marker;
var infowindow;

var request = new XMLHttpRequest();
var dataURL = "https://defense-in-derpth.herokuapp.com/submit";
var data;
var showType;

var i = 0;
var lat = 0;
var lng = 0;



function init()
{
	map = new google.maps.Map(document.getElementById("map"), myOptions);
	getMyLocation();
}

function getData() {
	request.open("POST", dataURL, true);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.send("username="+username+"&lat="+myLat+"&lng="+myLng);
	request.onreadystatechange = function() {
		if (request.readyState == 4 && request.status == 200) {
			data = JSON.parse(request.responseText);
			processData();
		}
	}
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

function renderMap()
{
	position = new google.maps.LatLng(myLat, myLng);
	
	map.panTo(position);

	marker = new google.maps.Marker({
		position: position,
		icon: {url: icons["me"].url, scaledSize: icons["me"].size},
		title: username,
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
		marker = new google.maps.Marker({
			position: position,
			icon: {url: icons[showType].url, scaledSize: icons[showType].size},
			title: data[showType][i].username
		});
		marker.setMap(map);
		infowindow = new google.maps.InfoWindow();
		google.maps.event.addListener(marker, 'click', function() {
			infowindow.setContent(this.title);
			infowindow.open(map, this);
		});
	}
}