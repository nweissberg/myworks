export default function TimeLine(){
    return(
        <>
        <div style={{
            pointerEvents:"none",
            zIndex:4,
            position:"absolute",
            right:"0px",
            backgroundColor:'var(--glass)',
            width:'33vw',
            minWidth:'200px',
            height:'100vh',
            backdropFilter: "blur(20px)",
        }}></div>
        </>
    )
}