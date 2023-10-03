// Constants
const sign_names = ["aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"];
const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;
const JD_J2000 = 2451545;


var solarSystem = {
	sun: {
		radius: 695000, //in kilometers
		color: "#FDB813", //aproximate planet color in hexadecimal
		orbitalElements: (t) => {
			return { a: 0, e: 0, i: 0, L: 0, w: 0, N: 0, Omega: 0 }
		}
	},
	mercury: {
		radius: 2439.7, //in kilometers
		color: "#B8B8B8", //aproximate planet color in hexadecimal
		orbitalElements: (t) => {
			return {
				a: 0.387098,
				e: 0.205635 + 0.000019 * t,
				i: 7.005591 + 0.001239 * t,
				L: 252.251667 + 149472.674866 * t,
				w: 77.457718 + 0.160317 * t,
				N: 48.3313 + 3.24587E-5 * (t - JD_J2000),
				Omega: 48.330930 - 0.125422 * t,
			}
		}
	},
	venus: {
		radius: 6.052,
		color: "#D4AF37",
		orbitalElements: (t) => {
			return {
				a: 0.723332,
				e: 0.006773 - 0.000049 * t,
				i: 3.394662 + 0.000856 * t,
				L: 181.979708 + 58517.815602 * t,
				w: 131.767557 + 0.056796 * t,
				N: 76.6799 + 2.46590E-5 * (t - JD_J2000),
				Omega: 76.672614 - 0.272741 * t
			}
		}
	},
	earth: {
		radius: 6371.0088,
		color: "#2E64FE",
		orbitalElements: (t) => {
			return {
				a: 1.00000011,
				e: 0.01671022 - 0.00003804 * t,
				i: 0.00005 - 0.01294668 * Math.cos(100.46435 + 0.9856091 * t),
				L: 100.46435 + 35999.37285 * t,
				w: 102.94719 + 0.32327364 * t,
				N: 0,
				Omega: -11.26064 - 0.00000144 * t,
			}
		},
		astroBodies: [
			{
				name: 'Moon',
				radius: 1737.5,
				color: "#D4D4D4",
				distance:384400,
				orbitalElements: (t) => {
					return {
						a: 384400, // Semi-major axis (km)
						e: 0.0549, // Eccentricity
						i: 5.145 * DEG_TO_RAD, // Inclination (radians)
						L: 318.15 + 13.176396 * (t - JD_J2000) * DEG_TO_RAD, // Mean longitude (radians)
						w: 0.0, // Argument of perigee (radians)
						N: 125.1228 - 0.0529538083 * (t - JD_J2000),
						Omega: 125.08 * DEG_TO_RAD // Longitude of ascending node (radians)
					}
				}
			},
		]
	},
	mars: {
		radius: 3390,
		color: "#FF5733",
		orbitalElements: (t) => {
			return {
				a: 1.523679,
				e: 0.09340062 + 0.00009048 * t,
				i: 1.850333 - 0.0076087 * t,
				L: -4.553432 + 19140.30268 * t,
				w: -23.943629 + 0.4444109 * t,
				N: 49.5574 + 2.11081E-5 * (t - JD_J2000),
				Omega: 49.559538 - 0.2925737 * t,
			}
		},
		astroBodies: [
			{
				name: 'Phobos',
				radius: 11.2667,
				color: "#D4D4D4",
				distance:6000,
				orbitalElements: (t) => {
					return {
						a: 6000.2, // Semi-major axis (km)
						e: 0.0151, // Eccentricity
						i: 1.0933 * DEG_TO_RAD, // Inclination (radians)
						L: 343.4755 + 0.00015 * (t - JD_J2000), // Mean longitude (radians)
						w: 150.0573 * DEG_TO_RAD, // Argument of perigee (radians)
						N: 49.562 * DEG_TO_RAD, // Longitude of ascending node (radians)
						Omega: 0 // not applicable for satellites
					}
				}
			},
			{
				name: 'Deimos',
				radius: 6.2,
				color: "#D4D4D4",
				distance:23460,
				orbitalElements: (t) => {
					return {
						a: 23460, // Semi-major axis (km)
						e: 0.0002, // Eccentricity
						i: 1.79 * DEG_TO_RAD, // Inclination (radians)
						L: 260.7293 + 0.00033 * (t - JD_J2000), // Mean longitude (radians)
						w: 260.0 * DEG_TO_RAD, // Argument of perigee (radians)
						N: 49.563 * DEG_TO_RAD, // Longitude of ascending node (radians)
						Omega: 0 // not applicable for satellites
					}
				}
			}
		]
	},
	jupiter: {
		radius: 69911,
		color: "#F5DEB3",
		orbitalElements: (t) => {
			return {
				a: 5.2026,
				e: 0.04849 + 0.000163225 * t,
				i: 1.3053 - 0.0019877 * t,
				L: 34.396440 + 3034.74677 * t,
				w: 14.728479 + 0.2125267 * t,
				N: 100.4542 + 2.76854E-5 * (t - JD_J2000),
				Omega: 100.473909 + 0.2046917 * t,
			}
		},
		astroBodies: [
			{
				name: "Io",
				radius: 1821.6, // km
				color: "#BFBFBF",
				distance:422000,
				orbitalElements: (t) => {
					return {
						a: 421700, // km
						e: 0.0041,
						i: 0.036,
						L: 42.8 + 203489.0 * t,
						w: 84.1 + 101.374724 * t,
						N: 43.977 + 0.0003519 * (t - JD_J2000),
						Omega: 43.977 + 0.0003519 * (t - JD_J2000),
					};
				},
			},
			{
				name: "Europa",
				radius: 1560.8, // km
				color: "#F2F2F2",
				distance:670900,
				orbitalElements: (t) => {
					return {
						a: 671100, // km
						e: 0.0094,
						i: 0.466,
						L: 219.106 + 101.37441 * t,
						w: 172.8288 + 0.37060115 * t,
						N: 219.106 + 0.0003081 * (t - JD_J2000),
						Omega: 219.106 + 0.0003081 * (t - JD_J2000),
					};
				},
			},
			{
				name: "Ganymede",
				radius: 2631.2, // km
				color: "#D4D4D4",
				distance:1070000,
				orbitalElements: (t) => {
					return {
						a: 1070400, // km
						e: 0.0013,
						i: 0.177,
						L: 63.552 + 50.317609 * t,
						w: 53.717 + 0.508728 * t,
						N: 192.417 + 0.001240 * (t - JD_J2000),
						Omega: 192.417 + 0.001240 * (t - JD_J2000),
					};
				},
			},
			{
				name: "Callisto",
				radius: 2410.3, // km
				color: "#A9A9A9",
				distance:1883000,
				orbitalElements: (t) => {
					return {
						a: 1882700, // km
						e: 0.0074,
						i: 0.192,
						L: 317.681 + 21.571071 * t,
						w: 52.643 + 0.184768 * t,
						N: 52.643 + 0.021 * (t - JD_J2000),
						Omega: 74.0059 + 0.005944 * t,
					};
				},
			},
		]
	},
	saturn: {
		radius: 58232,
		color: "#F4A460",
		orbitalElements: (t) => {
			return {
				a: 9.53707032,
				e: 0.05550825 - 0.00034682 * t,
				i: 2.48446 + 0.00451969 * t,
				L: 50.07571329 + 1223.50799947 * t,
				w: 92.86136063 + 0.00025899 * t,
				N: 113.6634 + 2.38980E-5 * (t - JD_J2000),
				Omega: 113.63998702 - 0.00013253 * t,
			}
		},
		astroBodies: [
			{
				name: 'Mimas',
				radius: 198.2,
				color: "#D4D4D4",
				orbitalElements: (t) => {
					return {
						a: 185.5395,
						e: 0.0196,
						i: 1.5747,
						L: 176.630 + 0.6623 * t,
						w: 70.987 + 0.9121 * t,
						N: 40.589 - 0.0013 * t,
						Omega: 38.834
					}
				}
			},
			{
				name: 'Enceladus',
				radius: 252.1,
				color: "#D4D4D4",
				orbitalElements: (t) => {
					return {
						a: 238.037,
						e: 0.0047,
						i: 0.0196,
						L: 342.845 + 0.0366 * t,
						w: 227.133 + 0.0019 * t,
						N: 348.739 + 0.0001 * t,
						Omega: 38.833
					}
				}
			},
			{
				name: 'Tethys',
				radius: 531.1,
				color: "#D4D4D4",
				orbitalElements: (t) => {
					return {
						a: 294.619,
						e: 0.0001,
						i: 1.0918,
						L: 259.373 + 0.6442 * t,
						w: 280.604 + 0.0097 * t,
						N: 168.692 + 0.0013 * t,
						Omega: 38.835
					}
				}
			},
			{
				name: 'Dione',
				radius: 561.7,
				color: "#D4D4D4",
				orbitalElements: (t) => {
					return {
						a: 377.396,
						e: 0.0022,
						i: 0.0288,
						L: 232.740 + 0.6072 * t,
						w: 178.719 + 0.0027 * t,
						N: 169.942 + 0.0025 * t,
						Omega: 38.834
					}
				}
			},
			{
				name: 'Rhea',
				radius: 763.8,
				color: "#D4D4D4",
				orbitalElements: (t) => {
					return {
						a: 527108, // Semi-major axis (km)
						e: 0.001258, // Eccentricity
						i: 0.345 * DEG_TO_RAD, // Inclination (radians)
						L: 171.51 + 0.001965 * (t - JD_J2000), // Mean longitude (radians)
						w: 0.0, // Argument of perigee (radians)
						N: 39.6945 - 0.000968435 * (t - JD_J2000), // Longitude of ascending node (radians)
						Omega: 95.3567 // Longitude of ascending node (radians)
					}
				}
			},
			{
				name: 'Titan',
				radius: 2575,
				color: "#8B4513",
				orbitalElements: (t) => {
					return {
						a: 1221870, // Semi-major axis (km)
						e: 0.0288, // Eccentricity
						i: 0.28 * DEG_TO_RAD, // Inclination (radians)
						L: 261.49 + 22.576978 * (t - JD_J2000) * DEG_TO_RAD, // Mean longitude (radians)
						w: 0.0, // Argument of perigee (radians)
						N: 169.50847 + 0.002 * (t - JD_J2000),
						Omega: 28.06 * DEG_TO_RAD // Longitude of ascending node (radians)
					}
				}
			},
			{
				name: 'Iapetus',
				radius: 734.5,
				color: "#8B4513",
				orbitalElements: (t) => {
					return {
						a: 3560820, // Semi-major axis (km)
						e: 0.0295, // Eccentricity
						i: 15.47 * DEG_TO_RAD, // Inclination (radians)
						L: 272.39 + 6.55491 * (t - JD_J2000) * DEG_TO_RAD, // Mean longitude (radians)
						w: 0.0, // Argument of perigee (radians)
						N: 78.46 + 0.002 * (t - JD_J2000),
						Omega: 15.88 * DEG_TO_RAD // Longitude of ascending node (radians)
					}
				}
			}
		]
	},
	uranus: {
		radius: 25362,
		color: "#00FFFF",
		orbitalElements: (t) => {
			return {
				a: 19.21814 - 0.0000000372 * t,
				e: 0.046381 + 0.000027 * t - 0.0000000943 * t * t,
				i: 0.772464 - 0.001801 * t + 0.0000003337 * t * t,
				L: 314.055005 + 429.8640561 * t + 0.00030390 * t * t + 0.0000000262 * t * t * t,
				w: 96.541318 - 0.000597 * t + 0.0000000981 * t * t,
				N: 74.0005 + 1.3978E-5 * (t - JD_J2000),
				Omega: 171.548692 + 0.0000009083 * t - 0.0000000024 * t * t,
			}
		},
		astroBodies: [
			{
				name: 'Miranda',
				radius: 235.8,
				color: "#D4D4D4",
				orbitalElements: (t) => {
					return {
						a: 129.390, // Semi-major axis (km)
						e: 0.0013, // Eccentricity
						i: 4.3388 * DEG_TO_RAD, // Inclination (radians)
						L: 326.438 + 1.413820 * (t - JD_J2000) * DEG_TO_RAD, // Mean longitude (radians)
						w: 107.097 * DEG_TO_RAD, // Argument of perigee (radians)
						N: 169.51 * DEG_TO_RAD, // Longitude of ascending node (radians)
						Omega: 0.0, // Not applicable
					}
				}
			},
			{
				name: 'Ariel',
				radius: 578.9,
				color: "#D4D4D4",
				orbitalElements: (t) => {
					return {
						a: 190.900, // Semi-major axis (km)
						e: 0.0012, // Eccentricity
						i: 0.0410 * DEG_TO_RAD, // Inclination (radians)
						L: 142.955 + 0.001041 * (t - JD_J2000) * DEG_TO_RAD, // Mean longitude (radians)
						w: 260.630 * DEG_TO_RAD, // Argument of perigee (radians)
						N: 260.68 * DEG_TO_RAD, // Longitude of ascending node (radians)
						Omega: 0.0, // Not applicable
					}
				}
			},
			{
				name: 'Umbriel',
				radius: 584.7,
				color: "#D4D4D4",
				orbitalElements: (t) => {
					return {
						a: 266.000, // Semi-major axis (km)
						e: 0.0039, // Eccentricity
						i: 0.1287 * DEG_TO_RAD, // Inclination (radians)
						L: 74.499 + 3.019766 * (t - JD_J2000), // Mean longitude (radians)
						w: 274.192, // Argument of perigee (radians)
						N: 96.998857, // Longitude of ascending node (radians)
						Omega: 360 - 90.0 // Mean longitude at epoch (radians)
					}
				}
			},
			{
				name: 'Titania',
				radius: 788.9,
				color: "#D4D4D4",
				orbitalElements: (t) => {
					return {
						a: [435, 840], // Semi-major axis (km)
						e: 0.0011, // Eccentricity
						i: 0.0796 * DEG_TO_RAD, // Inclination (radians)
						L: 49.949 + 0.03657 * (t - JD_J2000), // Mean longitude (radians)
						w: 284.990, // Argument of perigee (radians)
						N: 286.3069, // Longitude of ascending node (radians)
						Omega: 360 - 9.0 // Mean longitude at epoch (radians)
					}
				}
			},
			{
				name: 'Oberon',
				radius: 761.4,
				color: "#D4D4D4",
				orbitalElements: (t) => {
					return {
						a: [583, 520], // Semi-major axis (km)
						e: 0.0014, // Eccentricity
						i: 0.0683 * DEG_TO_RAD, // Inclination (radians)
						L: 202.972 + 0.00115 * (t - JD_J2000), // Mean longitude (radians)
						w: 104.978, // Argument of perigee (radians)
						N: 282.9438, // Longitude of ascending node (radians)
						Omega: 360 - 94.0 // Mean longitude at epoch (radians)
					}
				}
			}
		]
	},
	neptune: {
		radius: 24622,
		color: "#000080",
		orbitalElements: (t) => {
			return {
				a: 30.06992276,
				e: 0.00858587 + 0.00000031 * t,
				i: 1.76995259 - 0.00005105 * t,
				L: 304.22289287 + 218.46515314 * t,
				w: 131.78405702 - 0.00616564 * t,
				N: 131.78422574 - 0.00268329 * t,
				Omega: 260.2045 + 0.005995147 * (t - JD_J2000),
			};
		},
		astroBodies: [
			{
				name: 'Triton',
				radius: 1353.4,
				color: "#A0A0A0",
				orbitalElements: (t) => {
					return {
						a: 354759, // Semi-major axis (km)
						e: 0.000016, // Eccentricity
						i: 156.885 * DEG_TO_RAD, // Inclination (radians)
						L: 207.1977 + 129.1099 * t * DEG_TO_RAD, // Mean longitude (radians)
						w: 44.96476227 + 0.00891918 * t, // Argument of perigee (radians)
						N: 0, // Longitude of ascending node (radians)
						Omega: 0 // Longitude of ascending node (radians)
					}
				}
			},
			{
				name: 'Proteus',
				radius: 210,
				color: "#D3D3D3",
				orbitalElements: (t) => {
					return {
						a: 117647, // Semi-major axis (km)
						e: 0.00052, // Eccentricity
						i: 0.524 * DEG_TO_RAD, // Inclination (radians)
						L: 316.61 + 0.595 * t * DEG_TO_RAD, // Mean longitude (radians)
						w: 336.538 * DEG_TO_RAD, // Argument of perigee (radians)
						N: 0, // Longitude of ascending node (radians)
						Omega: 0 // Longitude of ascending node (radians)
					}
				}
			}
		]
	},

	pluto: {
		radius: 1151,
		color: "#A9A9A9",
		orbitalElements: (t) => {
			return {
				a: 39.48211675,
				e: 0.24882730 + 0.00001149 * t,
				i: 17.14001206 + 0.00000095 * t,
				L: 238.92903833 + 0.00000037 * t,
				w: 224.06891629 - 0.00000562 * t,
				N: 238.92903833 + 0.00440 * (t - JD_J2000),
				Omega: 110.30393684 - 0.00000003 * t,
			}
		},
		astroBodies: [
			{
				name: 'Charon',
				radius: 606,
				color: "#D4D4D4",
				orbitalElements: (t) => {
					return {
						a: 19591, // Semi-major axis (km)
						e: 0.0002, // Eccentricity
						i: 0.0, // Inclination (radians)
						L: 0.0, // Mean longitude (radians)
						w: 113.7548, // Argument of perigee (radians)
						N: 0.0, // Longitude of ascending node (radians)
						Omega: 0.0 // Longitude of ascending node (radians)
					}
				}
			},
			{
				name: 'Nix',
				radius: 25,
				color: "#D4D4D4",
				orbitalElements: (t) => {
					return {
						a: 48694, // Semi-major axis (km)
						e: 0.002, // Eccentricity
						i: 0.195, // Inclination (radians)
						L: 84.4, // Mean longitude (radians)
						w: 0.0, // Argument of perigee (radians)
						N: 0.0, // Longitude of ascending node (radians)
						Omega: 0.0 // Longitude of ascending node (radians)
					}
				}
			},
			{
				name: 'Hydra',
				radius: 30,
				color: "#D4D4D4",
				orbitalElements: (t) => {
					return {
						a: 64738, // Semi-major axis (km)
						e: 0.0059, // Eccentricity
						i: 0.242, // Inclination (radians)
						L: 130.1, // Mean longitude (radians)
						w: 0.0, // Argument of perigee (radians)
						N: 0.0, // Longitude of ascending node (radians)
						Omega: 0.0 // Longitude of ascending node (radians)
					}
				}
			},
			{
				name: 'Kerberos',
				radius: 14,
				color: "#D4D4D4",
				orbitalElements: (t) => {
					return {
						a: 59092, // Semi-major axis (km)
						e: 0.0038, // Eccentricity
						i: 0.385, // Inclination (radians)
						L: 256.8, // Mean longitude (degrees)
						w: 66.8, // Argument of perigee (degrees)
						N: 224.3, // Longitude of ascending node (degrees)
						Omega: 0 // This moon is irregular and does not have a well-defined reference plane, so Omega is set to 0
					}
				}

			},
			{
				name: 'Styx',
				radius: 5,
				color: "#D4D4D4",
				orbitalElements: (t) => {
					return {
						a: 42000, // Semi-major axis (km)
						e: 0.0058, // Eccentricity
						i: 0.205, // Inclination (radians)
						L: 180.0, // Mean longitude (degrees)
						w: 239.0, // Argument of perigee (degrees)
						N: 110.0, // Longitude of ascending node (degrees)
						Omega: 0 // This moon is irregular and does not have a well-defined reference plane, so Omega is set to 0
					}
				}
			}
		]
	},
	// juno: {
	// 	type: "asteroid",
	// 	radius: 2475,
	// 	color: "#FF7F50",
	// 	orbitalElements: (t) => {
	// 		return {
	// 			a: 2.668,
	// 			e: 0.25696,
	// 			i: 0.22669 * Math.PI / 180,
	// 			L: 20.07572 + 3034.9057 * t,
	// 			w: 284.95 + 0.009118 * t,
	// 			N: 50.147,
	// 			Omega: 100.2928 - 0.03228 * t,
	// 		}
	// 	}
	// },
	// chiron: {
	// 	type: 'centaur',
	// 	radius: 218,
	// 	color: "#8B4513",
	// 	orbitalElements: (t) => {
	// 		return {
	// 			a: 13.65,
	// 			e: 0.381,
	// 			i: 6.925,
	// 			L: 209.682 + 0.0012 * t,
	// 			w: 339.767 + 0.0103 * t,
	// 			N: 209.64 + 0.00625 * (t - JD_J2000),
	// 			Omega: 203.417 - 0.0058 * t
	// 		}
	// 	}
	// },
	// ceres: {
	// 	type: 'dwarf_planet',
	// 	radius: 473,
	// 	color: "#C3B091",
	// 	orbitalElements: (t) => {
	// 		return {
	// 			a: 2.76595,
	// 			e: 0.0758239 + 0.00050991 * t + 0.00000028 * t ** 2,
	// 			i: 10.594067 + 0.0000090035 * t - 0.0000000395 * t ** 2,
	// 			L: 80.476960 + 430.864403 * t + 0.000132851 * t ** 2 - 0.0000000951 * t ** 3,
	// 			w: 73.612333 + 1.394786 * t + 0.000141180 * t ** 2 - 0.0000001954 * t ** 3,
	// 			N: 77.372096 + 1.303469 * t + 0.000270374 * t ** 2 - 0.0000000114 * t ** 3,
	// 			Omega: 80.305532 + 1.347203 * t + 0.000001389 * t ** 2 + 0.000000004 * t ** 3,
	// 		}
	// 	},
	// },
	// pallas: {
	// 	type: 'asteroid',
	// 	radius: 512,
	// 	color: "#DAA520",
	// 	orbitalElements: (t) => {
	// 		return {
	// 			a: 2.77212446,
	// 			e: 0.2311313 + 0.00002606 * t,
	// 			i: 34.83665 - 0.00508169 * t,
	// 			L: 315.37268 + 0.16435733 * t,
	// 			w: 31.09693 + 0.31923898 * t,
	// 			N: 173.09486 + 0.21090547 * t,
	// 			Omega: 173.09512 + 0.0000005 * t,
	// 		}
	// 	},
	// },
	// vesta: {
	// 	type: "planetoid",
	// 	radius: 262.7,
	// 	color: "#8B7D6B",
	// 	orbitalElements: (t) => {
	// 		return {
	// 			a: 2.3617,
	// 			e: 0.08874 + 0.0000101 * t,
	// 			i: 7.1357 - 0.001934 * t,
	// 			L: 150.3535 + 178.179078 * t,
	// 			w: 151.1982 + 0.121057 * t,
	// 			N: 110.3013 + 0.05883 * t,
	// 			Omega: 103.8101 + 0.001057 * t,
	// 		}
	// 	}
	// },
	// lilith: {
	// 	type: "planetoid",
	// 	radius: 267,
	// 	color: "#FFA500",
	// 	orbitalElements: (t) => {
	// 		return {
	// 			a: 0.99434,
	// 			e: 0.15102,
	// 			i: 0.07767,
	// 			L: 238.6318 + 144.9600 * t,
	// 			w: 13.3686 + 0.11185 * t,
	// 			N: 318.5106 + 0.06480 * t,
	// 			Omega: 40.7771 - 0.18199 * t
	// 		}
	// 	},
	// 	astroBodies: []
	// },
	// fortune: {
	// 	type: "asteroid",
	// 	radius: 14000,
	// 	color: "#FACC2E",
	// 	orbitalElements: (t) => {
	// 		return {
	// 			a: 1.2387456,
	// 			e: 0.024589 - 0.000065 * t,
	// 			i: 0.00426 - 0.008836 * Math.cos(119.04282 + 0.8649367 * t),
	// 			L: 119.04282 + 109250.3871 * t,
	// 			w: 50.19129 + 0.21046923 * t,
	// 			N: 70,
	// 			Omega: 23.75478 - 0.00001912 * t,
	// 		}
	// 	}
	// },
	// northNode: {
	//     type: "node",
	//     radius: 1738.1,
	//     color: "#FF8000",
	//     orbitalElements: (t) => {
	//         return {
	//             a: 1.00000011,
	//             e: 0.01671022 - 0.00003804 * t,
	//             i: 1.85,
	//             L: 100.46435 + 35999.37285 * t,
	//             w: 125.04452 + 0.05295376 * t,
	//             N: 0,
	//             Omega: -11.26064 - 0.00000144 * t,
	//         }
	//     }
	// },

}

