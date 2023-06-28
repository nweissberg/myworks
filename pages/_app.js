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
import  QRCode  from 'qrcodejs'
import UtilsProvider from './utils';
import AthenaProvider from './athena/athena_context';
// var qrcode = new QRCode()
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCo7SYGHeHMteb_BdNoWRYTkgEH8o0F2to",
  authDomain: "my-works-3d.firebaseapp.com",
  projectId: "my-works-3d",
  storageBucket: "my-works-3d.appspot.com",
  messagingSenderId: "630637201216",
  appId: "1:630637201216:web:66f41f3df95348a556dca5",
  measurementId: "G-0MH4DC3ZZX"
};


function MyApp({ Component, pageProps }) {
  // Initialize Firebase
  const [qrcode, set_qrcode] = useState(false)

  useEffect((e)=>{
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    // new QRCode(document.getElementById("qrcode"), "https://nyco3d.com");
  },[])
  
  const router = useRouter()
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
  return (
    <UtilsProvider>
      <AuthProvider>
        <AthenaProvider>
          <div>
            {/* <object data="path-to-audio-file.mp3"></object> */}
            <Suspense
              fallback={
              <div
                style={{
                  position:"absolute",
                  width:"100svw",
                  height:"100svh",
                  backgroundColor:"#000",
                  zIndex:100,
                  pointerEvents:"none"
                }}
              >
                <img alt='N3D_logo' src="/image/N3D.gif"></img>
              </div>}
            >
              <div
                className='fg_anim'
                style={{
                  opacity:0,
                  position:"absolute",
                  width:"100vw",
                  height:"100vh",
                  backgroundColor:"#000",
                  zIndex:100,
                  pointerEvents:"none"
                }}
              >
                <img alt='N3D_logo' src="/image/N3D.gif"></img>
              </div>
              
              <div className='flex absolute w-auto mt-3 z-4'>
                <SpeedDial
                  className='flex fixed right-0 mr-2 z-4'
                  model={items}
                  direction="down"
                  transitionDelay={30}
                  showIcon="pi pi-bars"
                  hideIcon="pi pi-times"
                  buttonClassName="flex z-3 p-button-success p-button-outlined"
                  />
              </div>
              <Component {...pageProps} />
            </Suspense>
            <Dialog
              header="NYCO3D.com"
              visible={qrcode}
              dismissableMask={true}
              closeOnEscape
              closable={false}
              // maximizable
              onHide={() => {set_qrcode(false)}}
            >
              <div id='qrcode' >
                <img alt='nyco3d.com' width={300} src='image/qrcode.jpg'/>
              </div>
            </Dialog>
          
          </div>
        </AthenaProvider>
      </AuthProvider>
    </UtilsProvider>
  )
}

export default MyApp
