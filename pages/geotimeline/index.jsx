
// import styles from '../../../styles/Home.module.css'
import styles from '../../styles/Home.module.css'
import { useRouter } from 'next/router'
import TimeLine from './Timeline'
import Planeta from './Planet'
import { useEffect,useState } from 'react'
import localforage from 'localforage'
import MatrixBackGround from '../components/matrix_bg'

export default function Home() {
  const [user_timeline, set_user_timeline] = useState([])

	useEffect((e)=>{
		localforage.getItem('user_timeline').then((data)=>{
			if(!data) return
			set_user_timeline(data)
			console.log(data)
		})
	},[])
  
  const router = useRouter()

  
  return (
    <div>
      <div style={{
        position:"absolute",
				width:"100vw",
        zIndex:0,
				// pointerEvents:"all",
    }}>
        {/* <MatrixBackGround/> */}
        
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
          style={{
						zIndex:1
					}}>
            <TimeLine  pins={user_timeline} setPins={(data)=>{
								set_user_timeline(data)
						}}/>
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
            {/* <UserProfile /> */}
          
        </div>
        
      </div>
      <div style={{
        position:"absolute",
        // top:"10px",
        
        overflow:"hidden",
        width:"100vw",
        height:"100vh",
        zIndex:0
        }}>
          <div style={{
            position:"absolute",
            left:"calc(-20vw + 200px)",
            width:"100vw",
            height:"100vh",
          }}>
            {/* <Planeta/> */}
						<Planeta pins={user_timeline}/>
          </div>
        
      </div>
      
      
      
      
      
    </div>
    
  )
}