const aries = {
	name: "aries",
	element: "Fire",
	stars: {
		"Hamal": [0.366, 0.933, 4, 66],
		"Sheratan": [0.510, 0.751, 2, 59],
		"Mesarthim": [0.549, 0.431, 5, 199],
		"Botein": [0.330, 0.244, 2, 164],
		"41": [0.807, 0.107, 2, 210],
		"Gamma": [0.726, 0.082, 1, 140],
		"HD 20367": [0.925, 0.317, 1, 125],
		"HD 20382": [0.908, 0.231, 1, 224],
		"HIP 24695": [0.597, 0.753, 1, 67],
		"HIP 27321": [0.388, 0.511, 1, 120],
		"HIP 27887": [0.859, 0.309, 1, 148],
		"HIP 30060": [0.848, 0.425, 1, 197],
		"HIP 30324": [0.827, 0.197, 1, 147],
		"HIP 30614": [0.830, 0.285, 1, 135],
		"HIP 31878": [0.847, 0.488, 1, 131],
		"HIP 32923": [0.736, 0.464, 1, 148],
		"HIP 33694": [0.679, 0.451, 1, 156],
		"HIP 35837": [0.791, 0.561, 1, 153],
		"HIP 37122": [0.660, 0.431, 1, 121],
		"HIP 38070": [0.748, 0.262, 1, 103],
		"HIP 38858": [0.712, 0.270, 1, 140],
		"HIP 39424": [0.715, 0.363, 1, 122],
		"HIP 40219": [0.576, 0.329, 1, 175],
		"HIP 40945": [0.802, 0.112, 1, 163],
		"HIP 42312": [0.824, 0.250, 1, 123],
		"HIP 42515": [0.657, 0.420, 1, 128],
		"HIP 42723": [0.748, 0.353, 1, 105],
		"HIP 42828": [0.734, 0.409, 1, 198],
		"HIP 42917": [0.774, 0.527, 1, 127],
	}
};

