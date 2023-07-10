import '../styles/globals.css'
import '../styles/raster.css'
import "primereact/resources/themes/arya-green/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";                                //icons
import 'primeflex/primeflex.css';
import { SpeedDial } from 'primereact/speeddial';
import { useRouter } from 'next/router'
import { useEffect, Suspense, useState } from 'react';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { AuthProvider } from './api/auth';
import { Dialog } from 'primereact/dialog';
import QRCode from 'qrcodejs'
import UtilsProvider, { extractHiddenDataFromImage, imageToData, print, var_del, var_get, var_set } from './utils';
import AthenaProvider from './athena/athena_context';
import PrimeReact, { locale, addLocale } from 'primereact/api';
import Head from 'next/head'
import ImageDropWrapper from './components/wrapper_on_drop_file';
// var qrcode = new QRCode()

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FB_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOM,
  projectId: process.env.NEXT_PUBLIC_FB_PROJ_ID,
  storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE,
  messagingSenderId: process.env.NEXT_PUBLIC_FB_MESSAGE,
  appId: process.env.NEXT_PUBLIC_FB_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FB_MEASURE
})

addLocale('pt', {
  firstDayOfWeek: 0,
  dayNames: ['domingo', 'segunda', 'terça', 'Quarta', 'quinta', 'sexta', 'sábado'],
  dayNamesShort: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'],
  dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
  monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  today: 'Hoje',
  clear: 'Limpar',
  chooseDate: 'Escolha um dia',
  chooseTime: 'Agora um horário',
  goBack: 'Voltar',
  goForward: 'Avançar',
  contactInfo: 'Informações para contato'
});
locale('pt')

PrimeReact.ripple = true;


function MyApp({ Component, pageProps }) {
  const router = useRouter()
  // Initialize Firebase
  const [qrcode, set_qrcode] = useState(false)

  useEffect((e) => {
    const analytics = getAnalytics(app);
    // new QRCode(document.getElementById("qrcode"), "https://nyco3d.com");
    var_get('imaginy_version').then(version=>{
			if(version != process.env.NEXT_PUBLIC_VERSION){
				console.warn(`Updating from ${version} to ${process.env.NEXT_PUBLIC_VERSION}`)
        if(version == undefined){
          var_del('imaginy_view')
          var_del('imaginy_data')
          var_del('imaginy_vision')
        }
				var_set('imaginy_version',process.env.NEXT_PUBLIC_VERSION).then(()=>{
          console.warn('Updated!')
          router.reload()
        })
			}
		})
  }, [])

  
  useEffect(() => {
    print(router)
    if (router.query.pg) {
      var _query = { ...router.query }
      Array('pg').map(k => delete _query?.[k])
      router.push({ pathname: '/'+router.query.pg, query: _query, shallow: true })
    }
    const handleRouteChange = (url, { shallow }) => {
      print(
        `App is changing to ${url} ${shallow ? 'with' : 'without'
        } shallow routing`
      )
    }
    const handleRouteChangeError = (err, url) => {
      if (err.cancelled) {
        print(`Route to ${url} was cancelled!`)
      }
    }
    router.events.on('routeChangeStart', handleRouteChange)
    router.events.on('routeChangeError', handleRouteChangeError)

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('routeChangeError', handleRouteChangeError)
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [router])

  const file_handle = (file_data)=>{
		console.log(file_data)
		const img = new Image();
		
		imageToData(file_data).then((image_data) => {
			const extractedData = extractHiddenDataFromImage(image_data.data,'png')
			if(extractedData) {
				var _imaginy_vision = JSON.parse(extractedData).data
				// set_imaginy_vision(_imaginy_vision);
        console.log(_imaginy_vision)
				var_set('imaginy_vision', JSON.stringify(_imaginy_vision));
				
			}
			// blob_to_image(file_data, 'data').then((image_data) => {
      console.log(image_data)
			var_set('imaginy_view', image_data, { compressed: true })
			// })
		});
		img.src = file_data;
		// set_imaginy_view(img)
	}

  const items = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      command: () => {
        router.push('/')
        // toast.current.show({ severity: 'info', summary: 'Add', detail: 'Data Added' });
      }
    },
    {
      label: 'GeoTimeline',
      icon: 'pi pi-globe',
      command: () => {
        router.push('geotimeline')
        // toast.current.show({ severity: 'success', summary: 'Update', detail: 'Data Updated' });
      }
    },
    {
      label: 'Athena A.I.',
      icon: 'pi pi-comments',
      command: () => {
        router.push('athena')
        // toast.current.show({ severity: 'success', summary: 'Update', detail: 'Data Updated' });
      }
    },
    {
      label: 'Download CV',
      icon: 'pi pi-qrcode',
      command: () => {
        set_qrcode(true)
        // toast.current.show({ severity: 'error', summary: 'Delete', detail: 'Data Deleted' });
      }
    },
  ];
  return (<>
    <Head>
			<title>Imaginy</title>
			<meta name="description" content="Imaginy is a web application that helps you to create and share your images. Using Machine Learning A.I." />
			<meta name 	= "viewport" 	content = "width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0" />
      <meta name 	= "apple-mobile-web-app-capable" content = "yes" />
      <meta name 	="HandheldFriendly" content = "true" />
		</Head>
    <UtilsProvider>
      <AuthProvider>
        <AthenaProvider>
          <div>
            {/* <object data="path-to-audio-file.mp3"></object> */}
            <Suspense fallback={
              <div>
                <img className='center' alt='N3D_logo' src="/image/N3D.gif"></img>
              </div>
            }>
              <div className='fg_anim'
                style={{
                  opacity: 0,
                  position: "absolute",
                  width: "100vw",
                  height: "100vh",
                  backgroundColor: "#000",
                  zIndex: 100,
                  pointerEvents: "none"
                }}>
                <img className='center' alt='N3D_logo' src="/image/N3D.gif"></img>
              </div>

              {/* <div className='flex absolute w-auto mt-3 z-4'>
                <SpeedDial
                  className='flex fixed right-0 mr-2 z-4'
                  model={items}
                  direction="down"
                  transitionDelay={30}
                  showIcon="pi pi-bars"
                  hideIcon="pi pi-times"
                  buttonClassName="flex z-3 p-button-success p-button-outlined"
                  />
              </div> */}
              <ImageDropWrapper className=" flex flex-wrap justify-content-center bg-contain w-auto min-w-screen h-auto overflow-hidden max-h-screen m-0 p-0 surface-ground "
                onFileDrop={(file_data)=>{
                  file_handle(file_data)
                  console.log(file_data)
                  router.push({pathname:'/editor',shallow:true, query:{doc:'file'}})
                }}
              >
                <Component {...pageProps} />
              </ImageDropWrapper>
            </Suspense>
            <Dialog
              header="NYCO3D.com"
              visible={qrcode}
              dismissableMask={true}
              closeOnEscape
              closable={false}
              // maximizable
              onHide={() => { set_qrcode(false) }}
            >
              <div id='qrcode' >
                <img alt='nyco3d.com' width={300} src='image/qrcode.jpg' />
              </div>
            </Dialog>

          </div>
        </AthenaProvider>
      </AuthProvider>
    </UtilsProvider>
    </>
  )
}

export default MyApp
