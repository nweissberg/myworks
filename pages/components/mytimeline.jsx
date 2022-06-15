import { useRef, useState, useEffect } from 'react'
import { Timeline } from 'primereact/timeline';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Toolbar } from 'primereact/toolbar';

const IconSet = {
    Conquista:{
      header:'Conquistas',
      icon: 'pi pi-star-fill',
      color: 'var(--icon-pallet-f)'
    },
    Formação:{
      header:'Formações',
      icon: 'pi pi-book',
      color: 'var(--icon-pallet-b)'
    },
    Emprego:{
      header:'Empregos',
      icon: 'pi pi-building',
      color: 'var(--icon-pallet-d)'
    },
    Projeto:{
      header:'Projetos',
      icon: 'pi pi-briefcase',
      color: 'var(--icon-pallet-a)'
    }
  }

const History = [
    { 
      title: 'Spawn Point',
      date: '21 - Março - 1991',
      subtitle:'São Bernardo - SP',
      text: 'Vem ao mundo um bebê!',
      type: 'Conquista'
    },{
      title: 'Colégio Hebraico Brasileiro Renascença',
      subtitle:'Ensino Fundamental',
      date: '1996 | 1998',
      text: 'Além do currículo padrão de colégio, tive aulas de carpintaria, cultura judáica e hebreu.',
      type: 'Formação'
    },{
      title: 'McNab Elementary School',
      subtitle:'Ensino Fundamental',
      date: '1998 | 2001',
      text: 'Fui com minha familia morar e estudar em Pompano Beach, FL. Currículo de colégio americano envolve Baseball, Football, aulas de programação e espanhol, além do padrão Brasileiro.',
      type: 'Formação'
    },{
      title: 'Prêmio de melhor desenho',
      subtitle:'McNab Elementary School',
      date: '1999',
      text: 'Com grafite representei a casa branca em uma A3, este foi enviado pelo colégio para um campeonado de desenhos em Washington, D.C. Fui premiado com o primeiro lugar.',
      type: 'Conquista'
    },{
      title: 'Colégio VIP',
      subtitle:'Ensino Fundamental',
      date: '2003 | 2005',
      text: 'Nessa escola tive a apção de escolher entre, japonês e espanhol... escolhi japonês! Aprendi ler Hiragana e Katakana. Também fiz judô e dança.',
      type: 'Formação'
    },{
      title: 'Fundação Escola de Comércio Álvares Penteado F.E.C.A.P.',
      subtitle:'Ensino Médio Técnico',
      date: '2005 | 2008',
      text: 'Fiz o colegial técnico em publicidade e propaganda, onde aprendi marketing, design, Flash, Corel Draw, Photoshop, Blender 3D. Também tive aulas extras no técnico de Informática, onde estudei lógica de programação, .NET, Visual Studio, Python e SQL.Programas e habilidades que uso até hoje!',
      type: 'Formação'
    },{
      title: 'Campeão de Xadrez',
      subtitle:'Olimpíadas interescolar anual da F.E.C.A.P.',
      date: '2007',
      text: 'Quase perdi na final, meu oponente falou chequemate... porém, ainda tinha uma saída, sua desatenção foi meu trunfo, virei o jogo. O prêmio foi um troféu e um pendrive Kingston 256MB.',
      type: 'Conquista'
    },{
      title: 'A.I.S. Advanced Informatics School S.A.G.A.',
      subtitle:'Design Publicitário',
      date: 'Janeiro - 2007 | Julho - 2008',
      text: 'Nesse curso aprendi como fazer composição de videos com Adobe Premiere e efeitos especiais de cinema com Adobe After Effects. Também tive a honra de conhecer meu primeiro gerente, Rogério Felix, o professor que viu um potêncial em mim e me deu meu primeiro emprego de carteira assinada.',
      type: 'Formação'
    },{
      title: 'School of Art, Game and Animation S.A.G.A.',
      subtitle:'Professor assistente',
      date: 'Outubro - 2008 | Julho - 2009',
      text: 'Junto ao coordenador Rogerio Felix, e aos professores Lucas Silva, Caio Hutter Cipó, Danielle Melo, criamos o material didático do curso de jogos que hoje é conhecido como PlayGame da escola S.A.G.A.',
      type: 'Emprego'
    },{
      title: 'Apóstrofe - Cenografia e Montagens',
      subtitle:'Designer de Cenário 3D',
      date: 'Março - 2009 | Janeiro - 2011',
      text: 'Criação e desenvolvimento de ambientes digitais para para construção de eventos, programas de televisão, shows e estandes. Arquiteto Responsável: Fernando Carvalho Jr.',
      type: 'Emprego'
    },{
      title: 'Campeão de Judô',
      subtitle:'Federação Paulista de Judô, Kaikan Tucuruvi - ACET (Associação Cultural e Esportiva de Tucuruvi).',
      date: '2010',
      text: 'Quase desisti depois de ter quebrado o naríz na primeira luta, mas minha garra e o calor do momento não me deixou entregar a toalha, já banhada em sangue. A dor me motivou ainda mais, finalizando tão rápido a última luta que quase não lembro qual foi o golpe!',
      type: 'Conquista'
    },{
      title: 'Fundação Escola de Comércio Álvares Penteado F.E.C.A.P.',
      subtitle:'Professor de Jogos',
      date: 'Janeiro - 2011 | Janeiro - 2013',
      text: 'Lecionava aulas de programação para jogos digitais em diversas linguagens (Java, Python, Visual Basic e Actionscript), para turmas do primeiro ao terceiro ano do ensino médio. Sob coordenação de Tania Aguiar e supervisão de Mario Sergio Zaize.',
      type: 'Emprego'
    },{
      title: 'Colégio Internacional Vocacional Radial',
      subtitle:'Professor de Jogos',
      date: 'Março - 2011 | Outubro - 2011',
      text: 'Ensinava ao ensino médio técnico, como criar jogos usando o software Blender 3D, desde a modelagem dos objetos tridimensionais, até publicar o jogo completo.',
      type: 'Emprego'
    },{
      title: 'Uma Propaganda',
      subtitle:'Artista digital freelancer',
      date: 'Maio - 2011 | Agosto - 2011',
      text: 'Criação de vídeos, sites, animações e artes visuais em geral. Empresa fundada pelo meu ex-professor de marketing, coordenado do colégio F.E.C.A.P. e referência de homem Alessandro Bender.',
      type: 'Emprego'
    },{
      title: 'International Game Solutions - IGS',
      subtitle:'Programador Analista',
      date: 'Março - 2012 | Julho - 2012',
      text: 'Atuei na criação de dois jogos para cassino, um chamado Triple Bônus e o outro Lucky Note. Como programador de Python no motor de jogo Blender 3D. Ambos foram apresentados em uma feira de jogos na cidade do México.',
      type: 'Emprego'
    },{
      title: 'Agência Rae,MP',
      subtitle:'Designer de jogos',
      date: 'Julho - 2012 | Setembro - 2012',
      text: 'Desenvolvimento de um Addver Game para o Volkswagen Jetta, usando o motor de jogo do Blender 3D. Construção de todos os aspectos do jogo: Modelagem, texturas, animações, programação, etc.',
      type: 'Emprego'
    },{
      title: 'Virtuale Comunicação',
      subtitle:'Programador Web Pleno',
      date: 'Janeiro - 2013 | Outubro - 2014',
      text: 'Desenvolvimento de aplicativos multi-plataforma para divulgação de produtos, softwares de administração para congressos de médicos, edição de vídeo para propaganda, animação e artes visuais. Gerente de projeto Claudio Corvello e Silva & CEO Pérsio Marcondes do Amaral',
      type: 'Emprego'
    },{
      title: 'Vancouver Film School V.F.S.',
      subtitle:'Video Game Art and Development',
      date: 'Agosto - 2014 | Dezembro - 2014',
      text: 'Fui para Vancouver no Canada, realizar um sonho, estudar Design de Jogos, onde aprofundei meus conhecimentos de Unity, Unreal Engine e como funciona o mercado de jogos digitais. Também tive o desafio de criar jogos de tabuleiro, celular e participei em Game Jams (Hat Jam), onde aprendi a fazer meu melhor o mais rápido possível.',
      type: 'Formação'
    },{
      title: 'Galpão Base & ZOOMB',
      subtitle:'Designer Programador Sênior',
      date: 'Fevereiro - 2016 | Outubro - 2016',
      text: 'Com a parceria entre Leo Ceolin Arquiteto Responsável, interatividade por Rodrigo Barbosa, inovamos em exposições com instalações interativas de vídeo game mapping. Desenvolvimento de aplicações 3D realtime com captação de voz e movimento.',
      type: 'Emprego',
      url: 'https://www.behance.net/gallery/111385517/British-Invasion-Experience',
      video: 'https://www.youtube.com/watch?v=t3XiMz6tQ7c'
    },{
      title: 'Nyco Tattoo',
      subtitle:'Tatuador autônomo',
      date: 'Novembro - 2016 | Dezembro - 2020',
      text: 'Sempre amei desenhar, ao meu ver a tatuagem é um ápice da arte. Representar uma imagem na pele de um cliente é uma honra e um processo transformador, para todas as partes envolvidas.',
      type: 'Emprego',
      url: 'www.instagram.com/nycotattoo',
      image: 'tattoos.jpg'
    },{
      title: 'Wizard by Pearson',
      subtitle:'Instrutor de Idiomas Nível 3',
      date: 'Fevereiro - 2021 | Março - 2021',
      text: 'Atuei lecionando Inglês para todos os níveis de fluência, por meio de aulas dinâmicas, criativas e interativas (Kahoot).',
      type: 'Emprego',
      image:'wizard.jpg'
    },{
      title: 'Nestlé',
      subtitle:'Desenvolvedor php',
      date: 'Março - 2021 | Junho - 2021',
      text: 'Tive a honra de participar de um projeto com duração de 2 meses atendendo a Nestlé através da Tech Mahindra. Nesse período, junto a uma equipe coordenada pelo Lucas Di Domenico Bertola, documentei e testei formulários onde migramos do PHP à JavaScript.',
      type: 'Projeto'
    },{
      title: 'Lear Corporation',
      subtitle:'Desenvolvedor Frontend Sênior',
      date: 'Junho - 2021 | Outubro - 2021',
      text: 'Para não descartar um projeto, a Tech Mahindra me alocou com a Lear Corporation, no último mês do prazo. Usando a metodologia Agile/Scrum conseguimos entregar antes que começasse a ser um prejuízo à empresa. Ficaram tão felizes com o resultado, que ganhei mais 22 dias simplesmente para executar soluções tecnológicas que havia sugerido, essas tornaram a vida dos usuários e dos administradores mais rápida e intuitiva sem tempo de loading (IndexDB). Project owner Arnoldo Liesenberg',
      type: 'Projeto'
    },{
      title: 'Canvas Terminal',
      subtitle:'Desenvolvedor Arquiteto',
      date: 'Outubro - 2021 | Março - 2022',
      text: 'O objetivo desse projeto foi de criar um webapp, que permite a criação de novos aplicativos e jogos, 2D e 3D. Uma engine de jogos feito com HTML Canvas e Javascript.',
      type: 'Projeto',
      url:'canvasterminal.web.app',
      image:'canvasterminal.jpg'
    },{
      title: 'DeepLearning.AI',
      subtitle:'Natural Language Processing in TensorFlow & Python',
      date: 'Março - 2022',
      text: 'Curso online do Laurence Moroney (Lead AI Advocate, Google) onde aprendi como criar linguagem natural usando um modelo computacional de Machine Learning em Python. Tornando possível consumir textos de um autor, então essa I.A. aprende a escrever como se fosse aquele autor. Retornando textos inéditos, muitas vezes surpreendentes!',
      type: 'Formação',
      url:'coursera.org/share/b0b0adf470ebe415b170d581787349b9',
      image:'tensorflow.jpeg'
    },{
      title: 'Suvinil',
      subtitle:'Tech Lead Arquiteto',
      date: 'Novembro - 2021 | Abril - 2022',
      text: 'Após demonstrar meu profissionalismo, dedicação e competência nos últimos projetos, fui chamado para coordenar um time de desenvolvedores, atuando como technology leader. Onde sou responsável por criar um web app em React JS, Node JS, Next JS e MS SQL, inteiramente estruturado no conceito de orientação objeto, para uma experiência responsiva, dinâmica e intuitiva, com componentes e funções reutilizáveis, para melhorar a qualidade de vida do time e de quem for cuidar do código no futuro. Cliente Suvinil, time de desenvolvimento Fabyo Silveira, Guilherme Fernandes, Allan Hopólito',
      type: 'Projeto',
      image: 'suvinil.jpg'
    },{
      title: 'Pilar Papeis',
      subtitle:'Desenvolvedor Fullstack Freelancer',
      date: 'Abril - 2022',
      text: 'Proposta do cliente: “Fazer um sistema que leia uma consulta SQL server e a partir do seu resultado crie API” Main stack: Node.js (Backend), React (Frontend) - Firebase (Serviços) Aproximadamente 40 horas de desenvolvimento, é possível conectar-se a quaisquer banco de dados SQL, criar queries e variáveis, gerar um link URL para usar como REST API, por fim receber os dados em JSON para uso em inúmeras aplicações. Gratidão Marcos Pilar pela oportunidade, muito massa sua ideia, foi um prazer desenvolve-la.',
      type: 'Projeto',
      image:'pilarpapeis.jpg',
      url:'pilarpapeisrest.web.app'
    },{
      title: 'Pokédex 3D',
      subtitle:'Desenvolvedor / Artista',
      date: 'Maio - 2022',
      text: 'Esse foi um projeto para criar união entre uma REST API (PokeAPI), um modelo 3D e HTML Canvas em um webapp responsivo. Dedico esse estudo para você fãs de Pokémon! Para ativar sua nostalgia, relembrando os melhores 151 monstrinhos.',
      type: 'Projeto',
      url:'pokedex-nyco3d.web.app',
      image:'pokedex.jpg'
    }
  ]