const taurus = {
	name: "taurus",
	element: "Earth",
	stars: {
		"Aldebaran": [0.5, 0.5, 4, 65],
		"Elnath": [0.7, 0.3, 3, 131],
		"Theta": [0.3, 0.7, 1, 154],
		"Zeta": [0.4, 0.6, 2, 450],
		"Beta": [0.6, 0.4, 2, 154],
		"Lambda": [0.3, 0.3, 1, 410],
		"Kappa": [0.8, 0.6, 2, 139],
		"Nu": [0.7, 0.5, 1, 200],
		"Omicron": [0.5, 0.3, 1, 460],
		"Pi": [0.2, 0.4, 1, 174],
		"Rho": [0.4, 0.3, 1, 173],
		"Sigma": [0.7, 0.8, 1, 161],
		"Tau": [0.2, 0.6, 1, 149],
		"Upsilon": [0.8, 0.5, 1, 133],
		"Phi": [0.6, 0.7, 1, 164],
		"Chi": [0.3, 0.2, 1, 154],
		"Psi1": [0.7, 0.4, 1, 154],
		"Psi2": [0.5, 0.8, 1, 160],
		"HD 29139": [0.9, 0.5, 1, 199],
		"HD 27778": [0.5, 0.2, 2, 279],
		"HD 28545": [0.8, 0.2, 2, 364],
		"HD 27524": [0.1, 0.5, 1, 240],
		"HD 28305": [0.9, 0.8, 1, 250],
		"HD 28252": [0.2, 0.9, 3, 240],
		"HD 27483": [0.8, 0.1, 2, 230],
		"HD 27890": [0.3, 0.6, 2, 245],
		"HD 28412": [0.5, 0.1, 3, 270],
		"HD 28380": [0.1, 0.8, 2, 265],
		"ε Tau": [0.4, 0.7, 2, 283]
	}
};

