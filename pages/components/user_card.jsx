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
      <div className='p-0 m-0'>
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
            }}>{`Comunicação efetiva
Trabalho em equipe
Criatividade
Resolução de problemas
Gerenciamento de tempo
Flexibilidade
Liderança
Aprendizado contínuo`}</h2>
            
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

          <TabPanel header="Sobre">
            <div className='p-0 m-0' style={{overflow:"scroll", height:"450px"}}>
                <h3 style={{
                  fontFamily:"mars",
                  fontWeight:"800",
                  textAlign:"center",
                  color:"var(--text)",
                }}>
                  Sobre
                </h3>
              <p style={{zIndex:3, fontFamily:"futura", fontSize:"24px", margin:"0px", padding:"2px"}}>
              Sou viajante, conheci muitos lugares onde aprendi tudo o que pude pra chegar onde estou hoje, morei 3 
              anos na Flórida quando pequeno, sou alfabetizado em inglês. Comecei na programação como professor, 
              dando aula de Blender em Python, após isso minha primeira experiência como programador analista foi 
              aos 21 anos de idade, fui para o México apresentar em uma feira de casino dois jogos que fiz, estudei 
              game design aos 23 anos no Canadá, aos 24 trabalhei na Alemanha fazendo simulador de treinamento 
              médico, para angioplastia e endoscopia, depois dessas experiências dediquei um tempo da minha vida ao 
              autoconhecimento e exploração de novas culturas, passei pela França, Holanda, Istanbul e Israel onde 
              aprendi o valor da humildade, trabalhei como ajudante de obra, garçom, assistente de cozinha e faxineiro 
              de Hostel, quando voltei para o Brasil decidi seguir a arte e me tornei tatuador após me auto tatuar.
              <br/>
              <br/>
              Durante esse percurso entre o Canadá e a volta para o Brasil desenvolvi uma engine multiplataforma de aplicativos e jogos usando HTML Canvas, CSS e muito JavaScript. Cresci muito nesse processo de estudos e criação. Aos meus 29 anos, voltei ao mercado de trabalho como programador/desenvolvedor. Atendi diversos clientes criando plataformas e serviços usando React, Node e Next agora com 31, aplico esse conhecimento que acumulei durante minhas experiências, construindo projetos freelance online remotamente.
              <br/>
              <br/>
              Desafios me impulsionam, amo superar o que as pessoas dizem ser impossível. Assim que comecei a dar 
              aula no ano de 2008, um professor me disse que ninguém poderia fazer um bom jogo usando Blender, ao 
              meu ver a ferramenta não faz o artista. Claro que seria mais fácil usar um motor de jogo popular, mas 
              provei que ele estava errado, desenvolvendo Elpis The Game. No meu canal do YouTube <span style={{cursor:"pointer",fontFamily:"futura", padding:"0px",fontSize:"24px", color:"var(--matrix-primary)"}} onClick={(e)=>{setOverlay(true)}}>@Nyco3D</span>. Agradeço ao meu professor por ter me ajudado a ser o profissional que sou hoje.
              <br/>
              <br/>
              Não há um desafio que não possa ser ultrapassado, uma ferramenta que não possa ser dominada, um 
              código que não possa ser escrito e uma habilidade que não possa ser adquirida. Posso não saber como 
              fazer tudo, mas sempre busco aprender, ou encontrar uma solução para o problema. Como um artista, eu 
              amo criar e como programador amo pensar. O conhecimento esta lá fora, só devemos buscar.
              </p>
            </div>
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