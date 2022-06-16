export default function lerp(a,b,f){
	return a + (b - a) * f
}

export function isMobile(){
	const nAgt = navigator.userAgent;
	console.log(nAgt)

	const checkMobile = {
		Android: function() {
			return nAgt.match(/Android/i);
		},
		BlackBerry: function() {
			return nAgt.match(/BlackBerry/i);
		},
		iOS: function() {
			return nAgt.match(/iPhone|iPad|iPod/i);
		},
		Opera: function() {
			return nAgt.match(/Opera Mini/i);
		},
		Windows: function() {
			return nAgt.match(/IEMobile/i);
		},
		any: function() {
			return (checkMobile.Android() || checkMobile.BlackBerry() || checkMobile.iOS() || checkMobile.Opera() || checkMobile.Windows());
		}
	};
	return (checkMobile.any())
}