export default function MyTimeline(){
    const menu = useRef(null);
    const [descendente, set_descendente] = useState(true)
    const [active_history, set_active_history] = useState([...History].reverse())
    const [timeline_header, set_timeline_header] = useState('Timeline')
    
    const debounce = (fn) => {

        // This holds the requestAnimationFrame reference, so we can cancel it if we wish
        let frame;
      
        // The debounce function returns a new function that can receive a variable number of arguments
        return (...params) => {
          
          // If the frame variable has been defined, clear it now, and queue for next frame
          if (frame) { 
            cancelAnimationFrame(frame);
          }
      
          // Queue our function call for the next frame
          frame = requestAnimationFrame(() => {
            
            // Call our function and pass any params we received
            fn(...params);
          });
      
        } 
      };
    // useEffect((e)=>{
    //     // console.log('Teste')
    //     const el = document.querySelector(".stickyMask")
    //     const observer = new IntersectionObserver( 
    //       ([e]) => e.target.classList.toggle("is-pinned", e.intersectionRatio < 1),
    //       { threshold: [1] }
    //     );
    //     observer.observe(el);
    //     const storeScroll = () => {
    //       if(window.scrollY>400){
    //         document.documentElement.dataset.scroll = 1;
    //       }else{
    //         document.documentElement.dataset.scroll = 0;
    //       }
          
    //     }
        
    //     // Listen for new scroll events, here we debounce our `storeScroll` function
    //     document.addEventListener('scroll', debounce(storeScroll), { passive: true });
        
    //     // Update scroll position for first time
    //     storeScroll();
    
    //     const scrollContainer = document.querySelector(".timeline_container");
    //     const timeline = document.querySelector(".timeline");
    
    //     scrollContainer.addEventListener("wheel", (evt) => {
    //       const sw = scrollContainer.scrollLeft+window.innerWidth
    //       const tw = timeline.offsetWidth
    //       // console.log(tw, sw)
    //       if(scrollContainer.scrollLeft > 0 && tw > sw) {
    //         evt.stopImmediatePropagation()
    //         evt.stopPropagation()
    //         evt.preventDefault()
    //       };
    //       const w_ratio = window.innerHeight/window.innerWidth
          
    //       scrollContainer.scrollLeft = (scrollContainer.scrollLeft + evt.deltaY*w_ratio);
    //     });
    
    //   })
  const customizedDate = (item) => {
    return(<></>)
  }
  const customizedMarker = (item) => {
    return (
      <div>
        <Button
          style={{
            zIndex:4,
            color:IconSet[item.type]?.color,
            backgroundColor:"#0003",
            borderColor:IconSet[item.type]?.color,
            backdropFilter: "blur(7px)",
            // marginBottom:"100%"
            // top:"0px"
          }}
          tooltip={item.type}
          tooltipOptions={{
            // mouseTrack:true,
            position:"right"
          }}
          className="p-button-rounded"
          icon={IconSet[item.type]?.icon}
          />
      </div>
    );
  };

  const customizedContent = (item) => {
    return (
    <div style={{
      // height:"600px",
    //   maxWidth:"100px",
      marginTop:"30px",
      zIndex:4,
    }}>
      <h2 style={{
      
      backgroundColor:"#000",
      borderRadius:"5px",
      padding:"3px",
      color:"gray",
      fontFamily:"neuro",
      fontSize:"14px",
      position:"absolute",
      zIndex:5,
      top:"5px"
    }}>{item.date}</h2>
      <Card
        style={{
          // position:"absolute",
        //   width:"333px",
          zIndex:4,
        }}
        title={<div style={{fontFamily:'mars'}}>{item.title}</div>}
        subTitle={<div style={{fontFamily:'neuro',color:"var(--matrix-secondary)"}}>{item.subtitle}</div>}
        >
        {item.image &&
          <div>
            <img width={300} alt={item.title} src={'/image/timeline/'+item.image}/>
          </div>
          
        }
        {item.text && <p style={{fontFamily:'futura', fontSize:"22px"}}>{item.text}</p>}
          { item.url && item.url != '' &&
            <Button
              label="Abrir"
              className="p-button-text"
              icon="pi pi-link"
              tooltip={item.url}
              tooltipOptions={{
                mouseTrack:true,
                position:"top"
              }}
              onClick={(e)=>{
                window.open('https://'+item.url).focus();
            }}
            />
          }
        </Card>
          
      </div>
    );
  };

  function apply_filter(event){
    console.log(event)
    var _active_history = [...History]
    _active_history = _active_history.filter((item)=>item.type == event.item.label)
    if(descendente) _active_history = _active_history.reverse()
    set_active_history(_active_history)
    set_timeline_header(IconSet[event.item.label].header)
  }
  
  const timeline_menu = [
    {
      label: 'Eventos',
      items: [
        {
          label: 'Todos',
          icon: 'pi pi-calendar',
          command: () => {
            var _active_history = [...History]
            if(descendente) _active_history = _active_history.reverse()
            set_active_history(_active_history)
            set_timeline_header('Timeline')
          }
        },
        {
          label: 'Projeto',
          icon: 'pi pi-briefcase',
          command: apply_filter
        },
        {
          label: 'Conquista',
          icon: 'pi pi-star',
          command: apply_filter
        },
        {
          label: 'Formação',
          icon: 'pi pi-book',
          command: apply_filter
        },
        {
          label: 'Emprego',
          icon: 'pi pi-building',
          command: apply_filter
        }
      ]
    }
  ];

  return(
    <>
      <div>
      <div style={{
          position:"sticky",
          zIndex:6,
          top:"0px",
          left:"15px",
          width:"100%",
          // backgroundColor:"#f004"
        }}>
          <h2 style={{
            position:"absolute",
            marginLeft:"70px",
            marginTop:"23px",
            zIndex:10,
            // color:"var(--matrix-primary)",
            fontFamily:"mars",
            fontWeight:"100",
            fontSize:"20px",
            textAlign:"center",
          }}>{timeline_header}</h2>
          <Toolbar
            style={{
              backdropFilter: "blur(7px)",
              backgroundColor:"#0000",
              borderColor:"#0000"
              // maxWidth:"335px"
            }}
            left={
              <Button
                className='
                  p-button-sm
                  p-button-rounded
                  p-button-outlined'
                style={{
                  // marginLeft:"30%",
                }}
                tooltip="Filtrar"
                icon="pi pi-filter"
                onClick={(event) => {
                  menu.current.toggle(event)
                }}
                aria-controls="popup_menu"
                aria-haspopup
              />
            }
            right={
              <Button 
                icon={descendente? 'pi pi-sort-numeric-down-alt': 'pi pi-sort-numeric-up-alt'}
                // label={descendente?'Descendente':'Ascendente'}
                className='
                  p-button-sm
                  p-button-rounded
                  p-button-outlined
                  mr-4'
                tooltip={`Ordem: ${descendente?'Descendente':'Ascendente'}`}
                tooltipOptions={{
                  position:"bottom"
                }}
                onClick={(e)=>{
                  var _active_history = [...active_history]
                  _active_history = _active_history.reverse()
                  
                  set_active_history(_active_history)
                  set_descendente(!descendente)
                }}
              />
            }
          />
        </div>
        <Menu model={timeline_menu} popup ref={menu} id="popup_menu" />
        <div style={{
            height:"140vh",
            marginTop:"-65px",
            paddingTop:"65px",
            marginBottom:"10px",
            maxWidth:"444px",
            overflowX:"hidden",
        }}>
          
            <Timeline
                style={{
                zIndex:3,
                width:"180%",
                }}
                value={active_history}
                // layout="horizontal"
                align="right"
                // className="customized-timeline"
                // opposite={customizedDate} 
                marker={customizedMarker}
                content={customizedContent}
            />
        </div>
      </div>
    </>
  )
}
