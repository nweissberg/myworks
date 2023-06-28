import React, { useContext, useEffect, useState } from "react"

const UtilsContext = React.createContext()

export function useUtils(){
    return useContext(UtilsContext)
}

export const toType = (o) => ({}).toString.call(o).match(/\s([a-zA-Z]+)/)[1].toLowerCase()


//-> Generates Unique Key IDs per function call
function* idGen(){
	let id = 1
	while(true){
		yield id
		id++
	}
}
const genID = idGen()
export function uid(){ return genID.next().value }

export function hasUndefined(obj) {
    if (obj === undefined) {
        return true;
    }
    
    if (typeof obj !== 'object' || obj === null) {
        return false;
    }
    
    for (const key in obj) {
        if (obj.hasOwnProperty(key) && hasUndefined(obj[key])) {
            return true;
        }
    }
    
    return false;
}

export function similarText(sa1, sa2){
    var s1 = sa1.replace(/\s/g, "").toLowerCase();
    var s2 = sa2.replace(/\s/g, "").toLowerCase();

    function intersect(arr1, arr2) {
        var r = [], o = {}, l = arr2.length, i, v;
        for (i = 0; i < l; i++) {
            o[arr2[i]] = true;
        }
        l = arr1.length;
        for (i = 0; i < l; i++) {
            v = arr1[i];
            if (v in o) {
                r.push(v);
            }
        }
        return r;
    }

    var pairs = function(s){
        // Get an array of all pairs of adjacent letters in a string
        var pairs = [];
        for(var i = 0; i < s.length - 1; i++){
            pairs[i] = s.slice(i, i+2);
        }
        return pairs;
    }

    var similarity_num = 2 * intersect(pairs(s1), pairs(s2)).length;
    var similarity_den = pairs(s1).length + pairs(s2).length;
    var similarity = similarity_num / similarity_den;
    return similarity;
};
export function imgToBase64(img,format='image/png',scale=0.8, ratio=1.0) {
    
    // Create a canvas element with the same dimensions as the image
    const canvas = document.createElement('canvas');
    const width = img.width*scale
    const height = (img.width*scale)/ratio
    canvas.width = width;
    canvas.height = height;
  
    // Draw the image onto the canvas
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);
  
    // Get the Base64-encoded PNG data URL from the canvas
    const dataUrl = canvas.toDataURL(format);
  
    // Return just the Base64-encoded image data
    return dataUrl;
}

// function that calculates the averege sum of all numbers in an array
export function average(arr) {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}

export function getImageData(img, scale=0.8, ratio=1.0) {
    // Create a canvas element with the same dimensions as the image
    const canvas = document.createElement('canvas');
    const width = img.width*scale
    const height = (img.width*scale)/ratio
    canvas.width = width;
    canvas.height = height;
  
    const ctx = canvas.getContext('2d');
    
    ctx.drawImage(img, 0, 0, width, height);
    var imgData = ctx.getImageData(0, 0, width, height);
    var d = imgData.data;
    for (var i = 0; i < d.length; i += 4) {
        var sum = Math.ceil(Math.floor(d[i])+ Math.floor(d[i+1]) + Math.floor(d[i+2]));
        d[i+3] = sum
    }

    return(imgData)
}

export function averageBlob(blob) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const width = img.width;
        const height = img.height;
        canvas.width = width;
        canvas.height = height;
  
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
  
        const imgData = ctx.getImageData(0, 0, width, height);
        const d = imgData.data;
  
        let sum = 0;
        for (let i = 0; i < d.length; i += 4) {
          sum += Math.floor(d[i]) + Math.floor(d[i + 1]) + Math.floor(d[i + 2]);
        }
  
        resolve(sum / (width * height));
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(blob);
    });
  }

  

