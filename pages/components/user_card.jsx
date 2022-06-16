import { useState} from 'react'
import { TabView, TabPanel } from 'primereact/tabview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

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
        <>
        <div style={{
          pointerEvents:"all",
          boxShadow: "0px 0px 8px 5px #00000066",
          backgroundColor:"var(--surface-a)",
        //   maxWidth:"800px",
          zIndex:2,
          margin:"10px",
          padding:"10px",
          marginTop:"30px",
          borderRadius:"10px",
          paddingBottom:"10px",
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
              whiteSpace:"pre-wrap",
              zIndex:3
            }}>{`Comunicação efetiva
Trabalho em equipe
Criatividade
Resolução de problemas
Liderança
Extrovertido
Transparente
Adaptável`}</h2>
            
          </TabPanel>
          
          <TabPanel header="Top Skills">
            <h3 style={{
              fontFamily:"mars",
              fontWeight:"800",
              textAlign:"center",
              color:"var(--text)",
            }}>Top Skills</h3>

            <DataTable size="small" showGridlines value={[
              { 
                code:'Javascript / JAVA',
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
                code:'SQL / NoSQL',
                framework:'Express Server',
                software:'After Effects',
                service:'Firebase'
              },
              {
                code:'C++ / C#',
                framework:'Three JS',
                software:'Azure Data Studio',
                service:'REST APIs'
              },
              {
                code:'CSS',
                framework:'Prime React',
                software:'Sculptris',
                service:'Github'
              },
              {
                code:'PHP',
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
          </TabPanel>

          <TabPanel header="Sobre">
            <h3 style={{
            fontFamily:"mars",
            fontWeight:"800",
            textAlign:"center",
            color:"var(--text)",
          }}>Sobre</h3>
          <p style={{zIndex:3, fontFamily:"futura", fontSize:"24px"}}>
            Minha carreira começou como professor, estranho não…? Na verdade, como um
            estudante apaixonado em criar, meu próprio videogame. Não apenas para contar uma história,
            mas para criar mundos com heróis e criaturas míticas. Então estudei, muito <span style={{cursor:"pointer",fontFamily:"futura", padding:"0px",fontSize:"24px", color:"var(--matrix-primary)"}} onClick={(e)=>{setOverlay(true)}}>vídeo portfólio</span>;
            Consequentemente minha jornada tornou-se, passar o conhecimento que adquiri, para aqueles
            que sonharam, o mesmo desejo meu coração fez.
          </p>
          </TabPanel>
        </TabView>
        
        
        </div>
        
        <Dialog
          header="Video"
          visible={overlay}
          maximizable
          onHide={() => {setOverlay(false)}}
        >
          <div>
          <iframe style={{
            width:"60vh",
            aspectRatio:1,
            backgroundColor:"black"
          }} src="https://www.youtube.com/embed/Vqe4LSGmwOg" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
          </div>
            
        </Dialog>
      
        </>
    )
}