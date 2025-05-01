

// let lat = 12.9662976
// let lng = 80.232448
const APIkey = '2423e8f74b51c26ca520d03d6fbf8223'

async function getCoordinatesFromCity(cityName) {
  // Using OpenStreetMap's Nominatim API (no API key required, but has usage limitations)
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}`;

  try {
    const response = await fetch(url, {
      headers: {
        // Including a referrer and user-agent is good practice for Nominatim
        'User-Agent': 'YourAppName (your@email.com)'
      }
    });
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    } else {
      
      document.getElementById("search-updates").innerText = "Enter valid City name"
    }
  } catch (error) {
    console.error('Error getting coordinates:', error);
    throw error;
  }
}


async function getcityfromcoords(latitude,longitude){
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
  const headers = {
    "User-Agent": "YourAppName/1.0"
  };

  try {
    // Make the request
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Parse the JSON response
    const data = await response.json();
    
    // Extract city and state from the address
    const address = data.address || {};
    console.log(address)
    // City could be in different fields depending on the location
    const city = address.city || address.town || address.village || address.hamlet || address.state_district;
    
    // State/province is usually in 'state' field in US, but might be in 'county' elsewhere
    const state = address.state || address.province;
    
    return {
      city,
      state
    };
  } catch (error) {
    console.error("Error getting location data:", error);
    return null;
  }


}


function changeElements(temp,feelsLike,mintemp,maxtemp,humidity,windspeed,desp){
  document.getElementById("temp-value").innerText = temp+'°';
  document.getElementById("feels-like-temp").innerText = feelsLike+'°';
  document.getElementById("min-temp-value").innerText = mintemp
  document.getElementById("max-temp-value").innerText = maxtemp
  document.getElementById("hum-value").innerText = humidity + "%"
  document.getElementById("ws-value").innerText = windspeed + " m/s"
  document.getElementById("weather-desp").innerText = desp

} 

async function fetchfromapi(lat,lng){
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${APIkey}`);
  const data = await response.json()
  
  const temp = Math.round(data.main.temp - 273.15)
  const feelsLike = Math.round(data.main.feels_like - 273.15)
  const maxtemp = Math.round(data.main.temp_max - 273.15)
  const mintemp = Math.round(data.main.temp_min - 273.15)
  const humidity = data.main.humidity
  const windspeed = data.wind.speed
  const desp = data.weather[0].description
  console.log(data)
  changeElements(temp,feelsLike,mintemp,maxtemp,humidity,windspeed,desp)

}

//to get user location
async function getLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        }
      );
    }
  });
}
async function main(){
  try {
  
    const coords = await getLocation();
    const cityname = await getcityfromcoords(coords.lat, coords.lng);
    
    console.log(cityname.city);
    document.getElementById("city-value").innerText = cityname.city;
    document.getElementById("state-name").innerText = ", " + cityname.state;
    fetchfromapi(coords.lat,coords.lng)
  } catch (error) {
    console.error("Error getting location:", error.message);
  }
  
  

  
}

main()


async function handleSubmit(){
  try{
    input = document.getElementById("input");
  const city = input.value
  const coords = await getCoordinatesFromCity(city)
  const cityname = await getcityfromcoords(coords.lat, coords.lng);
    
    console.log(cityname.city);
    document.getElementById("city-value").innerText = city.replace(/^./, char => char.toUpperCase());
    document.getElementById("state-name").innerText = ", " + cityname.state;
    document.getElementById("search-updates").innerText = "Weather Details Updated"
    fetchfromapi(coords.lat,coords.lng)
  }
  catch(error){
    console.log(error)
  }
  
  
}