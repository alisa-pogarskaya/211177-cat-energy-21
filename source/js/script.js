// Slider

var rangeSlider = document.querySelector(".slider-range__range");
var sliderItemBefore = document.querySelector(".slider-range__item--before");
function moveSlider() {
  sliderItemBefore.style.width = rangeSlider.value + "%";
}

// Map Google

let map;
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: {lat: 59.93935602371328, lng: 30.31804776084020},
    zoom: 16,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  });
  // Marker - style
  var markerContacts = new google.maps.Marker({
    position: {lat: 59.938764851017694, lng: 30.32305812734798},
    map: map,
    title: "Пункт",
    icon: "../img/map-pin.svg"
  });
}
