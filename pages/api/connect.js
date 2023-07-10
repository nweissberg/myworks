import axios from 'axios';
import { isDeepEqual, print } from '../utils';

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_DB_URL
});

const api_cloud = axios.create({
	baseURL: process.env.NEXT_PUBLIC_DB_CLOUD_URL
});

api.interceptors.request.use(function (config) {
	return config
}, function (error) {
	console.error(error)
})

api.interceptors.response.use(function (response) {
	return (response.data)
}, function (error) {
	console.error(error)
})

api_cloud.interceptors.request.use(function (config) {
	return config
}, function (error) {
	console.warn(error)
})

api_cloud.interceptors.response.use(function (response) {
	return (response.data)
}, function (error) {
	console.warn(error)
})

// var api_buffer = []

const api_call = (async (path, body, cloud = ("development" != process.env.NODE_ENV)) => {
	// var isLoading = api_buffer.find((requested) => isDeepEqual(body, requested))
	// console.log(api_buffer)
	return new Promise(function (res, rej) {
		// if (isLoading) { return rej(null) }

		// api_buffer.push(body)
		if (cloud) {
			console.log((Date.now(), 'CLOUD'))
			api_cloud.post(path, body).then((data) => {
				// api_buffer = api_buffer.filter((request) => isDeepEqual(request, body) == false)
				if (data) {
					console.log((Date.now(), 'resolved'))
					res(data)
				} else {
					console.log((Date.now(), 'rejected'))
					rej(null)
				}
			})
		} else {
			console.log((Date.now(), 'LOCAL'))
			api.post(path, body).then((data) => {
				// api_buffer = api_buffer.filter((request) => isDeepEqual(request, body) == false)
				if (data) {
					console.log((Date.now(), 'resolved'))
					res(data)
				} else {
					console.log((Date.now(), 'rejected'))
					rej(null)
				}
			})
		}
	})
})

var api_buffer = []
const api_get = ((body, headers) => {
	console.log(api_buffer)

	var isLoading = api_buffer.find((requested) => isDeepEqual(body, requested))

	return new Promise(function (res, rej) {
		if (isLoading) { res(null) }

		api_buffer.push(body)
		api_cloud.post("/api/" + body.route, body, headers).then((data) => {
			api_buffer = api_buffer.filter((request) => isDeepEqual(request, body) == false)
			if (data) {
				console.log((Date.now(), 'CLOUD'))
				res(data)
			} else {
				api.post("/api/"+ body.route, body, headers).then((data) => {
					if (data) {
						console.log((Date.now(), 'LOCAL'))
						res(data)
					} else {
						res(null)
					}
				}).catch(error => {
					console.log(error)
					rej(null)
				})
			}
		}).catch(error => {
			api_buffer = api_buffer.filter((request) => isDeepEqual(request, body) == false)
			console.log(error)
			rej(null)
		})
	}, function (error) {
		return (null)
	})
})


export default api;
export { api_get, api_call };