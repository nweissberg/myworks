
import styles from '../styles/Home.module.css'
import { Clock } from '../componets/Clock';
import { useRouter } from 'next/router'
import MyTimeline from './components/mytimeline';
import UserProfile from './components/user_profile';
import MatrixBackGround from './components/matrix_bg';
import Planeta from './planeta';

export default function Home() {
  
  
  const clock = new Clock
  var tick = 0
  
  const router = useRouter()

  
  return (
    <div className={styles.main}>
      <div style={{zIndex:1}}>
        <MatrixBackGround/>
      </div>
      
      
      
      <div style={{
        position:"absolute",
        width:"100vw",
        height:"100vh",
        overflowX:"hidden"
        // backgroundColor:"red"
      }} className='flex justify-content-center flex-wrap'>
        <div className="
            flex-1
            flex-order-2
            md:flex-order-0
            flex
            justify-content-start"
          >
            <MyTimeline />
        </div>
        <div
          className="
            flex-grow-1
            flex-order-0
            md:flex-1
            lg:flex-order-1
            flex
            pt-3"
          style={{
            zIndex:3,
            pointerEvents:"none"
          }}>
            <UserProfile />
          
        </div>
        
      </div>
      <div style={{
        position:"absolute",
        // top:"10px",
        // marginRight:"100px",
        overflow:"hidden",
        width:"100vw",
        height:"100vh",
        zIndex:2
        }}>
          <div style={{
            position:"absolute",
            left:"calc(-20vw + 200px)",
            width:"100vw",
            height:"100vh",
          }}>
            <Planeta/>
          </div>
        
      </div>
      
      
      
      
      
    </div>
    
  )
}
