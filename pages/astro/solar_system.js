import axios from 'axios';
import {
	sign_names,
	DEG_TO_RAD,
	RAD_TO_DEG,
	JD_J2000,
	solarSystem
} from './system_map_data';

export function getJulianDate(date) {
	const year = date.getFullYear();
	const month = date.getMonth();
	const day = date.getDate();
	const hour = date.getUTCHours();
	const minute = date.getUTCMinutes();
	const second = date.getUTCSeconds();
	const millisecond = date.getUTCMilliseconds();

	const a = Math.floor((14 - month) / 12);
	const y = year + 4800 - a;
	const m = month + 12 * a - 3;

	const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

	const jd = jdn + (hour - 12) / 24 + minute / 1440 + second / 86400 + millisecond / 86400000;

	return jd;
}

export function calculateEccentricAnomaly(M, e) {
	const MAX_ITERATIONS = 1000; // Maximum number of iterations to prevent infinite loop
	const TOLERANCE = 1e-12; // Tolerance for convergence
	let E = M; // Initial guess for eccentric anomaly
	// Iterate until convergence or maximum number of iterations reached
	for (let i = 0; i < MAX_ITERATIONS; i++) {
		const deltaM = M - (E - e * Math.sin(E)); // Change in mean anomaly
		const deltaE = deltaM / (1 - e * Math.cos(E)); // Change in eccentric anomaly
		E += deltaE; // Update eccentric anomaly
		// Check for convergence
		if (Math.abs(deltaE) < TOLERANCE) {
			break;
		}
	}
	return E;
}


export function orbitalPosition(planet, t) {
	const oEl = planet.orbitalElements(t);
	const w = oEl.w * DEG_TO_RAD;
	const i = oEl.i * DEG_TO_RAD;
	const omega = oEl.Omega * DEG_TO_RAD;

	// Calculate mean anomaly and eccentric anomaly
	const M = oEl.L - w;
	const E = calculateEccentricAnomaly(M, oEl.e);

	// Calculate heliocentric coordinates in the plane of the ecliptic
	const x1 = oEl.a * (Math.cos(E) - oEl.e);
	const y1 = oEl.a * Math.sqrt(1 - oEl.e * oEl.e) * Math.sin(E);
	const z1 = 0;

	// Rotate the coordinates to the ecliptic plane
	const x2 = x1 * (Math.cos(omega) * Math.cos(w) - Math.sin(omega) * Math.sin(w) * Math.cos(i)) 
			 + y1 * (-Math.sin(omega) * Math.cos(w) - Math.cos(omega) * Math.sin(w) * Math.cos(i))
			 + z1 * (Math.sin(w) * Math.sin(i));
	const y2 = x1 * (Math.cos(omega) * Math.sin(w) + Math.sin(omega) * Math.cos(w) * Math.cos(i)) 
			 + y1 * (-Math.sin(omega) * Math.sin(w) + Math.cos(omega) * Math.cos(w) * Math.cos(i))
			 + z1 * (-Math.cos(w) * Math.sin(i));
	const z2 = x1 * (Math.sin(omega) * Math.sin(i)) 
			 + y1 * (Math.cos(omega) * Math.sin(i))
			 + z1 * (Math.cos(i));

	// Update planet object with the calculated position
	return {x:x2, y:z2, z:y2};
  }

function getPlanets(system) {
	// console.log(system)
	const JD = system['sun'].raw.position.date.julian
	Object.keys(solarSystem).forEach((name) => {
		const planet = system[name];
		const t = (JD - JD_J2000) / 36525.0;

		solarSystem[name].position = orbitalPosition(solarSystem[name], t)//.negate();

		if (solarSystem[name].astroBodies) {
			solarSystem[name].astroBodies.map((moon, index) => {
				solarSystem[name].astroBodies[index].position = orbitalPosition(moon, t)//.negate();
			})
		}
		if (!planet) { return }
		solarSystem[name].zodiac = getZodiac(planet)
	});
	return solarSystem;
}


function getZodiac(planet) {
	let longitude = 0
	if (!planet) return null
	
	if (!planet.raw?.position?.apparentGeocentric) {
		longitude = planet.apparentLongitudeDd
		if(planet.astroBodies) planet.astroBodies.map((moon, index) => {
			solarSystem[planet.name].astroBodies[index].zodiac = getZodiac(moon)
		})
		console.log(planet)
	} else {
		longitude = planet.raw.position.apparentGeocentric.longitude * RAD_TO_DEG
	}
	return sign_names[Math.floor((longitude % 360) / 30)]
}