const gemini = {
	name: "gemini",
	element: "Air",
	stars: {
		"Castor": [-0.234, 0.501, 10.0],
		"Pollux": [0.264, 0.419, 15.0],
		"Alhena": [-0.259, -0.050, 7.6],
		"Mebsuta": [0.072, -0.426, 7.5],
		"Tejat Posterior": [0.363, 0.019, 3.5],
		"Tejat Prior": [0.363, 0.019, 3.5],
		"Propus": [-0.115, -0.411, 3.3],
		"Wasat": [-0.326, 0.269, 3.5],
		"Alzirr": [-0.418, -0.110, 3.0],
		"Mekbuda": [-0.100, -0.581, 3.8],
		"Tejat Prior Major": [0.415, 0.000, 4.6],
		"Rho": [-0.307, -0.492, 4.0],
		"Eta": [-0.423, 0.071, 3.3],
		"Tau": [-0.164, -0.642, 4.4],
		"Alhena B": [-0.260, -0.051, 8.2],
		"Alzirr B": [-0.421, -0.114, 11.0]
	}
};

const cancer = {
	name: "cancer",
	element: "Water",
	stars: {
		"Acubens": [0.452, -0.677, 4.3],
		"Altarf": [0.506, 0.277, 3.5],
		"Asellus Australis": [0.228, 0.499, 3.9],
		"Asellus Borealis": [0.238, 0.487, 4.3],
		"Beta Cancri": [0.161, -0.707, 3.5],
		"Delta Cancri": [0.495, -0.159, 3.9],
		"Epsilon Cancri": [0.394, -0.492, 4.2],
		"Gamma Cancri": [0.365, -0.629, 4.7],
		"Iota Cancri": [0.564, -0.314, 4.0],
		"Lambda Cancri": [0.496, -0.439, 5.3],
		"Mu Cancri": [0.534, -0.471, 5.1],
		"Nu Cancri": [0.514, -0.602, 5.2],
		"Omicron-1 Cancri": [0.333, -0.429, 5.0],
		"Omicron-2 Cancri": [0.347, -0.432, 6.3],
		"Zeta Cancri": [0.438, -0.682, 5.6]
	}
};

