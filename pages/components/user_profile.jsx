
import UserHeader from './user_header';
import SocialBar from './socialbar';
import UserCard from './user_card';
import Planeta from '../planeta';

export default function UserProfile(){
    return(
        <div className='top-0 hide-scroll pointer-events-none overflow-scroll' style={{
            position:"relative",
            zIndex:4,
            height:"100%",
            margin:"0px",
            padding:"0px"
        }}>
            <div className=' pointer-events-none m-0 p-0 pt-3 pb-1' >
                
                <div  className='pointer-events-none' style={{
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign:"center",
                    pointerEvents:"none"
                }}>
                    <div className='pointer-events-none' style={{
                        pointerEvents:"none"
                    }}>
                        <UserHeader />
                    </div>
                
                
                </div>
                <SocialBar />
                <UserCard />
                {/* <div className='stickyMask'>
                </div> */}
                
            </div>
        </div>
    )
}