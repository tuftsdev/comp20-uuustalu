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
		icon: "me_icon.png"
	},
	"driver": {
		icon: "driver_icon.png"
	},
	"passenger": {
		icon: "passenger_icon.png"
	}
};

var me;
var map;
var marker;
var infowindow;




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
		icon: icons["me"].icon,
		title: username,
	});
	marker.setMap(map);
		
	infowindow = new google.maps.InfoWindow();

	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(marker.title);
		infowindow.open(map, marker);
	});
}