export async function fetchWithTimeout(url, options, timeout = 5000) {
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => {
        abortController.abort();
        console.log("Request timed out");
    }, timeout);
  
    try {
        const response = await fetch(url, { ...options, signal: abortController.signal });
        if (!response.ok) {
            console.log(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        clearTimeout(timeoutId);
        return data;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

export function time_ago(date, value = false){
	if(!date) return
	
	const date_now = Date.now()
	const date_since = new Date(date)
	
	// console.log(date_since)
	const min_ago = Math.floor((date_now - date_since)/1000/60)
	const hours_ago = min_ago/60
	const days_ago = hours_ago/24
	const months_ago = days_ago/30
	if(value != false){
		var ret = 0
		switch (value) {
			case "minutes":
				ret = min_ago
				break;
			
			case "hours":
				ret = hours_ago
				break;

			case "days":
				ret = days_ago
				break;

			case "months":
				ret = months_ago
				break;
			default:
				ret = date_now - date_since
				break;
		}
		return ret
	}
	if(min_ago < 1){
		return( "Agora")
	}else if(min_ago < 60){
		return( "Há " + min_ago +" minuto" + (min_ago>1?"s":"") )
	}
	else if(hours_ago < 24){
		return( "Há " + Math.ceil(hours_ago) + " hora" + (Math.ceil(hours_ago)>1?"s":"") )
	}
	else if(days_ago < 30){
		return( "Há " + Math.floor(days_ago) + " dia" + (Math.floor(days_ago)>1?"s":"") )
	}
	else if(months_ago < 12){
		return( "Há " + Math.floor(months_ago) + " Mês" + (Math.floor(months_ago)>1?"es":"") )
	}
	
}

export default function UtilsProvider({children}) {
	const [win, set_win] = useState(null)
    const [nav, set_nav] = useState(null)
    const [is_mobile, set_is_mobile] = useState(null)
  
  	useEffect(()=>{
        set_is_mobile(isMobile())
  	},[win, nav])

  	useEffect(()=>{
		if (typeof window !== 'undefined') {
			set_win(window)
		}
        if (typeof navigator !== 'undefined') {
			set_nav(navigator)
		}
	},[])

    const createId = (size=8, time=true, string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') => {
        let id = '';
        for (let i = 0; i < size; i++) {
            id += string.charAt(Math.floor(Math.random() * string.length));
        }
        return id + (time? "_" + Date.now():"");
    }

	const lerp = (a,b,f)=>{
		return a + (b - a) * f
	}

    const capitalize = (text)=>{
        return(text[0].toUpperCase() + text.substring(1))
    }

    const blob_to_image = async (blob,ret_img=true)=>{
        return new Promise((res,rej)=>{
            // Assume "blob" is the Blob object you want to convert to JPEG
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            // Create a URL for the Blob object
            const url = URL.createObjectURL(blob);

            // Load the Blob object into an image element
        
            img.onload = () => {
                if(ret_img) res(img)
                // Set the canvas dimensions to match the image dimensions
                canvas.width = img.width;
                canvas.height = img.height;

                // Draw the image onto the canvas
                ctx.drawImage(img, 0, 0, img.width, img.height);

                // Convert the canvas to a Blob object
                canvas.toBlob((jpegBlob) => {
                    res(jpegBlob)
                }, 'image/jpeg', 0.8);
            };

            img.src = url;
        })
    }

    function clone_array(arr, copy) {
        if (copy <= 1) {
          return arr;
        } else {
          return arr.concat(clone_array(arr, copy - 1));
        }
      }

    const isMobile = ()=>{
        // if(!navigator) return(false);
        const nAgt = navigator.userAgent;
        // console.log(nAgt);
        
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
            Samsung: function() {
            return nAgt.match(/Samsung/i);
            },
            Xiaomi: function() {
            return nAgt.match(/Xiaomi/i);
            },
            any: function() {
            return (
                checkMobile.Android() ||
                checkMobile.BlackBerry() ||
                checkMobile.iOS() ||
                checkMobile.Opera() ||
                checkMobile.Windows() ||
                checkMobile.Samsung() ||
                checkMobile.Xiaomi()
            );
            }
        };
        return checkMobile.any();
    }
    
    
    const value = {
        clone_array,
        blob_to_image,
        capitalize,
        is_mobile,
        createId,
		lerp,
        win,
        nav
    }

    return (
        <UtilsContext.Provider value={value}>
            {children}
        </UtilsContext.Provider>
    )
}


export function syntaxHighlight(json) {
    if (typeof json != 'string') {
         json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'style="color: var(--teal-400);"';
            } else {
                cls = 'style="color: var(--orange-400);"';
            }
        } else if (/true|false/.test(match)) {
            cls = 'style="color: var(--purple-400);"';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return `<span ${cls}>` + match + '</span>';
    });
}

