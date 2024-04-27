// List of API URLs
const izbbUrlList = {
    nobetciEczane: "https://openapi.izmir.bel.tr/api/ibb/nobetcieczaneler",
    hastane: "https://openapi.izmir.bel.tr/api/ibb/cbs/hastaneler",
    disHastane: "https://openapi.izmir.bel.tr/api/ibb/cbs/agizvedissagligimerkezleri",
};

// Asynchronous function to fetch data from an API
const getApiList = async (url) => {
    const requestOptions = {
        method: 'GET',
        redirect: 'follow',
    };

    try {
        const response = await fetch(url, requestOptions);
        return await response.json(); // Return the fetched data as JSON
    } catch (error) {
        return undefined; // Return undefined in case of error
    }
};

// Function to calculate the Haversine distance in kilometers
const distanceInKm = (lat1, lon1, lat2, lon2) => {
    const toRad = (degree) => (degree * Math.PI) / 180;
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
};

// Function to get the nearest locations
const getNearestLocations = (refLat, refLon, nearestNum, locations, latKey, lonKey) => {
    locations.forEach((location) => {
        const lat = parseFloat(location[latKey]);
        const lon = parseFloat(location[lonKey]);
        location.UzaklikMetre = distanceInKm(refLat, refLon, lat, lon) * 1000; // Convert to meters
    });

    // Sort by distance and return the nearest specified number of locations
    locations.sort((a, b) => (a.UzaklikMetre || 0) - (b.UzaklikMetre || 0));
    return locations.slice(0, nearestNum); // Get the specified number of nearest locations
};

module.exports = {
    getApiList,
    izbbUrlList,
    getNearestLocations,
    distanceInKm,
};
