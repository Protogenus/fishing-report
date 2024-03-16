const apiKey = '0d7d774a81404c19b6160255241603'; // Your WeatherAPI.com API key

const locationInput = document.getElementById('locationInput');
const searchButton = document.getElementById('searchButton');
const locationElement = document.getElementById('location');
const temperatureElement = document.getElementById('temperature');
const descriptionElement = document.getElementById('description');
const windSpeedElement = document.getElementById('windSpeed');
const seasonElement = document.getElementById('season');
const fishingTipsElement = document.getElementById('fishingTips');

searchButton.addEventListener('click', () => {
    const location = locationInput.value;
    if (location) {
        fetchWeatherForecast(location);
    }
});

function getSeason() {
    const month = new Date().getMonth();
    const day = new Date().getDate();
    let season;

    if (month <= 2 && day <= 20) { // Up to 20th March
        season = "Winter";
    } else if (month <= 5 && day <= 5) { // Up to 5th June
        season = "Spring";
    } else if (month <= 8 && day <= 22) { // Up to 22nd September
        season = "Summer";
    } else { // From 23rd September to 20th March
        season = "Autumn";
    }

    return season;
}

function getFishingTips(season, temperature, windSpeed, weatherDescription) {
    let tips = '';

    // Existing tips based on season and wind speed
    if (season === 'Winter') {
        tips = "Fish deeper in the winter. Use jigging spoons, tail spinners, and football jigs for probing deep in clear or dirty water. Suspended bass can be tricked into biting with jerkbaits, small swimbaits, and Alabama rigs fitted with swimbaits.";
    } else if (season === 'Summer') {
        tips = "Fish shallow in the summer. Use a Texas-rigged plastic worm for bass lounging along points and ledges. If the day is hot, try fishing at night. Deep-diving crankbaits and Carolina-rigged plastic worms are effective for bass feeding along offshore humps, ledges, and main lake points.";
    } else if (season === 'Autumn') {
        tips = "Fish in shallow flats and bays as water temperatures drop. Use squarebill crankbaits, spinnerbaits, buzz baits, and topwater ploppers for aggressive bass. Target log laydowns, stumps, boat docks, and isolated weed patches.";
    } else if (season === 'Spring') {
        tips = "Pay attention to what works for you and what does not. Fish out the area and pay attention to water conditions. Watch for birds diving to catch dying baitfish. Use the wind to your advantage on clear days.";
    }

    // Additional tips based on wind speed
    if (windSpeed >= 0 && windSpeed <= 4) {
        tips += " Very low wind today, perfect for all bait types.";
    } else if (windSpeed >= 5 && windSpeed <= 10) {
        tips += " Small bit of wind today so you may want to use a slightly heavier bait or weight.";
    } else if (windSpeed >= 16 && windSpeed <= 50) {
        tips += " With winds in excess of 15MPH it is going to be a very tough day fishing. Be safe.";
    }

    // New tip based on weather description and temperature
    if (weatherDescription.includes('cloudy') && temperature >= 65 && temperature <= 80) {
        tips += " Warm and cloudy days mean bass leave cover and become very aggressive in the shallows.";
    }

    return tips;
}

async function fetchWeatherForecast(location) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&units=imperial`);
        const data = await response.json();

        if (data.error) {
            console.error('Error fetching weather data:', data.error.message);
            return;
        }

        locationElement.textContent = `Location: ${data.location.name}, ${data.location.region}, ${data.location.country}`;
        temperatureElement.textContent = `Temperature: ${data.current.temp_f}°F`; // Converted to Fahrenheit
        descriptionElement.textContent = `Description: ${data.current.condition.text}`;
        windSpeedElement.textContent = `Wind Speed: ${data.current.wind_mph} mph`; // Converted to mph
        
        // Display the current season
        seasonElement.textContent = `Season: ${getSeason()}`;
        
        // Display fishing tips based on the current season, temperature, wind speed, and weather description
        fishingTipsElement.textContent = `Fishing Tips: ${getFishingTips(getSeason(), data.current.temp_f, data.current.wind_mph, data.current.condition.text)}`;
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

document.getElementById('submitWaterTemp').addEventListener('click', function() {
    var waterTemp = parseFloat(document.getElementById('waterTemp').value);
    if (isNaN(waterTemp)) {
        alert("You must enter a number!");
        return false;
    }

    var messageElement = document.getElementById('waterTempMessage');
    if (waterTemp >= 65 && waterTemp <= 80) {
        messageElement.textContent = "Water temps are perfect for Largemouth. You are more likely to get a strike anywhere from 6FT deep to top water.";
    } else if (waterTemp >= 1 && waterTemp <= 63) {
        messageElement.textContent = "Water temps are cold. You will need to adjust your gear to fish deeper in the warmer water column.";
    } else {
        messageElement.textContent = "Please enter a temperature between 30-80F.";
    }
});
