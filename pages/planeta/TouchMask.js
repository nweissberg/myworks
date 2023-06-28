export default function TouchMask() {
return(
    <>
        <div className='hide-on-mobile' style={{
            position:"absolute",
            marginLeft:"calc(100% - 33%)",
            height:"100%",
            width:"33%",
            zIndex:4,
            // backgroundColor:"blue"
        }}/>
        <div className='hide-on-mobile' style={{
            position:"absolute",
            // top:"0px",
            height:"100%",
            width:"33%",
            zIndex:4,
            // backgroundColor:"blue"
        }}/>
        <div style={{
            position:"absolute",
            // top:"0px",
            height:"22%",
            width:"100%",
            zIndex:4,
            // backgroundColor:"red"
        }}/>
        <div style={{
            position:"absolute",
            marginTop:"calc(100% - 22%)",
            height:"22%",
            width:"100%",
            zIndex:4,
            // backgroundColor:"red"
        }}/>

        <div style={{
            position:"absolute",
            marginLeft:"calc(100% - 10%)",
            height:"100%",
            width:"10%",
            zIndex:4,
            // backgroundColor:"green"
        }}/>
        <div style={{
            position:"absolute",
            // top:"0px",
            height:"100%",
            width:"10%",
            zIndex:4,
            // backgroundColor:"green"
        }}/>
    </>
    )
}