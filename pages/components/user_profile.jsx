
import UserHeader from './user_header';
import SocialBar from './socialbar';
import UserCard from './user_card';
import Planeta from '../planeta';

export default function UserProfile(){
    return(
        <>
            <div style={{
                zIndex:2,
            }}>
                
                <div style={{
                justifyContent: "center",
                alignItems: "center",
                textAlign:"center"
                }}>
                    {/* <div style={{
                        pointerEvents:"none"
                    }}> */}
                        <UserHeader />
                    {/* </div> */}
                
                
                </div>
                <SocialBar />
                <UserCard />
                {/* <div className='stickyMask'>
                </div> */}
                
            </div>
        </>
    )
}