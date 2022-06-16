import '../styles/globals.css'
import "primereact/resources/themes/arya-green/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";                                //icons
import { SpeedDial } from 'primereact/speeddial';
import { useRouter } from 'next/router'
import { useEffect, Suspense } from 'react';
import 'primeflex/primeflex.css';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
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
  useEffect((e)=>{
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
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
        label: 'Download CV',
        icon: 'pi pi-file-pdf',
        command: () => {
            // toast.current.show({ severity: 'error', summary: 'Delete', detail: 'Data Deleted' });
        }
    }
];
  return (
    <div>
      <Suspense
        fallback={<div
          style={{
            position:"absolute",
            width:"100vw",
            height:"100vh",
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
        <div style={{
          position: 'fixed',
          margin:"10px",
          right:"70px",
          height: '350px' , 
          zIndex:5
        }}>
          <SpeedDial
            model={items}
            direction="down"
            transitionDelay={80}
            showIcon="pi pi-bars"
            hideIcon="pi pi-times"
            buttonClassName="p-button-success p-button-outlined" />
        </div>
      <Component {...pageProps} />
      </Suspense>
      
    
    </div>
  )
}

export default MyApp
