import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_DB_URL
});

const api_cloud = axios.create({
  baseURL: process.env.NEXT_PUBLIC_DB_CLOUD_URL
});

api.interceptors.request.use(function(config){
  return config
}, function (error){
  console.error(error)
})

api.interceptors.response.use(function(response){
 return (response.data)
}, function (error){
  console.error(error)
})

api_cloud.interceptors.request.use(function(config){
  return config
}, function (error){
  console.warn(error)
})

api_cloud.interceptors.response.use(function(response){
  return (response.data)
}, function (error){
  console.warn(error)
})

const api_get = ((request, headers)=>{
    const route = request.route
    // console.log(request,request.body)
    return new Promise(function(res, rej) {
        api.post("/api/"+route+"/", request.body, headers)
        .then((data) => {
        if(data){
            console.log('LOCAL')
            res(data)
        }else{
          api_cloud.post("/api/"+route+"/", request.body,headers)
            .then((data) => {
            if(data){
                console.log('CLOUD')
                res(data)
            }else{
                res(null)
            }
            }).catch(error => {
            rej(null)
            console.log(error)
            })
        }
        }).catch(error => {
        rej(null)
        console.log(error)
        })
    })
})

export default api;
export{ api_get };