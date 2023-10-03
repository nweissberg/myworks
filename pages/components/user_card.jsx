import { useState} from 'react'
import { TabView, TabPanel } from 'primereact/tabview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import SkillChart from './skill-chart';

export default function UserCard(){
  const [overlay, setOverlay] = useState(false)
  const renderFooter = (name) => {
    return (
      <div>
        <Button label="No" icon="pi pi-times" onClick={() => onHide(name)} className="p-button-text" />
        <Button label="Yes" icon="pi pi-check" onClick={() => onHide(name)} autoFocus />
      </div>
    );
  }
    return(
      <div className='p-0 m-0 w-full'>
        <div style={{
          pointerEvents:"all",
          boxShadow: "0px 0px 8px 5px #00000066",
          backgroundColor:"var(--surface-a)",
        //   maxWidth:"800px",
          zIndex:2,
          margin:"10px",
          padding:"10px",
          // marginTop:"30px",
          borderRadius:"10px",
          // paddingBottom:"10px",
        //   maxHeight:"300px",
        //   marginBottom:"0px",
        //   marginRight:"auto",
        //   marginLeft:"auto",
        //   marginBottom:"10px"
        // overflowY:"scroll"
        }}>
          
        {/* <div className='stickyMask'>
        </div> */}
        <TabView>
          <TabPanel header="Code Skills">
            <h3 style={{
                fontFamily:"mars",
                fontWeight:"800",
                textAlign:"center",
                color:"var(--text)",
              }}>Code skills</h3>
            <SkillChart />
            <Button className='p-button-text w-full shadow-none p-button-rounded' label="Open in Code Signal"
              onClick={(e)=>{
                window.open('https://app.codesignal.com/evaluation-result/ENBNRnY6qwg8jY6Tr?accessToken=MX6DyhdnNkfDHM6Wq-tLmf3fgWfGiswdZP7voYRBTk').focus();
              }}
            />
          </TabPanel>
          <TabPanel header="Soft Skills">
            <h3 style={{
              fontFamily:"mars",
              fontWeight:"800",
              textAlign:"center",
              color:"var(--text)",
            }}>Soft skills</h3>
            <h2 style={{
              position:"relative",
              fontFamily:"neuro",
              fontWeight:"100",
              textAlign:"center",
              color:"var(--matrix-primary)",
              // background:"black",
              // fontSize:"20px",
              whiteSpace:"pre-wrap",
              zIndex:3
            }}>{`Effective Communication
Teamwork
Creativity
Problem Solving
Time Management
Adaptability
Leadership
Continuous Learning`}</h2>
            
          </TabPanel>
          
          <TabPanel header="Top Skills">
            <div >

              <h3 style={{
                fontFamily:"mars",
                fontWeight:"800",
                textAlign:"center",
                color:"var(--text)",
              }}>Top Skills</h3>

              <DataTable size="small" showGridlines
              // style={{margin:"0px", padding:"0px"}}
              // className='p-0 m-0'
              value={[
                { 
                  code:'Javascript',
                  framework:'Node JS',
                  software:'Blender3D',
                  service:'Google Cloud'
                },
                {
                  code:'Phyton',
                  framework:'React JS',
                  software:'Photoshop',
                  service:'Azure Cloud'
                },
                {
                  code:'HTML5',
                  framework:'Next JS',
                  software:'Visual Code',
                  service:'Dev Ops'
                },
                {
                  code:'CSS',
                  framework:'Express Server',
                  software:'After Effects',
                  service:'Firebase'
                },
                {
                  code:'SQL / NoSQL',
                  framework:'Three JS',
                  software:'Azure Data Studio',
                  service:'REST APIs'
                },
                {
                  code:'C++ / C#',
                  framework:'Prime React',
                  software:'Sculptris',
                  service:'Github'
                },
                {
                  code:'PHP / JAVA',
                  framework:'Sakai',
                  software:'Visual Studio',
                  service:'SendGrid'
                }
                
                
                ]} responsiveLayout="scroll">
                <Column field="code" header="Code"></Column>
                <Column field="framework" header="Framework"></Column>
                <Column field="software" header="Software"></Column>
                <Column field="service" header="Service"></Column>
              </DataTable>
            </div>
          </TabPanel>

          <TabPanel header="About">
            <div className='p-0 m-0' style={{overflow:"scroll", height:"450px"}}>
                <h3 style={{
                  fontFamily:"mars",
                  fontWeight:"800",
                  textAlign:"center",
                  color:"var(--text)",
                }}>
                  About
                </h3>
              <p style={{zIndex:3, fontFamily:"futura", fontSize:"24px", margin:"0px", padding:"2px"}}>
              {"I'm a traveler, and I've had the privilege of exploring many places where I absorbed all I could to reach where I am today. I spent three years in Florida as a child, and that's where I became literate in English. My journey into programming began as a teacher, instructing Blender in Python. At the age of 21, I had my first experience as an analyst programmer. At 21, I traveled to Mexico to showcase two casino games I had created. At 23, I studied game design in Canada, and by 24, I was working in Germany, developing medical training simulators for angioplasty and endoscopy. After these adventures, I dedicated some time to self-discovery and exploring new cultures. I passed through France, the Netherlands, Istanbul, and Israel, where I learned the value of humility and worked various jobs like construction helper, waiter, kitchen assistant, and hostel cleaner. Upon returning to Brazil, I decided to follow my passion for art and became a tattoo artist after giving myself a tattoo."}
              <br/>
              <br/>
              {"During my journey from Canada back to Brazil, I developed a multi-platform app and game engine using HTML Canvas, CSS, and a lot of JavaScript. I grew immensely during this period of study and creation. At the age of 29, I reentered the job market as a programmer and developer, serving various clients by creating platforms and services using React, Node, and Next. Now, at 31, I apply the knowledge I've accumulated from my diverse experiences to build freelance projects online, working remotely."}
              <br/>
              <br/>
              {"Challenges drive me, and I relish overcoming what others consider impossible. Back in 2008, when I started teaching, a professor told me that no one could create a good game using Blender. In my view, the tool doesn't make the artist. While it might have been easier to use a popular game engine, I proved him wrong by developing Elpis The Game, which you can find on my YouTube channel "}<span style={{cursor:"pointer",fontFamily:"futura", padding:"0px",fontSize:"24px", color:"var(--matrix-primary)"}} onClick={(e)=>{setOverlay(true)}}>@Nyco3D</span>{". I am grateful to my teacher for helping shape me into the professional I am today."}
              <br/>
              <br/>
              {"There's no challenge that can't be conquered, no tool that can't be mastered, no code that can't be written, and no skill that can't be acquired. I may not know everything, but I always seek to learn and find solutions to problems. As an artist, I love to create, and as a programmer, I love to think. Knowledge is out there; we just need to seek it."}
              </p>
            </div>
          </TabPanel>
        </TabView>
        
        
        </div>
        
        <Dialog
          header="Video"
          visible={overlay}
          // maximizable
          onHide={() => {setOverlay(false)}}
        >
          <div>
          <iframe
            style={{
              width:"60vh",
              aspectRatio:1,
              backgroundColor:"black"
            }} 
            src="https://www.youtube.com/embed/Vqe4LSGmwOg? &loop=1&showinfo=0&rel=0"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
          </div>
            
        </Dialog>
      
      </div>
    )
}