const leo = {
	name: "leo",
	element: "Fire",
	stars: {
		"Regulus": [0.422, 0.287, 23.5],
		"Denebola": [0.116, -0.403, 10.2],
		"Algieba": [0.159, 0.238, 11.8],
		"Zosma": [0.068, 0.119, 10.0],
		"Adhafera": [0.212, 0.071, 13.2],
		"Chort": [-0.133, 0.308, 11.4],
		"Alterf": [0.236, -0.144, 3.3],
		"Ras Elased Australis": [0.225, 0.180, 4.5],
		"Ras Elased Borealis": [0.266, 0.141, 5.5],
		"Mu": [-0.077, 0.355, 3.9],
		"Epsilon": [0.124, 0.401, 2.9],
		"Eta": [0.117, 0.457, 3.5],
		"Zeta": [0.171, 0.456, 3.4],
		"Theta": [0.098, 0.512, 3.3],
		"Iota": [0.065, 0.565, 4.0],
		"Kappa": [0.173, 0.528, 4.4],
		"Lambda": [0.262, 0.399, 4.3],
		"Phi": [0.058, 0.646, 4.5],
		"Sigma": [-0.005, 0.727, 4.0],
		"Chi": [-0.124, 0.734, 4.6],
		"Omicron": [-0.172, 0.683, 3.5],
		"Rho": [-0.192, 0.633, 3.9],
		"Xi": [-0.203, 0.589, 4.8],
		"Pi": [-0.282, 0.507, 4.6],
		"HD 88811": [0.196, -0.645, 6.5]
	}
};

