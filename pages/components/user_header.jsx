export default function UserHeader(){
    const line_style = {
        margin:"auto",
        width:'fit-content',
        backgroundColor:"#1001",
        backdropFilter: "blur(7px)",
        borderRadius:"5px",
        marginBottom:"3px"
      }
    return(
        <div className="pointer-events-none select-none">
        <div className='flex-grow-1 w-full mt-8 ' />
        <div className="pointer-events-none select-none sticky top-0" style={{
            pointerEvents:"none",
            backgroundColor:"#fff",
            width:"150px",
            height:"150px",
            margin:"auto",
            padding:"2px",
            borderRadius:"100px"
          }}>
            <img
              style={{
                borderRadius:"100px",
              }}
              // loader={myLoader}
              src="/image/profile.jpg"
              alt="Picture of the author"
              width={146}
              height={146}
            />
          </div>
          <div style={{
            color:'white',
          }}>
          
          <div style={line_style}>
            <h3 style={{
              fontFamily:"neuro",
              // fontFamily: 'mars',
              fontWeight:"normal",
              margin:"20px",
              color:"var(--matrix-secondary)"
            }}>Desenvolvedor . Professor . Artista 3D . Tatuador</h3>
          </div>
          <div style={line_style}>
            <h2 style={{fontFamily: 'mars',margin:"20px"}}>Nycholas Weissberg</h2>
          </div>
          
          </div>
        </div>
    )
}