function calculateAscendingSign(latitude, longitude, time) {

    let jd = getJulianDate(time);
    let t = (jd - JD_J2000) / 36525;
    let L = 280.460 + 36000.772 * t;
    let g = 357.528 + 35999.050 * t;
    let lambda = L + 1.915 * Math.sin(g * DEG_TO_RAD) + 0.020 * Math.sin(2 * g * DEG_TO_RAD);
    let epsilon = 23.439 - 0.013 * t;
    let delta = Math.asin(Math.sin(epsilon * DEG_TO_RAD) * Math.sin(lambda * DEG_TO_RAD));
    let theta = Math.atan2(Math.cos(epsilon * DEG_TO_RAD) * Math.sin(lambda * DEG_TO_RAD), Math.cos(lambda * DEG_TO_RAD));
    let ascension = theta / DEG_TO_RAD;
    let ascension_degrees = Math.floor(ascension);
    // let ascension_sign_longitude = longitude + ascension_sign_longitude_offsets[ascension_sign];
    let ascension_sign = sign_names.at(Math.floor((ascension_degrees+(longitude * RAD_TO_DEG)) / 30));
	// console.log(ascension, ascension_degrees, ascension_sign)
    return(ascension_sign)
}

// function calculateAscendingSign(birthDate, birthTime, latitude, longitude) {
// 	// Convert birthDate to UTC format
// 	const utcBirthDate = new Date(birthDate.toUTCString());
  
// 	// Set the time portion of utcBirthDate based on birthTime
// 	const [hours, minutes] = birthTime.split(':');
// 	utcBirthDate.setUTCHours(Number(hours));
// 	utcBirthDate.setUTCMinutes(Number(minutes));
  
// 	// Convert latitude and longitude to radians
// 	const latRad = latitude * Math.PI / 180;
// 	const lonRad = longitude * Math.PI / 180;
  
// 	// Calculate Julian Day (JD)
// 	const JD = getJulianDate(utcBirthDate);
  
// 	// Calculate Julian centuries since J2000.0
// 	const T = (JD - JD_J2000) / 36525.0;
  
// 	// Calculate Sidereal Time at Greenwich (GST)
// 	const GST = 280.46061837 + 360.98564736629 * (JD - JD_J2000) + 0.000387933 * T * T - (T * T * T) / 38710000.0;
  
// 	// Calculate Local Sidereal Time (LST)
// 	const LST = GST + (RAD_TO_DEG * lonRad);
  
// 	// Calculate the sidereal hour angle (SHA)
// 	const SHA = LST - 360 * Math.floor(LST / 360);
  
// 	// Calculate the Ascendant degree
// 	const ASC = Math.atan2(Math.sin(SHA * DEG_TO_RAD), Math.cos(SHA * DEG_TO_RAD) * Math.sin(latRad) - Math.tan(0 * DEG_TO_RAD) * Math.cos(latRad));
// 	let ascendant = ASC * RAD_TO_DEG;
  
// 	// Ensure ascendant is within the range of 0 to 360 degrees
// 	if (ascendant < 0) {
// 	  ascendant += 360;
// 	}
  
// 	// Calculate the Ascendant sign
// 	const signNames = [
// 	  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
// 	  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
// 	];
// 	const ascendingSignIndex = Math.floor(ascendant / 30);
// 	const ascendingSign = signNames[ascendingSignIndex];
  
// 	return ascendingSign;
// }
  

export default async function getUniverse(params) {
	let planets = {}
	await axios.post('http://localhost:3333/api/planets', {
		params: params,
		headers: { 'content': 'application/json' }
	}).then((result) => {
		// console.log(result.data)
		var _earth = result.data.observer
		_earth.astroBodies = [result.data.observed.moon]
		planets = getPlanets({ ...result.data.observed, earth: _earth })
		console.log(planets)
	}).catch((err) => {
		console.log(err)
	})


	const birthDate = new Date('2003-10-21');
	const birthTime = '17:00';
	
	// const ascendingSign = calculateAscendingSign(birthDate, birthTime, params.latitude, params.longitude);
	const ascendingSign = calculateAscendingSign(params.latitude, params.longitude, params.date);
	console.log('Ascending Sign:', ascendingSign);
	return planets
}