const virgo = {
	name: "virgo",
	element: "Earth",
	stars: {
		"Spica": [0.129, -0.977, 12.1],
		"Porrima": [-0.354, -0.860, 3.5],
		"Vindemiatrix": [0.284, -0.854, 2.8],
		"Zavijava": [-0.641, -0.551, 3.6],
		"Heze": [-0.435, -0.547, 3.4],
		"Auva": [-0.484, -0.422, 4.9],
		"Syrma": [0.579, -0.345, 4.8],
		"Mu": [0.402, -0.312, 3.9],
		"Porrima B": [-0.341, -0.865, 9.0],
		"51": [0.701, -0.251, 4.7],
		"Rijl al Awwa": [-0.778, -0.141, 3.6],
		"Vindemiatrix B": [0.292, -0.861, 10.5],
		"33": [-0.507, -0.308, 5.4],
		"109": [0.449, -0.062, 4.7],
		"Epsilon": [-0.079, -0.562, 2.8],
		"Zaniah": [-0.022, -0.526, 3.9],
		"Beta": [-0.159, -0.263, 3.6],
		"Alpha": [0.099, -0.400, 1.0],
		"Gamma": [-0.244, -0.104, 3.7],
		"Delta": [0.302, -0.215, 3.4],
		"Epsilon B": [-0.077, -0.558, 12.0],
		"Eta": [-0.296, -0.090, 3.9],
		"Theta": [-0.080, -0.046, 4.4],
		"Iota": [0.013, -0.088, 4.1],
		"Kappa": [0.205, -0.253, 4.2],
		"Lambda": [-0.007, -0.185, 4.5],
		"Rho": [0.298, -0.298, 4.9],
		"Sigma": [0.115, -0.259, 4.8],
		"Tau": [-0.346, -0.397, 4.3],
		"Chi": [-0.619, -0.156, 4.6],
		"Psi": [0.480, -0.406, 5.3],
		"Omega": [-0.235, -0.462, 4.1],
		"HD 107259": [0.473, -0.112, 5.9],
		"HD 107547": [-0.539, -0.169, 6.2],
	}
};

const libra = {
	name: "libra",
	element: "Air",
	stars: {
		"Zubenelgenubi": [0.328, -0.362, 5.2],
		"Zubeneschamali": [0.342, -0.364, 4.1],
		"Brachium": [0.166, -0.426, 2.7],
		"Kraz": [0.044, -0.339, 2.8],
		"Gienah": [-0.269, -0.408, 2.6],
		"Iota": [-0.346, -0.391, 4.5],
		"Theta": [-0.385, -0.343, 4.1],
		"Delta": [-0.253, -0.298, 4.9],
		"Sigma": [-0.105, -0.282, 3.3],
		"Beta": [-0.009, -0.301, 2.6],
		"Gamma": [-0.138, -0.197, 3.9],
		"Alpha": [-0.153, -0.129, 2.8],
		"Mu": [0.075, -0.181, 5.2],
		"Nu": [0.055, -0.135, 5.2],
		"Xi": [-0.080, -0.083, 5.5],
		"Rho": [-0.254, -0.042, 4.5],
		"Pi": [-0.262, 0.032, 5.1],
		"Epsilon": [-0.291, 0.134, 4.9],
		"HD 134987": [-0.116, 0.305, 6.2],
		"HD 140283": [-0.141, 0.329, 7.5]
	}
};

const scorpio = {
	name: "scorpio",
	element: "Water",
	stars: {
		"Antares": [0.024, -0.596, 18.1],
		"Shaula": [-0.090, -0.442, 9.3],
		"Lesath": [-0.030, -0.395, 8.2],
		"Sargas": [0.199, -0.326, 10.6],
		"Dschubba": [-0.241, -0.272, 5.2],
		"Grafias": [-0.108, -0.237, 4.9],
		"Pi": [-0.135, -0.126, 2.9],
		"Eta": [-0.009, -0.061, 3.3],
		"G": [-0.172, -0.022, 4.6],
		"Zeta": [-0.123, -0.003, 4.7],
		"Phi": [0.131, 0.088, 4.9],
		"Xi": [-0.050, 0.161, 3.5],
		"Chi": [-0.131, 0.204, 4.4],
		"Omega-1": [-0.192, 0.312, 4.2],
		"Omega-2": [-0.204, 0.301, 4.3],
		"Graffias": [0.274, -0.406, 3.2],
		"Jabbah": [0.343, -0.482, 4.0],
		"Girtab": [0.284, -0.408, 2.8],
		"Acrab": [0.281, -0.364, 2.6],
		"Alniyat": [0.187, -0.452, 2.9],
		"Dschubba B": [0.182, -0.571, 6.0],
		"Sargas B": [0.104, -0.697, 5.3],
		"Sargas C": [0.103, -0.697, 6.5]
	}
};

