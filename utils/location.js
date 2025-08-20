const axios = require('axios');
const HttpError = require('../models/http-error');

const API_KEY = process.env.GOOGLE_API_KEY;

async function getCoordsForAddress(address) {
  const encodedAddress = encodeURIComponent(address);

  let response;
  try {
    response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${API_KEY}`
    );
  } catch (err) {
    throw new HttpError('Geocoding request failed, check your network or API key.', 500);
  }

  const data = response.data;

  if (!data || data.status === 'ZERO_RESULTS') {
    throw new HttpError('Could not find location for the specified address.', 422);
  }

  if (data.status !== 'OK') {
    throw new HttpError(`Geocoding failed with status: ${data.status}`, 500);
  }

  const coordinates = data.results[0].geometry.location;
  return coordinates; // { lat, lng }
}

module.exports = getCoordsForAddress;