export function downloadURI(uri, name) 
{
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    link.click();
}

export const dateMask = (value=new Date()) => {
	return value.toLocaleDateString("pt-br", {
		hour12: false,
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
}

export const moneyMask = (value=0) => {
	return value.toLocaleString('pt-BR', {
		style: 'currency',
		currency: 'BRL',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	});
}

export const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
};

export const scrollToBottom = () => {
	if(window.innerHeight < 400 )window.scrollTo({
		top: document.documentElement.scrollHeight,
		behavior: 'smooth',
	});
};

export function format_mask(value, pattern) {
    let i = 0;
    const v = value.toString();
    return pattern.replace(/#/g, _ => v[i++]);
}

export function replaceAll(str,at,to){
	return str.split(at).join(to)
}

export function toIdTag(str){
	return(replaceAll(str.normalize('NFD')
	.replace(/[\u0300-\u036f]/g, '')
	.replace(/[^0-9a-zA-Z\s]/g, '_').toLowerCase()," ","_"))
}

export function normalize(str){
	return(str.normalize('NFD')
	.replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, ' '));
}

export function splitStringWithPunctuation(string) {
    const regex = /([^.?!;]*[.?!;]+)/g;
    return string.match(regex)?.map(t=>normalize(t));
}

export const copyToClipBoard = (text) => {

	navigator.clipboard.writeText(text).then(function() {
		console.log('Async: Copying to clipboard was successful!');
	}, function(err) {
		console.error('Async: Could not copy text: ', err);
	});
}

export const validaCPF = cpf => {

	var Soma = 0
	var Resto
  
	var strCPF = String(cpf).replace(/[^\d]/g, '')
	
	if (strCPF.length !== 11)
		return false
 
	if ([
		'00000000000',
		'11111111111',
		'22222222222',
		'33333333333',
		'44444444444',
		'55555555555',
		'66666666666',
		'77777777777',
		'88888888888',
		'99999999999',
		].indexOf(strCPF) !== -1)
		return false
  
	for (var i=1; i<=9; i++)
		Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
  
	Resto = (Soma * 10) % 11
  
	if ((Resto == 10) || (Resto == 11)) 
		Resto = 0
  
	if (Resto != parseInt(strCPF.substring(9, 10)) )
	  return false
  
	Soma = 0
  
	for (var i = 1; i <= 10; i++)
		Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i)
  
	Resto = (Soma * 10) % 11
  
	if ((Resto == 10) || (Resto == 11)) 
		Resto = 0
  
	if (Resto != parseInt(strCPF.substring(10, 11) ) )
		return false
  
	return true
}

export const validaCNPJ = cnpj => {
 
    cnpj = cnpj.replace(/[^\d]+/g,'');
 
    if(cnpj == '') return false;
     
    if (cnpj.length != 14)
        return false;
 
    // Elimina CNPJs invalidos conhecidos
    if (cnpj == "00000000000000" || 
        cnpj == "11111111111111" || 
        cnpj == "22222222222222" || 
        cnpj == "33333333333333" || 
        cnpj == "44444444444444" || 
        cnpj == "55555555555555" || 
        cnpj == "66666666666666" || 
        cnpj == "77777777777777" || 
        cnpj == "88888888888888" || 
        cnpj == "99999999999999")
        return false;
         
    // Valida DVs
    tamanho = cnpj.length - 2
    numeros = cnpj.substring(0,tamanho);
    digitos = cnpj.substring(tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (var i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0))
        return false;
         
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0,tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (var i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1))
          return false;
           
    return true;
    
}