const sagittarius = {
	name: "sagittarius",
	element: "Fire",
	stars: {
		"Nunki": [0.100, 0.986, 4.9],
		"Kaus Australis": [0.405, 0.822, 1.8],
		"Kaus Media": [0.293, 0.847, 2.7],
		"Kaus Borealis": [0.169, 0.810, 2.8],
		"Ascella": [0.211, 0.767, 2.9],
		"Albaldah": [0.461, 0.671, 3.9],
		"Epsilon": [0.185, 0.689, 1.8],
		"Lambda": [0.044, 0.646, 2.8],
		"Sigma": [0.063, 0.568, 2.0],
		"Tau": [0.005, 0.485, 3.3],
		"Phi": [0.177, 0.427, 3.2],
		"Delta": [0.372, 0.341, 2.7],
		"Pi": [0.320, 0.233, 2.9],
		"Zeta": [0.066, 0.198, 2.6],
		"Mu": [0.195, 0.159, 3.9],
		"Nu-1": [0.203, 0.132, 4.0],
		"Nu-2": [0.207, 0.124, 4.0],
		"Rho": [0.182, 0.090, 3.9],
		"Gamma-1": [0.130, 0.050, 4.7],
		"Gamma-2": [0.130, 0.045, 3.4],
		"Eta": [0.244, 0.014, 3.1],
		"Theta-1": [0.164, -0.018, 6.4],
		"Theta-2": [0.164, -0.023, 6.5],
		"Iota": [0.045, -0.100, 4.4],
		"Kappa": [0.131, -0.130, 5.4],
		"Lambda-1": [0.148, -0.151, 4.5],
		"Lambda-2": [0.147, -0.153, 5.0],
		"Phi-1": [0.175, -0.209, 5.1],
		"Phi-2": [0.173, -0.210, 5.2],
		"Sagittarii": [0.202, -0.229, 3.5],
		"Chi": [0.204, -0.273, 5.3],
		"Omega-1": [0.196, -0.362, 4.8],
		"Omega-2": [0.194, -0.368, 5.1],
		"HD 164353": [0.188, 0.694, 6.6],
		"HD 164907": [0.240, -0.171, 6.4],
		"HD 165052": [0.165, -0.025, 6.5],
		"HD 165141": [0.219, -0.116, 6.2],
		"HD 165246": [0.196, -0.230, 6.5],
		"HD 165459": [0.217, -0.319, 6.2],
		"HD 166734": [0.126, 0.003, 7.1],
		"HD 166734 b": [0.130, 0.025, 7.1],
		"HD 167042": [0.268, -0.274, 6.0],
		"HD 167128": [0.082, 0.005, 8.2],
		"HD 168443": [0.150, -0.133, 6.4]
	}
};

const capricorn = {
	name: "capricorn",
	element: "Earth",
	stars: {
		"Algedi": [0.219, -0.204, 4.3],
		"Dabih": [-0.308, -0.243, 3.1],
		"Deneb Algedi": [-0.112, -0.109, 2.8],
		"Nashira": [0.311, 0.051, 3.7],
		"Theta": [-0.317, -0.340, 4.1],
		"Iota": [-0.174, -0.315, 4.3],
		"Zeta": [-0.064, -0.305, 3.7],
		"Alpha": [-0.013, -0.218, 3.6],
		"Beta": [0.031, -0.183, 3.1],
		"Chi": [-0.193, -0.376, 5.3],
		"Gamma": [-0.149, -0.268, 3.6],
		"Delta": [-0.055, -0.209, 2.8],
		"Epsilon": [-0.146, -0.121, 4.3],
		"Eta": [-0.191, -0.123, 4.9],
		"Kappa": [-0.114, -0.074, 4.7],
		"Lambda": [-0.228, -0.011, 4.7],
		"Mu": [-0.202, -0.008, 5.1],
		"Nu": [-0.113, 0.019, 4.7],
		"Omicron": [-0.210, 0.056, 4.3],
		"Pi": [-0.135, 0.084, 4.4],
		"Rho": [-0.082, 0.118, 4.8],
		"Sigma": [-0.142, 0.152, 5.1],
		"Tau": [-0.203, 0.175, 4.8],
		"Phi": [-0.267, 0.184, 5.2],
		"Psi": [-0.353, 0.198, 5.4],
		"Omega": [-0.241, 0.264, 4.1]
	}
};

const aquarius = {
	name: "aquarius",
	element: "Air",
	stars: {
		"Sadalsuud": [0.259, -0.487, 10.6, 540],
		"Sadalmelik": [0.195, -0.472, 2.9, 540],
		"Sadachbia": [-0.101, -0.472, 3.8, 158],
		"Skat": [-0.391, -0.403, 3.2, 160],
		"Zeta Aquarii": [0.051, -0.419, 4.4, 154],
		"Eta Aquarii": [-0.291, -0.349, 4.0, 168],
		"Pi Aquarii": [-0.117, -0.351, 4.7, 429],
		"Lambda Aquarii": [-0.065, -0.260, 3.7, 118],
		"Phi Aquarii": [-0.172, -0.212, 4.2, 204],
		"Delta Aquarii": [-0.311, -0.191, 3.3, 162],
		"Epsilon Aquarii": [-0.149, -0.145, 3.8, 187],
		"Gamma Aquarii": [0.201, -0.131, 3.9, 170],
		"Theta Aquarii": [0.147, -0.076, 4.2, 163],
		"Iota Aquarii": [-0.117, -0.076, 4.3, 212],
		"Kappa Aquarii": [0.102, -0.059, 4.2, 161],
		"HR 8799": [-0.308, -0.128, 5.6, 129],
		"88 Aquarii": [-0.086, -0.202, 5.4, 350],
		"91 Aquarii": [-0.155, -0.243, 5.2, 160]
	}
};

const pisces = {
	name: "pisces",
	element: "Water",
	stars: {
		"Alrisha": [0.245, -0.102, 3.8],
		"Kullat Nunu": [0.098, -0.141, 4.4],
		"Fum al Samakah": [0.191, -0.143, 4.7],
		"Torcular": [0.259, -0.111, 4.8],
		"Gamma Piscium": [0.260, -0.168, 3.7],
		"Epsilon Piscium": [0.242, -0.197, 4.2],
		"Iota Piscium": [0.161, -0.246, 4.1],
		"Omega Piscium": [0.188, -0.295, 4.0],
		"Delta Piscium": [0.056, -0.278, 4.4],
		"Eta Piscium": [0.110, -0.322, 3.6],
		"Zeta Piscium": [0.039, -0.365, 5.2],
		"Theta Piscium": [-0.050, -0.392, 4.2],
		"Phi Piscium": [-0.027, -0.425, 4.7],
		"Chi Piscium": [0.045, -0.446, 4.7],
		"Psi Piscium": [-0.074, -0.464, 5.4],
		"Lambda Piscium": [-0.111, -0.449, 4.5],
		"Upsilon Piscium": [-0.158, -0.438, 4.3],
		"Xi Piscium": [-0.170, -0.413, 4.6],
		"Pi Piscium": [-0.198, -0.389, 5.0],
		"Rho Piscium": [-0.202, -0.356, 5.2],
		"Sigma Piscium": [-0.235, -0.338, 5.5],
		"Tau Piscium": [-0.248, -0.311, 5.5],
		"49 Piscium": [-0.282, -0.293, 5.6],
		"88 Piscium": [-0.319, -0.254, 5.8],
		"90 Piscium": [-0.330, -0.241, 5.4],
		"94 Piscium": [-0.339, -0.226, 5.8],
		"107 Piscium": [-0.352, -0.194, 5.7],
		"109 Piscium": [-0.356, -0.182, 5.9],
		"110 Piscium": [-0.354, -0.178, 5.8],
		"113 Piscium": [-0.362, -0.170, 5.7],
		"116 Piscium": [-0.359, -0.160, 5.8],
		"118 Piscium": [-0.362, -0.154, 5.8],
		"119 Piscium": [-0.363, -0.146, 5.8],
	}
};

