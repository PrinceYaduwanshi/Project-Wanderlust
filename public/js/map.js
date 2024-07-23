    let mapToken = map_Token;
    console.log(mapToken);
    mapboxgl.accessToken= mapToken;
    const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: listing.geometry.coordinates, //[longitude and latitude]
    zoom: 10
});

console.log(listing.geometry.coordinates);

const marker1 = new mapboxgl.Marker({ color: 'red'})
        .setLngLat(listing.geometry.coordinates)
        .setPopup( new mapboxgl.Popup({offset: 25}).setHTML("<h5>A very cool place for you to enjoy</h5>"))
        .addTo(map);