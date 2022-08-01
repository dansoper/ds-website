// @ts-check

const { authorize } = require('railway-spreadsheet/auth');
const { getStationCoordsFromSheet } = require('railway-spreadsheet/stations');
const { getStationTripsFromSheet } = require('railway-spreadsheet/journeys');

const SPREADSHEET_ID = process.env.GOOGLE_RAILWAY_SPREADSHEET_ID;
const CREDENTIALS = JSON.parse(process.env.GOOGLE_RAILWAY_CREDENTIALS);
const TOKEN = JSON.parse(process.env.GOOGLE_RAILWAY_TOKEN);
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

module.exports = async function () {
  var auth = await authorize(CREDENTIALS, TOKEN, SCOPES, true);
  const stations = await getStationCoordsFromSheet(auth, SPREADSHEET_ID, 'Stations!A2:G');
  const trips = await getStationTripsFromSheet(auth, SPREADSHEET_ID, 'Actual Record!A1:F', stations);
  return { stations, trips };
}