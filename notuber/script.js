var username = "eKAxYriw";

var myLat = 0;
var myLng = 0;

var myOptions = {
	zoom: 15, // The larger the zoom number, the bigger the zoom
	center: me,
	mapTypeId: google.maps.MapTypeId.ROADMAP
};

var icons = {
	"me": {
		url: "me_icon.png",
		size: new google.maps.Size(50, 50)
	},
	"driver": {
		url: "driver_icon.png",
		size: new google.maps.Size(75, 30)
	},
	"passenger": {
		url: "passenger_icon.png",
		size: new google.maps.Size(40, 40)
	}
};

var me;
var map;
var marker;
var infowindow;

var request = new XMLHttpRequest();
var dataURL = "https://defense-in-derpth.herokuapp.com/submit";




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
			console.log(request.responseText);
		}
	}
}
			
function getMyLocation()
{
	if ("geolocation" in navigator) {
		navigator.geolocation.getCurrentPosition(function(position) {
			myLat = position.coords.latitude;
			myLng = position.coords.longitude;
			getData();
			renderMap();
		});
	}
	else {
		alert("Your browser does not support geolocation. SAD!");
	}
}

function renderMap()
{
	me = new google.maps.LatLng(myLat, myLng);
	
	map.panTo(me);
	marker = new google.maps.Marker({
		position: me,
		icon: {url: icons["me"].url, scaledSize: icons["me"].size},
		title: username,
	});
	marker.setMap(map);
		
	infowindow = new google.maps.InfoWindow();

	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(marker.title);
		infowindow.open(map, marker);
	});
}