const ophiuchus = {
	name: "Ophiuchus",
	element: "Fire",
	vector: { x: 0, y: 0, z: 0 },
	color: [1, 1, 1],
	distance: 1,
	stars: {
		"Rasalhague": [0.696, 0.082, 0.713],
		"Sabik": [0.527, 0.645, 0.553],
		"Cebalrai": [-0.410, -0.711, -0.571],
		"Kappa Ophiuchi": [0.323, -0.381, -0.867],
		"Sargas": [-0.076, 0.212, -0.974],
		"Eta Ophiuchi": [0.854, 0.384, -0.352],
		"Yed Prior": [-0.302, 0.808, -0.506],
		"Yed Posterior": [-0.400, 0.553, 0.731],
		"Ascella": [0.264, -0.875, 0.407],
		"Barnard's Star": [-0.150, 0.932, -0.327],
		"Gamma Ophiuchi": [0.726, -0.443, 0.526],
		"Delta Ophiuchi": [0.815, -0.528, -0.232],
		"Epsilon Ophiuchi": [0.463, -0.030, 0.886],
		"Zeta Ophiuchi": [-0.933, -0.121, 0.338],
		"Tau Ophiuchi": [-0.458, 0.823, -0.337]
	}
};

const zodiacPositions = {
	aries: { x: 0.6898, y: 0.7212, z: -0.0697 },
	taurus: { x: 0.4418, y: 0.8898, z: -0.1078 },
	gemini: { x: 0.1463, y: 0.9852, z: -0.0864 },
	cancer: { x: -0.1626, y: 0.9867, z: -0.0123 },
	leo: { x: -0.5435, y: 0.8349, z: -0.0745 },
	virgo: { x: -0.8369, y: 0.5147, z: -0.1856 },
	libra: { x: -0.9664, y: 0.2259, z: -0.1187 },
	scorpio: { x: -0.8672, y: -0.4944, z: -0.0602 },
	sagittarius: { x: -0.6076, y: -0.7594, z: -0.2335 },
	capricorn: { x: -0.3897, y: -0.9158, z: -0.0939 },
	aquarius: { x: -0.1089, y: -0.9868, z: 0.1173 },
	pisces: { x: 0.2915, y: -0.9473, z: 0.1388 }
}

const zodiacColors = {
	aries: '#f14d22',
	taurus: '#f67c20',
	gemini: '#fbab17',
	cancer: '#d4df25',
	leo: '#95c851',
	virgo: '#77b5a0',
	libra: '#10b4c2',
	scorpio: '#0db5ee',
	sagittarius: '#0372be',
	capricorn: '#676ab2',
	aquarius: '#764ba0',
	pisces: '#ac1f8d'
};

// Define the equatorial coordinates of each constellation's center (J2000.0)
const zodiacCoords = {
	aries: { ra: 2.75, dec: 19.5 },
	taurus: { ra: 4.6, dec: 16.5 },
	gemini: { ra: 7.35, dec: 22.5 },
	cancer: { ra: 8.85, dec: 19 },
	leo: { ra: 11.25, dec: 15 },
	virgo: { ra: 13.15, dec: 2.5 },
	libra: { ra: 15.15, dec: -10 },
	scorpio: { ra: 16.75, dec: -25.5 },
	sagittarius: { ra: 19.1, dec: -25 },
	capricorn: { ra: 21, dec: -18 },
	aquarius: { ra: 22.85, dec: -10 },
	pisces: { ra: 0.25, dec: 7.5 }
};

// Define the distance from the Sun to the center of each constellation in light years
const zodiacDistances = {
	aries: 154.4,
	taurus: 164,
	gemini: 177.3,
	cancer: 201.2,
	leo: 226.6,
	virgo: 243,
	libra: 259.5,
	scorpio: 284.2,
	sagittarius: 287.7,
	capricorn: 315.2,
	aquarius: 359.6,
	pisces: 374.7
};

// Define the position of the Sun in equatorial coordinates (J2000.0)
const sunCoords = { ra: 286.13, dec: 63.87 };

// Define a function to convert equatorial coordinates to cartesian coordinates
function eqToCartesian(ra, dec, distance) {
	const x = distance * Math.cos(dec * DEG_TO_RAD) * Math.cos(ra * DEG_TO_RAD);
	const y = distance * Math.cos(dec * DEG_TO_RAD) * Math.sin(ra * DEG_TO_RAD);
	const z = distance * Math.sin(dec * DEG_TO_RAD);
	return { x, y, z };
}

export default function getZodiacVector(sign) {
	const coords = zodiacCoords[sign];
	const distance = zodiacDistances[sign];
	const dirVector = eqToCartesian(coords.ra, coords.dec, 1);
	const sunVector = eqToCartesian(sunCoords.ra, sunCoords.dec, 1);
	const vector = { x: dirVector.x - sunVector.x, y: dirVector.y - sunVector.y, z: dirVector.z - sunVector.z };
	return vector;
}

//taurus, gemini, cancer, leo, virgo, libra, scorpio, sagittarius, capricorn, aquarius, pisces
const zodiac_sign = [aries, taurus, gemini, cancer, leo, virgo, libra, scorpio, sagittarius, capricorn, aquarius, pisces].map((s) => {
	return ({
		...s,
		vector: zodiacPositions[s.name],
		color: zodiacColors[s.name],
		distance: zodiacDistances[s.name]
	})
});

export {
	sign_names,
	DEG_TO_RAD,
	RAD_TO_DEG,
	JD_J2000,
	solarSystem,
	zodiac_sign,
	ophiuchus
}
