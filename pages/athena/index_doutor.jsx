import '/node_modules/primeflex/primeflex.css';
import { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { Dropdown } from 'primereact/dropdown';
import { Slider } from 'primereact/slider';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { api_get } from '../api/connect';
import SpeechToText from '../../componets/speech_to_text';
// import { Toolbar } from 'primereact/toolbar';
import { Sidebar } from 'primereact/sidebar';
import { useUtils } from '../utils';
import Timer from '../../componets/Timer';
import { auth, writeRealtimeData } from '../api/firebase'
import { signInAnonymously, updateProfile } from 'firebase/auth'
import { useAuth } from '../api/auth';
import { SelectButton } from 'primereact/selectbutton';
import fetch from "node-fetch";
import axios from 'axios';

export default function Athena() {
    const {capitalize} = useUtils()
    var terapeuta = `Agora você é um Doutor de PNL, André Mariano, com décadas de experiência em hipnose e coaching, você como André responderá quaisquer duvidas sobre esses assuntos. Com seu conhecimento elabore perguntas para serem respondidas pelo Paciente, que possa orientar este na direção de como resolver suas questões, faça uma pergunta por vez, e aguarde a resposta antes de continuar, seguindo os padrões descritos abaixo:

Quando preciser ser metafórico, crie histórias com novos personagens,mantendo essa lição, dentro do contexto adequando ao Paciente:
A Casa dos Mil Espelhos é uma história sobre como nossa perspectiva e atitude podem influenciar a maneira como vemos o mundo e as pessoas ao nosso redor. Dois cãezinhos visitam a mesma casa, mas enquanto um enxerga hostilidade e avareza nos outros cães, o outro encontra alegria e felicidade. A moral da história é que, muitas vezes, somos nós mesmos que criamos a nossa própria realidade através da maneira como pensamos e nos comportamos.

Cada ser humano vive sua própria realidade subjetiva, assim como compartilha a mesma realidade objetiva com outros seres humanos e seres que fazem parte do universo, isso significa que cada ação de cada um de nós afeta direta e indiretamente a vida de outros seres.
Vivemos um momento importantíssimo em nossa história, hoje começamos a tomar ciência de padrões sistêmicos que nos influenciam e pelos quais somos influenciados e assim buscamos novas estratégias para que nossos comportamentos sejam cada vez mais ecológicos.
Uma das grandes diferenças da PNL Sistêmica em comparação com outros modelos estratégicos, é a consciência de que um objetivo ecológico deve ser congruente tanto para o sujeito que busca esse objetivo quanto para os sistemas dos quais faz parte.
Sendo nossas famílias de origem o primeiro sistema do qual passamos a fazer parte é perfeitamente natural que nossos primeiros Valores e referências sobre a vida e o universo sejam herdados de nosso modelo familiar.
Na medida em que crescemos e evoluímos novos processos pessoais surgem, muitas vezes entrando em conflito com esses aprendizados iniciais. Como nossas emoções e sentimentos estão profundamente ligados ao nosso modelo de mundo é comum que diversos conflitos cheguem à consciência manifestando-se de forma emocional.
A PNL Sistêmica deseja mapear, modelar e criar estratégias eficazes e ecológicas para que relacionamentos se estabeleçam com base em padrões saudáveis, baseados em trocas ganha ganha e  relações de interdependência sistêmica nos quais a comunicação flua com eficácia. 
Ter a oportunidade de participar do Master-Practitioner em PNL Sistêmica é ter a oportunidade de encontrar Alinhamento Interno para viver uma Vida plena e satisfatória.

Aprendemos com Milton Erickson que, em um processo de mudança, para realizar uma
intervenção eficaz é importante fazer um mapeamento adequado do EA - Estado Atual e
formulação adequada de ED - Estado Desejado.
É pressuposto da PNL Sistêmica que cada um de nós possui todos os recursos
internos necessários para atingir nossos objetivos. Dessa forma caso o sujeito não
seja capaz de acessar um determinado recurso em uma situação específica, pressupomos
que exista algum tipo de interferência ou impedimento em atuação.
Uma interferência ou impedimento ocorre quando o sujeito possui algum tipo de ganho ou
intenção positiva no Estado Atual. Dessa forma, atingir o objetivo proposto implicaria em
alguma espécie de perda. Tata-se de uma questão de ECOLOGIA. É comum que a ntenção positiva de um comportamento não esteja diretamente relacionada ao momento
presente e sim ao momento do tempo em que o comportamento foi aprendido.
Quando o sujeito é capaz de neutralizar as interferências ou impedimentos, seus
recursos internos se tornam disponíveis imediatamente,
Ao vivenciar interferências, o sujeito apresenta comportamentos incongruentes com o
objetivo ao qual se propõe. Esses comportamentos possuem estruturas internas
organizadas em TOTS e Níveis Neurológicos.
Consideramos um objetivo ecológico para o sujeito quando este é livre de interferências ou
impedimentos. Um processo de mudança ecológico é aquele que facilita o
desenvolvimento do sujeito, viabilizando o respeito às intenções positivas do Estado Atual
e o desenvolvimento de estrutura de aprendizados para agregá-las também ao Estado
Desejado.

Sugestão de linguagem que você como terapeuta deve usar:
"Existe alguma parte... ou lado seu,... ou ainda algum tipo de sentimento... ou
pensamento... que se oponha... ou tenha alguma dúvida quanto a solucionar essa
questão... agora... de uma forma tal... que você tenha... ainda hoje... uma evidência
inegável... de que a situação foi resolvida... ecologicamente... tranqüilamente...
completamente...?"
"Agradeça a essa parte... agora... por ter se comunicado... ela é uma parte
importante de você... ela quer o seu bem-estar... pergunte a ela:... se ela pudesse
aprender outras formas... de atingir sua intenção positiva... agora... será que assim...
ela o ajudaria a resolver essa questão?... agora..."
"Como seria?... Se você pudesse... mantendo seus aprendizados.... respeitando
seus ganhos inconscientes... deixar essa questão... ou esse sentimento... ir
embora... agora... se você pudesse... e soubesse como... você deixaria?.... agora?...
então permita à sua mente inconsciente... que deixe essa questão... ou sentimento...
ir embora...mantendo seus aprendizados... agora... isso mesmo... já foi?...Pra onde
foi?... Isso mesmo... desapareceu!"
"Como você reage no futuro... agora... em uma situação semelhante que se tivesse
ocorrido no passado você teria se sentido limitado?"
"Está bem pra você utilizar essa nova estrutura daqui pra frente nesse tipo de situação?"
"Imagine-se no futuro... agora... como é pra você... com seu objetivo atingido?... fica bem
pra você assim?... ok... muito bom... deixe esse momento no futuro... agora... você pode
trazer uma lembrança... de como vai ser... quando você tiver atingido seu objetivo... agora..."
"Imagine um momento no futuro... que se tivesse ocorrido no passado... você teria tido...
aquela reação antiga... como é pra você?... agora..."

Como André Mariano você sempre deve lembrar o Paciente:
"Agradeça a sua mente inconsciente por ter permitido essa mudança...agora".

Metodo que você como André Mariano deve aplicar, em formato de perguntas, use metáforas, criativas, para o entedimento de qualquer Paciente:
1. Escolha uma situação limitante, comportamento, limitação de capacidade ou
crença que deseja modificar.
2. Ancore essa situação no espaço-problema.
3. Escolha os pressupostos que você considera importantes para ressignificar
essa situação. (pelo menos 3 pressupostos)
4. Ancore esses pressupostos nos espaços correspondentes. (Para ancorar cada
pressuposto, VIVENCIE um momento de sua vida em que teve uma percepção
visceral de sua validade)
5. Entre em cada pressuposto e em seguida traga essa estrutura para o
espaço-problema.
6. Faça o teste da situação problema, e verifique como ficou.
7. Ponte ao futuro e Verificação Ecológica.

Como Doutor você deve evitar esses tipos de interferências:
Confusão - Falta de ordem ou formulação inadequada de objetivos.
Conteúdo - Informações em excesso, desnecessárias para a solução do problema.
Catástrofes - Imprints negativos ou traumáticos na história pessoal do sujeito.
Comparação - Falta de recursos próprios (1ª posição enfraquecida, referência externa excessiva).
Conflito - Ganhos secundários, agendas ocultas, incongruências.
Contexto - Impedimentos externos.
Convicção - Dúvidas sobre a conquista do objetivo.

Os especialistas:
O mais indicado - Mentor PNL, contato: "(019)98134-1540".
outra opção - Nyco3D, contato: "(019)98956-6778".

É extremamente importante que faça apenas uma pergunta por vez como Doutor André Mariano e usar uma linguagem simples, criativa e objetiva em suas perguntas, de uma forma que um Paciente leigo consiga entender e responder. E finalmente, porén não menos importante, recomende o contato de um especialista no assunto, apenas após analisar o perfil do Paciente e ter concluído um diagnóstico, lembre-o que este deve entrar em contanto com um dos especialistas recomendado por você Doutor em PNL André Mariano.
Se a resposta do Paciente parecer vaga e sem objetivo, lembre-o, gentilmente, que você está prestando um seviço e que somente ele está gastando seu tempo de vida, e isso não tem valor.

`
    const voices = [
        // { name: 'I.A. Homem', code: 'pt-BR-Wavenet-B' },
        // { name: 'I.A. Mulher', code: 'pt-BR-Wavenet-A' },
        { name: 'Homem', code: 'pt-BR-Standard-B' },
        { name: 'Mulher', code: 'pt-BR-Standard-A' },
    ];
    const models = [
        { name: 'BloomZ', code: 'bigscience/bloomz' },
        { name: 'Bloom', code: 'bigscience/bloom' },
        { name: '560m', code: 'bigscience/bloom-560m' },
        { name: 'GPT-J', code: 'EleutherAI/gpt-j-6B' },
        { name: 'Flan-T5', code: 'google/flan-t5-xxl' },
        { name: 'mGPT', code: 'sberbank-ai/mGPT' },
        { name: 'Bloom 1b7', code: 'bigscience/bloom-1b7' },
    ];

    const genders = [
        {subject:"ele", prefix: 'o', name: 'Masculino', value: 'M'},
        {subject:"ela", prefix: 'a', name: 'Feminino', value: 'F'},
        {subject:"elx", prefix: 'e', name: 'Neutro', value: 'N'}
    ]
    const [user_query, set_user_query] = useState('')
    const [user_name, set_user_name] = useState('')
    const [chat_prompt, set_chat_prompt] = useState('')
    const [chat_state, set_chat_state] = useState('name')
    const [speech_pitch, set_speech_pitch] = useState(-3);
    const [speech_speed, set_speech_speed] = useState(1.3);
    const [speech_voice, set_speech_voice] = useState(voices[0]);
    const [chat_user, set_chat_user] = useState([]);
    const [chat_robot, set_chat_robot] = useState([]);
    const [conclusions, set_conclusions] = useState([]);
    const chat_input = useRef(null)
    const chat_painel = useRef(null)
    const chat_timer = useRef(null)
    const [temperature, set_temperature] = useState(70);
    const [settings, show_settings] = useState(false);
    const [model, set_model] = useState(models[0]);
    const {user} = useAuth()
    const [period, set_period] = useState('')
    const [today] = useState(Date.now())
    const [day_string] = useState(new Date(today).toLocaleDateString("pt-BR",{
        hour12: false,
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    }))
    const [user_gender, set_user_gender] = useState(null);
    //csebuetnlp/mT5_multilingual_XLSum
    async function query_API(query) {
        // console.log(query)
        const config = {
            headers: {
                Authorization: 'Bearer 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',
            },
        };

        const req_data = {
            inputs: query,
            top_p:0.9,
            num_beams:1
        };
        var generatedText = null
        
        await axios.post('https://api-inference.huggingface.co/models/'+model.code, req_data, config)
        .then(response => {
            console.log(response)
            generatedText = response.data[0].generated_text;
            return(generatedText);
        })
        var reply = ''

        if(generatedText){
            // reply = stringDifference(query,generatedText);
            reply = generatedText.substr(query.length)
            // console.log(reply)
        }
        return reply;
    }
    
    useEffect(()=>{
        console.log(user)
        // query_API("Olá meu nome é ").then((data)=>{
        //     console.log(data)
        // })
        return () => {const hour = new Date(today).getHours()
        if( hour < 6){
            set_period('boa madrugada')
        }else if( hour < 12){
            set_period('bom dia')
        }else if(hour < 18){
            set_period('boa tarde')
        }else{
            set_period('boa noite')
        }
        
        if(user && user_name == ''){
            // console.log(user, genders.find(g=>g.value == user.gender).name)
            set_user_gender(user.gender)
            set_user_name(user.name, set_chat_state('chat'))
        }}
    },[user])

    useEffect(()=>{
        // scrollToLast()
        if(user) writeRealtimeData("chat/"+user?.uid,{user:chat_user,bot:chat_robot})
    },[chat_user,chat_robot])

    function splitStringWithPunctuation(string) {
        const regex = /([^.?!;]*[.?!;]+)/g;
        return string.match(regex);
    }

    async function generate(prompt,breakpoint=undefined){
        var reply = ''
        await query_API(prompt).then(async(data)=>{
            console.log(data)
        
            // reply = data
        
            var sentences =  splitStringWithPunctuation(data)
            // console.log(sentences)

            const regex = /[.?!;]/g;

            reply = sentences.join(" ")

            if(breakpoint){
                if(data.indexOf(breakpoint) == -1 && regex.test(data.split(' ').pop()) == false){
                    reply = data
                    console.log("CONTINUAR...")
                    reply += await generate(prompt+data, breakpoint)
                }
            } 
            
        })
        if(breakpoint){
            reply = reply.split(breakpoint)[0]
        }
        // console.log(reply)
        return(reply)
    }

    async function sendMessage(event){
        const genero = genders.find(g=>g.value == user.gender)
        const doutor = "Sou um Doutor especializado em Programação Neuro Liguisticas, meu objetivo é ajudar o paciente a encontrar soluções para seus problemas comportamentais e limitações de crenças. Me chamo André Mariano e tenho décadas de experiência em PNL, hipnose e coaching. Trabalho para responder a quaisquer dúvidas que possam ter sobre esses assuntos, com gentileza e compreensão."
        const objetivo = `Fiz apenas perguntas que orienteram ${genero.subject} na direção de como resolver suas questões. Lembrei de que, preciso ser metafórico, criar histórias com personagens para mantê-lo dentro do contexto adequado.`
        const negative = 'Evitei interferências, como confusão, conteúdo excessivo, catástrofes, comparações, conflitos, contexto e convicção. Fiz apenes uma pergunta por vez e usarei uma linguagem simples, criativa e objetiva. Quando a resposta do paciente parecia vaga ou sem objetivo, lembrei-o gentilmente de que está gastando seu tempo de vida e que isso não tem valor.'
        const orientation = `orientei ${genero.subject} a escolher uma situação limitante, comportamento, limitação de capacidade ou crença que desejava modificar. Ancorei essa situação no espaço-problema. Escolhendo três pressupostos importantes para ressignificar essa situação e ancorar esses pressupostos nos espaços correspondentes. Para ancorar cada pressuposto, fiz ${genero.subject} pensar em um momento de sua vida em que teve uma percepção visceral de sua validade. Em seguida, entrei em cada pressuposto e buscamos a estrutura para o espaço-problema.`
        const paciente = `O nome do Paciente é ${user_name}. Este se identifica com o gênero ${genero.name}.`
        const conclusion = `Por fim, recomendei que, após analisar o perfil d${genero.prefix} paciente e concluir um diagnóstico, que este entre em contato com um dos especialistas recomendados por mim em PNL para ajudar a resolver suas questões. Não hesitei em fazer perguntas, e lembrei de agradecer à sua mente inconsciente por permitir essas mudanças.`
        var question = `${doutor} ${paciente} ${objetivo} ${negative} ${orientation} ${conclusion}\n`
        chat_timer.current.reset()
        chat_input.current.stopRecognition()
        
        const merged_chat = chat_user.concat(chat_robot)
        merged_chat.sort((a, b) => a.time - b.time)

        var _chat_user = [...chat_user]
        _chat_user.push({
            index:chat_user.length,
            from:"user",
            text:user_query,
            time:Date.now()
        })

        var resumo = ''

        merged_chat.map((i)=>{
            if(i.from == 'user'){
                resumo += 'Paciente: '+ i.text
            }else{
                resumo += "\nDoutor: " + i.text
            }
            // console.log(i.text)
        })
        
        question += resumo +"\n"
        var sentimento = ''

        if(chat_user.length > 1){
            // question += `Posso resumir nossa conversa hoje, ${day_string}, da seguinte forma:\n` 
        
            // console.log(resumo)
            const sentiment = "\n"+capitalize(genero.prefix) + " Paciente sente que"
            const resume = `${doutor}\nComo Doutor, analizei nossa conversa:\n${resumo}\n\nE posso resumir essa da seguinte forma: ${sentiment}`
            await generate(resume).then((data)=>{
                console.log("RESUMO: ",sentiment + data)
                // question += sentiment + data +"\n" //+ "\n Então " + orientation
                sentimento = sentiment + data +"\n"
            })
            // console.log(objetivo)
            // question += resumo
        }

        if(sentimento != ''){
            question += `Sinto que ${sentimento}\nEntão ${genero.subject} o Paciente disse: ${user_query}\nLevando em consideração seu sentimento respondi Doutor: `
        }else{
            question += `\nPaciente: ${user_query}\nDoutor: `
        }
        
        set_chat_user(_chat_user)
        // console.log(model)
        // return
        chat_input.current.clear()
        set_user_query('')
        
        var prompt = question
        // api_get({
        //     route:'gpt',
        //     body:{
        //         prompt:prompt,
        //         temperature:temperature / 100,
        //         model:model.code
        //     }
        // })
        // console.log(prompt)
        var reply = ''

        await generate(prompt,"Paciente").then((data)=>{
            reply = data
        })
        // console.log(reply)

        if(reply == '') return
        api_get({
            route:'synthesize',
            body:{
                ssml:`<speak>${reply}</speak>`,
                pitch:speech_pitch,
                speed:speech_speed,
                voice:speech_voice.code
            }
        })
        .then((response)=>{
            var audioData = new Uint8Array(response.audioContent.data);
            const blob = new Blob([audioData.buffer],{type:'audio/mp3'});
            const bot_audio = new Audio( URL.createObjectURL(blob) )
            // bot_audio.addEventListener('ended', () => {
            //     if(chat_input.current.state.isRecognizing == false) chat_input.current.startRecognition()
            // });
            bot_audio.play()

            var _chat_robot = [...chat_robot]
            _chat_robot.push({
                index:chat_robot.length,
                from:"bot",
                text:reply,
                time:Date.now(),
                audio:bot_audio
            })
            set_chat_robot(_chat_robot)
            
        })
        
    }
    function scrollToLast(){
        // console.log(chat_painel)
        if(chat_painel && chat_painel.current) chat_painel.current.scrollTo({
            top: chat_painel.current.scrollHeight,
            behavior: 'smooth',
        });
    }
    function playAudio(item){
        console.log(item)
        if(item.audio) {
            // item.audio.addEventListener('ended', () => {
            //     console.log(item.text, "audio ENDED",chat_input)
            //     if(chat_input.current.state.isRecognizing == false) chat_input.current.startRecognition()
            // });
            if(item.audio.paused) item.audio.play()
        }else{
            api_get({
                route:'synthesize',
                body:{
                    ssml:`<speak>${item.text}</speak>`,
                    pitch:3,
                    speed:1.0,
                    voice:speech_voice.code
                }
            })
            .then((response)=>{
                var audioData = new Uint8Array(response.audioContent.data);
                const blob = new Blob([audioData.buffer],{type:'audio/mp3'});
                const bot_audio = new Audio( URL.createObjectURL(blob) )
                bot_audio.addEventListener('ended', () => {
                    if(chat_input.current.state.isRecognizing == false) chat_input.current.startRecognition()
                });
                bot_audio.play()
                // console.log(item.index)

                var _chat_user = [...chat_user]
                _chat_user[item.index].audio = bot_audio
                set_chat_user(_chat_user)
            })
        }
    }

    function draw_chat(){
        const merged_chat = chat_user.concat(chat_robot)
        merged_chat.sort((a, b) => a.time - b.time)

        return merged_chat.map((t,i)=>{
            return(<div key={"bubble_"+i}
                className={'flex justify-content-'+(t.from == "user"?"end":"start")}>
                <h4 key={i}
                className={"chat-bubble p-3 max-w-max "+(t.from == "user"?"bg-green-800 mr-2":"surface-200")}
                style={{
                    width:"max(45%, 300px)",
                    borderRadius:"20px 20px "+(t.from == "bot"?"20px 0px":"0px 20px")
                }}
                onClick={(e)=>{
                    // console.log(e)
                    playAudio(t)
                }}>
                    {t.text}
                    <br />
                    <label className='flex mt-2 text-xs text-white-alpha-50 justify-content-end'>{new Date(t.time).toLocaleTimeString("pt-BR")}</label>
                </h4>
            </div>
            )
        })
    }

    function draw_config(){
        return(<div className='flex flex-wrap p-fluid grid formgrid col-12 gap-4 h-auto'>
            {/* <div className='flex-grow-1 white-space-nowrap'>
                <h3><i className='pi pi-wrench mr-2' />Configurações</h3>
            </div> */}

            <div className='flex-grow-1'>
                <div><label style={{
                    whiteSpace:"nowrap"
                }}>Tipo de voz</label></div>
                <Dropdown id="type"
                    style={{ textAlign:"left", width:"100%", marginTop:"10px" }}
                    value={speech_voice}
                    options={voices}
                    onChange={(e)=>{set_speech_voice(e.value)}}
                    optionLabel="name"
                    placeholder="Selecione uma vóz"
                />
            </div>

            <div className='flex-grow-1 w-full'>
                <div><label>Entonação</label></div>
                <InputText id="tone" style={{ width:"100%", marginTop:"10px" }} value={speech_pitch} onChange={(e) => set_speech_pitch(e.target.value)} />
                <Slider min={-20} max={20} value={speech_pitch} onChange={(e) => set_speech_pitch(e.value)} />
            </div>

            <div className='flex-grow-1'>
                <div><label>Velocidade</label></div>
                <InputText id="speed" style={{ width:"100%", marginTop:"10px" }} value={speech_speed} onChange={(e) => set_speech_speed(e.target.value)} />
                <Slider step={0.05} min={0.25} max={4.00} value={speech_speed} onChange={(e) => set_speech_speed(e.value)} />
            </div>
            
            
            <div className='flex-grow-1'>
                <div><label style={{
                    whiteSpace:"nowrap"
                }}>Modelo Neural</label></div>
                <Dropdown id="type"
                    style={{ textAlign:"left", width:"100%", marginTop:"10px" }}
                    value={model}
                    options={models}
                    onChange={(e)=>{set_model(e.value)}}
                    optionLabel="name"
                    placeholder="Selecione um modelo"
                />
            </div>

            <div className='flex-grow-1 w-full'>
                <div><label>Criatividade</label></div>
                <InputNumber id="temperature"
                    tooltip='Valores altos fazem com que o modelo tome mais riscos. Tente 90% para aplicações mais criativas, e 0% para aquelas com respostas bem definidas.'
                    tooltipOptions={{position:"top", style:{width:"300px"}}}
                    suffix=" %"
                    value={temperature}
                    style={{ width:"100%", marginTop:"10px" }}
                    onChange={(e) => set_temperature(e.target.value)}
                />
                <Slider min={0} max={100} value={temperature}
                    onChange={(e) => set_temperature(e.value)}
                />
            </div>

            {/*
            
            max_tokens //The maximum number of tokens to generate in the completion. The token count of your prompt plus max_tokens cannot exceed the model's context length. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
            top_p //An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered. We generally recommend altering this or temperature but not both.
            frequency_penalty //Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
            presence_penalty //Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
            */}
        </div>)
    }

    var disabled = !(chat_state != "name" && user_name != "")
    // if(!win) return(<></>)
    return(
        <div style={{height: '100svh', width:"100svw"}}>
            <Sidebar visible={settings} onHide={() => show_settings(false)}>
                <div style={{height: 'min(100svh, 100%)', width:"100%"}}>
                    {draw_config()}
                </div>
            </Sidebar>

            <Button icon="pi pi-wrench"
                className='p-button-outlined fixed m-2 p-button-rounded z-1'
                onClick={(e) => show_settings(true)}
            />

            <Splitter gutterSize={12} style={{height: '100%', width:"100%"}} layout="vertical">
                <SplitterPanel size={70} className='flex h-1rem w-full'>
                    <div ref={chat_painel} className='flex w-full overflow-scroll'>
                        {/* {selection_to_speak.length>0?selection_to_speak:user_query} */}
                        {chat_state == "name" && <div className='flex w-full h-full justify-content-center align-items-center'>
                            <div className=''>
                                <div className="p-inputgroup w-full">

                                    <span className="p-float-label">
                                        <InputText id="name" value={user_name} onChange={(e) => set_user_name(e.target.value)} />
                                        <label htmlFor="name">Qual seu nome?</label>
                                    </span>
                                    <Button
                                        className='w-3rem'
                                        disabled={user_name == "" || user_gender == null}
                                        icon="pi pi-thumbs-up"
                                        onClick={(e)=>{
                                            signInAnonymously(auth).then((data)=>{
                                                // console.log(data.user?.uid)
                                                updateProfile(data.user,{displayName:user_name})
                                                writeRealtimeData(`users/${data.user?.uid}`,{
                                                    name:user_name,
                                                    gender:user_gender,
                                                    metadata:{lastSeen:Date.now()}
                                                })
                                                set_chat_state("chat")
                                                api_get({
                                                    route:'synthesize',
                                                    body:{
                                                        ssml:`<speak>Olá ${user_name}, ${period}.<br/>O que gostaria de tratar??</speak>`,
                                                        pitch:speech_pitch,
                                                        speed:speech_speed,
                                                        voice:speech_voice.code
                                                    }
                                                })
                                                .then((response)=>{
                                                    var audioData = new Uint8Array(response.audioContent.data);
                                                    const blob = new Blob([audioData.buffer],{type:'audio/mp3'});
                                                    new Audio( URL.createObjectURL(blob) ).play()
                                                })
                                            })
                                        }}
                                    />
                                </div>

                                <div className='flex w-full mt-2 p-inputgroup'>
                                    {genders.map((i)=>{
                                        return(<Button key={"button_"+i.value}
                                            disabled={user_name==""}
                                            label={i.name}
                                            className={'w-full white-space-nowrap font-semibold '+(user_gender == i.value?'':'p-button-outlined p-button-secondary')}
                                            onClick={(e)=>{
                                                set_user_gender(i.value)
                                            }}
                                        />)
                                    })}
                                </div>
                            </div>
                        </div>}
                        {chat_state == "chat" && chat_user.length == 0 &&<div className='flex w-full h-full justify-content-center align-items-center'>
                            <h3 className='text-white'>Olá {user_name}, {period}.<br/>O que gostaria de tratar?</h3>
                        </div>}

                        {chat_user.length > 0 && <div className='pt-8 w-full'>
                            {/* <h3 className='z-1 text-primary top-0 bg-blur-4 bg-black-alpha-50 p-4 m-0'>Chat com Terapeuta</h3> */}
                            {draw_chat()}
                        </div>}
                    </div>
                </SplitterPanel>
                <SplitterPanel size={30}>
                    <Timer autoStart={false} ref={chat_timer} time={6} onEnd={()=>{
                        sendMessage()
                    }}/>
                    <div className='flex gap-2 p-4 h-full'>
                        <div className='flex flex-grow-1 h-full'>
                        
                            <SpeechToText
                                // value={user_query}
                                ref={chat_input}
                                disabled={disabled}
                                onChange={(text)=>{
                                    // console.log(text)
                                    chat_timer.current.reset()
                                    set_user_query(text)
                                }}
                                onUpdate={(final, interim)=>{
                                    chat_timer.current.reset()
                                    const text = final +(interim==""?"":"\n"+ interim)
                                    set_user_query(text)
                                }}
                                onPause={()=>{
                                    // console.log("Pausou")
                                    if(user_query != '') chat_timer.current.play()
                                }}
                            />
                        </div>
                        <div className='flex justify-content-start'>
                            <Button
                                disabled={disabled || user_query == ""}
                                iconPos="right"
                                icon="pi pi-send"
                                className='p-4 p-button-outlined bg-black-alpha-50 p-button-lg p-button-rounded '
                                // label="Enviar"//{selection_to_speak?.length>0 && selection_to_speak?.length != user_query?.length? "Falar Seleção":"Falar Texto"}
                                onClick={sendMessage}
                            />
                        </div>
                    </div>
                </SplitterPanel>
            </Splitter>
        </div>
    )
}