export var clearMask = (e) => String(e).replace(/[^\d]/g, '')

export function deepEqual(x, y) {
	// console.log(x,y)
	if(x == null || y == null){
		if(x == null && y == null){
			return true
		}
		return false
	}
	if(x.length != y.length) return false
	var test = x.map((item,index)=>{
		return(isDeepEqual(item,y[index]))
	})
	// console.log(test)
	if(test.indexOf(false) != -1){
		return false
	}
	return true
}

export const isDeepEqual = (object1, object2) => {

	const objKeys1 = Object.keys(object1);
	const objKeys2 = Object.keys(object2);

	if (objKeys1.length !== objKeys2.length) return false;

	for (var key of objKeys1) {
		const value1 = object1[key];
		const value2 = object2[key];

		const isObjects = isObject(value1) && isObject(value2);

		if ((isObjects && !isDeepEqual(value1, value2)) ||
		(!isObjects && value1 !== value2)
		) {
		return false;
		}
	}
	return true;
};

const isObject = (object) => {
	return object != null && typeof object === "object";
};

export function shorten(sentance,max=8,middle=true){
	if(!sentance)return''
	const sentance_array = sentance.split(' ')
	if(middle){
		return(sentance_array.length < max ? sentance : sentance_array.slice(0,(max/2)).join(' ') + " ... " + sentance_array.slice(-(max/2)).join(' '))
	}else{
		return(sentance_array.length > max? sentance_array.slice(0,max).join(' ')+"...": sentance)
	}
}

export const documentMask = (value) => {
	if(value.length == 14){
		return("CNPJ: "+format_mask(value,"##.###.###/####-##"))
	}else if(value.length == 11){
		return("CPF: "+format_mask(value,"###.###.###-##"))
	}else{
		return(value)
	}
}

export function includesAny(text,elements){
    // return(false)
    return(elements.some(test => text.toLocaleLowerCase().includes(test.toLocaleLowerCase())))
}

export function swap_array(arr, a, b) {
	return arr.map((current, idx) => {
		if (idx === a) return arr[b]
		if (idx === b) return arr[a]
		return current
	});
}
// var localStorage = window.localStorage
// var sessionStorage = window.sessionStorage
//-> Browser Session || Local Storage
// n = var name
// v = var value
// t = is var temporary?
export function var_set(name, value, session){
	var localStorage = window.localStorage
	var sessionStorage = window.sessionStorage
	if(!localStorage || !sessionStorage) return( new Promise((res,rej)=>{res(null)}) )
	return new Promise((res,rej)=>{
		if (name == undefined) rej(null);
		if (typeof(Storage) === "undefined") rej(null);
		try {
			if(session == true) { sessionStorage[name] = String(value) }
			else{ localStorage[name] = String(value) }
			res(value)
		}
		catch(e) { 
			console.log("Error "+e+".")
			rej(e)
		 }
	})
}
export function var_get(n){
	var localStorage = window.localStorage
	var sessionStorage = window.sessionStorage
	if(!localStorage || !sessionStorage) return( new Promise((res,rej)=>{res(null)}) )
	return new Promise((res,rej)=>{
		if (n == undefined) rej(null);
		if (typeof(Storage) === "undefined") rej(null);
		try { res(localStorage[n]?localStorage[n]:sessionStorage[n]) }
		catch(e) {
			console.error("Error -> "+e)
			rej(e)
		}
		rej(null);
	})
}
export function var_del(n){
	var localStorage = window.localStorage
	var sessionStorage = window.sessionStorage
	if (n == undefined) return null;
	if (typeof(Storage) === "undefined") return null;
	try { localStorage.removeItem(n) }
	catch(e) { console.log("Error "+e+".") }
}
