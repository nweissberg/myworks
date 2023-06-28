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
import { Sidebar } from 'primereact/sidebar';
import { normalize, similarText, splitStringWithPunctuation, useUtils, var_get, var_set, yamlDocToJSON } from '../utils';
import Timer from '../../componets/Timer';
import { auth, readRealtimeData, writeRealtimeData } from '../api/firebase'
import { signInAnonymously, updateProfile } from 'firebase/auth'
import { useAuth } from '../api/auth';
import axios from 'axios';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import ChatContextMenu from './components/context_menu';
import upload_file from '../api/firebase_storage';
import { MultiSelect } from 'primereact/multiselect';
import ImageEditor from './components/image_editor';
import ChatScroller from './components/chat_timeline';
import { ToggleButton } from 'primereact/togglebutton';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useAthena } from './athena_context';
import { Tooltip } from 'primereact/tooltip';
import generate_image, {
    generate_prompts,
    generate_text_stream,
    HF_api_keys,
    playBase64EncodedFlacAudio,
    prompt_score,
    summerize_text,
    zero_shot_classification,
    text_to_voice,
    uniqueWords,
    text_language_detection
} from './interface_api';


export default function Athena() {
    const {capitalize, blob_to_image, createId, clone_array, is_mobile} = useUtils()
    const {assistant, brain_data , set_code, language, setLanguage} = useAthena()
    const [image_models, set_image_models] = useState([

        { name: 'Microscopic', from:'Fictiverse', code: 'Fictiverse/Stable_Diffusion_Microscopic_model', keys:['Microscopic'] },
        { name: 'Voxel Art', from:'Fictiverse', code: 'Fictiverse/Stable_Diffusion_VoxelArt_Model', keys:['VoxelArt'] },
        { name: 'Paper Cut', from:'Fictiverse', code: 'Fictiverse/Stable_Diffusion_PaperCut_Model', keys:['PaperCut'] },
        { name: 'Vectorartz Diffusion',from:'coder119', code: 'coder119/Vectorartz_Diffusion', keys:['vectorartz']},
        // { name: 'ARTificial Journey 1.0',from:'Kaludi', code: 'Kaludi/ARTificialJourney-v1.0-768', keys:['artificial-journey style']},
        // { name: 'SD21 E621 Rising 2.0',from:'hearmeneigh', code: 'hearmeneigh/sd21-e621-rising-v2'},
        { name: 'Counterfeit 2.0',from:'GSDF', code: 'gsdf/Counterfeit-V2.0'},
        // { name: 'Stable Diffusion 2.1 Unclip',from:'Stability AI', code: 'stabilityai/stable-diffusion-2-1-unclip'},
        // { name: 'Dreamlike Photoreal',from:'Dreamlike Art', code: 'dreamlike-art/dreamlike-photoreal-2.0'},
    ])
    const [voices, set_voices] = useState([])
    var synth = window.speechSynthesis;
    var voice
    var voices_synth = []
    var lang = language
    
    async function set_voice_synth(test_text){
        lang = await text_language_detection(test_text).then((lang_option)=>{
            return normalize(lang_option[0].label).split(' ')[0]
        })
        if(voice){

            console.log(lang)
            voice = synth.getVoices().filter(v=> v.lang.indexOf(lang) != -1 && v.lang.indexOf("-"+lang.toLocaleUpperCase()) == -1).at(0)
            console.log('Detected '+voice.lang)
            setLanguage(voice.lang)
            lang = voice.lang
            set_speech_voice(voice)
        }
        return voice
    }   
    
    async function SpeechSynth(attributes, get_voice = false){
        // set_code(voices_synth)
        // console.log(attributes.text)
        if(get_voice){
            voice = await set_voice_synth(attributes.text)
        }else{
            voice = voices[0]
        }
        // console.log(voice)
        var attributes = ( attributes == undefined ) ? {} : attributes;
        var msg = new SpeechSynthesisUtterance();
        msg.voice = voice
        msg.voiceURI = voice.voiceURI
        msg.volume = ( attributes["volume"] != undefined ) ? attributes["volume"] : 2;
        msg.rate = ( attributes["rate"] != undefined ) ? attributes["rate"] : 1.2;
        msg.pitch = ( attributes["pitch"] != undefined ) ? attributes["pitch"] : 0.7;
        msg.text = ( attributes["text"] != undefined ) ? attributes["text"] : " ";
        msg.lang = language
        // msg.rvIndex = 0;
        // msg.rvTotal = multipartText.length;
        synth.speak(msg)
        
    }

    // const loadData = () => {
    //     fetch('/data/tokens/sd21-e621-rising-v2.json')
    //     .then(response => response.json())
    //     .then(json => {
    //         console.log(Object.entries(json).filter(([key,value])=>{
    //             if(value>=1000){
    //                 return(key)
    //             }
    //         }).sort((a,b)=>a[1]-b[1]).slice(0,30).map(t=>t[0]).join(', '))
    //     })
    //     .catch(error => console.error(error));
    // }

    useEffect(()=>{
        if(brain_data){
            // set_code(Object.values(brain_data.image.generate))
            set_image_models(Object.values(brain_data.image.generate))
            set_painter_models([brain_data.image.generate['prompthero/openjourney-v4']])
        }
    },[brain_data])
    
    const text_models = [
        { name: 'Bloom560m', code: 'bigscience/bloom-560m' },
        { name: 'BloomZ', code: 'bigscience/bloomz' },
        { name: 'Bloom', code: 'bigscience/bloom' },
        { name: 'Flan-T5', code: 'google/flan-t5-xxl' },
        { name: 'Magic Prompt', code: 'Gustavosta/MagicPrompt-Stable-Diffusion'},
        { name: 'GPT-J', code: 'EleutherAI/gpt-j-6B' },
        { name: 'mGPT', code: 'sberbank-ai/mGPT' },
        { name: 'gpt4-x-alpaca-13b-native-4bit-128g', code: 'anon8231489123/gpt4-x-alpaca-13b-native-4bit-128g' },
        // { name: 'Bloom 1b7', code: 'bigscience/bloom-1b7' },
    ];
    

    const classification = [
        {name:'Blip Image Captioning Large',from:'Sales Force', code:'Salesforce/blip-image-captioning-large'},
        {name:'Bart Large MNLI',from:'Facebook', code:'facebook/bart-large-mnli'}
    ]

    const conversation = [
        {name:'DialoGPT Large',from:'Microsoft', code:'microsoft/DialoGPT-large'},
        {name:'GODEL 1.1',from:'Microsoft', code:'microsoft/GODEL-v1_1-large-seq2seq'},
        {name:'Blender Bot 3B',from:'Facebook', code:'facebook/blenderbot-3B'},
        {name:'Blender Bot 400M',from:'Facebook', code:'facebook/blenderbot-400M-distill'},
    ]

    // {inputs: "Hi, I recently bought a device from your company but it is not working as advertised and I would like to get reimbursed!", parameters: {candidate_labels: ["refund", "legal", "faq"]}}
    const image_samplers = [
        { name: 'Default', code: 'k_lms', id:'default'},
        { name: 'Karras SDE', code: 'dpm++_sde_karras'},
        { name: 'Karras 2SA', code: 'dpm++_2s_a_karras', id:'karras_2sa'},
        { name: 'Karras 2M', code: 'dpm++_2m_karras'},
        { name: 'Euler Ancestral', code: 'k_euler_ancestral'},
    ]

    const genders = [
        {subject:"ele", prefix: 'o', name: 'Masculino', value: 'M'},
        {subject:"ela", prefix: 'a', name: 'Feminino', value: 'F'},
        {subject:"elx", prefix: 'e', name: 'Neutro', value: 'N'}
    ]
    const [user_query, set_user_query] = useState('')
    const [user_name, set_user_name] = useState('')
    const [max_history, set_max_history] = useState(600)
    const [chat_state, set_chat_state] = useState('name')
    const [speech_pitch, set_speech_pitch] = useState(-3);
    const [speech_speed, set_speech_speed] = useState(1.2);
    const [speech_voice, set_speech_voice] = useState(voices[0]);
    const [painter_models, set_painter_models] = useState([image_models[0]]);
    const [painter_auto, set_painter_auto] = useState(true);
    const [painter_sampler, set_painter_sampler] = useState(image_samplers[3]);
    const [painter_seed, set_painter_seed] = useState(-1);
    const [painter_steps, set_painter_steps] = useState(22);
    const [painter_cfg, set_painter_cfg] = useState(7.5);
    const [painter_batch, set_painter_batch] = useState(2);
    const [painter_width, set_painter_width] = useState(256);
    const [painter_height, set_painter_height] = useState(256);
    const [chat_user, set_chat_user] = useState([]);
    const [chat_bot, set_chat_bot] = useState([]);
    const [chat_painter, set_chat_painter] = useState([]);
    const [image_galery, set_image_galery] = useState([0,null]);
    const [chat_action, set_chat_action] = useState(null);
    const chat_input = useRef(null)
    const chat_painel = useRef(null)
    const splitter = useRef(null)
    const chat_timer = useRef(null)
    const [temperature, set_temperature] = useState(70);
    const [settings, show_settings] = useState(false);
    const [exit, set_exit] = useState(false);
    const [show_sidebar, set_show_sidebar] = useState(is_mobile);
    const [model, set_model] = useState(text_models[0]);
    const {user} = useAuth()
    const [period, set_period] = useState('')
    const [test_image, set_test_image] = useState(null)
    const [today] = useState(Date.now())
    const [thinking, set_thinking] = useState(0);
    const toast = useRef(null);
    const [day_string] = useState(new Date(today).toLocaleDateString("pt-BR",{
        hour12: false,
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    }))
    const [user_gender, set_user_gender] = useState(null);
    const [model_option, set_model_option] = useState(null);
    const accept = () => {
        toast.current.show({ severity: 'warn', summary: 'Confirmado', detail: 'Sua conversa foi apagada.', life: 3000 });
        writeRealtimeData("chat/"+user?.uid,null).then(()=>{
            set_chat_user([])
            set_chat_bot([])
            set_chat_painter([])
        })
    }

    const reject = () => {
        // toast.current.show({ severity: 'info', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    }

    const confirmPosition = (position) => {
        confirmDialog({
            message: 'Você tem certeza que quer deletar toda a conversa? Essa ação não poderá ser desfeita.',
            header: 'Apagar o Chat',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger p-button-text',
            rejectClassName: 'p-button-secondary p-button-text',
            acceptLabel:"Sim",
            acceptIcon:"pi pi-trash",
            rejectIcon:"pi pi-times",
            rejectLabel:"Não",
            className:"w-full max-w-30rem",
            position,
            accept,
            reject
        });
    };

    async function upscale_API(image_string) {
        // console.log(query)
        const api_keys = [
            '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',
            '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',
            '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'
        ]

        const key =  api_keys[Math.max(0,chat_user.length % (api_keys.length))]
        // console.log(key)

        const head = {
            headers: { "Content-Type": "application/json" },
        };

        const req_data = {
            body: JSON.stringify({
                data: [
                    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==",
                    "Upscaler 2x",
                    "masterpiece, mdjrny-v4, Imagine a picture of a car flying through a futuristic city, neon skylight, 3d render, unreal engine 5, 4k, trending on artstation, volumetric lighting",
                    "bad art, undefined, extra legs, morbid, poorly drawn face, ugly, grayscale, cloned face, missing fingers, worst quality, cartoon, easynegative, poorly drawn hands, bad anatomy, mutated, normal quality, mutated hands, disfigured, extra digit, fused fingers, lowres, extra fingers, logo, blurry, jpeg artifacts, extra limbs, mutation, monochrome, fewer digits, deformed, missing legs, malformed limbs, bad promotions, multilated, cropped, bad hands, missing arms, artist name, text",
                    7,
                    20,
                    608716149,
                ]
            }),
        };
        var generatedImage = null
        
        await axios.post("https://manjushri-sd-2x-and-4x-upscaler-gpu.hf.space/run/predict", req_data, head)
        .then(response => {
            console.log(response)
            // generatedText = response.data[0].generated_text;
            // return(generatedText);
        })
    }

    async function photoreal_api(query_string) {
        return new Promise(async (resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "http://db95-34-142-139-126.ngrok.io/generate");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                resolve(JSON.parse(xhr.responseText));
            }
            console.log(xhr.responseText)
            };
            xhr.send(JSON.stringify({
                "imagine":"hyper realistic photograph, portrait of a tattooed southamerican indigenous black woman, future punk, gold tattoo line, side profile, summer, dramatic light, looking down, film grain, Leica 50mm, Kodak portra 800, chiaroscuro, f1.4, golden hour",
                "forget":"easynegative, blury, defor med, cropped, out of frame"
            }));
        });
    }
      

    // async function photoreal_api(query_string) {

    //     const head = {
    //         headers: { "Content-Type": "application/json",
    //                     "Access-Control-Allow-Origin": "*",
    //                     "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
    //                 },
    //     };

    //     const req_data = {
    //         "imagine":"hyper realistic photograph, portrait of a tattooed southamerican indigenous black woman, future punk, gold tattoo line, side profile, summer, dramatic light, looking down, film grain, Leica 50mm, Kodak portra 800, chiaroscuro, f1.4, golden hour",
    //         "forget":"easynegative, blury, defor med, cropped, out of frame"
    //     }
    //     var generatedImage = null
        
    //     await axios.post("http://3814-34-142-139-126.ngrok.io/generate", req_data, head)
    //     .then(response => {
    //         console.log(response)
    //         generatedImage = response.images
    //         // generatedText = response.data[0].generated_text;
    //         return(generatedImage);
    //     })
    // }

    useEffect(()=>{
        console.log(language)
        if(!language) return
        synth = window.speechSynthesis;
        var v = synth.getVoices();

        for (var i = v.length - 1; i >= 0; i--) {
            let _v = v[i]
            let _lang = _v.lang.toLocaleLowerCase()
            if((_lang.indexOf(language.slice(0,2)) != -1 && 
                _lang.indexOf(language.slice(4)) != -1)){
                
                _v.code = _v.voiceURI
                voices_synth.push(_v)
            }
        }
        // console.log(voices_synth)
        set_voices(voices_synth)
    },[language])

    async function query_API_new(query,breakpoint,max) {
        console.log(query,breakpoint)
        const index = Math.max(0,chat_user.length % (HF_api_keys.length))
        const key =  HF_api_keys[index]
        console.log(key)
        var generatedText = null
        await generate_text_stream(query,max,key).then(response => {
            console.log(response)
            generatedText = response;
            return(generatedText);
        })

        var reply = ''

        if(generatedText){
            // reply = stringDifference(query,generatedText);
            reply = generatedText.substr(query.length)
            console.log(reply)
        }
        return reply;
    }

    //csebuetnlp/mT5_multilingual_XLSum
    async function query_API(query) {
        console.log(query)
        const api_keys = [
            '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',
            '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',
            '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'
        ]

        const key =  api_keys[Math.max(0,chat_user.length % (api_keys.length))]
        console.log(key)

        const head = {
            headers: {
                Authorization: 'Bearer '+ key,
            },
        };

        const req_data = {
            inputs: query,
            top_p:0.9,
            num_beams:1
        };
        var generatedText = null
        
        await axios.post('https://api-inference.huggingface.co/models/'+model.code, req_data, head)
        .then(response => {
            console.log(response)
            generatedText = response.data[0].generated_text;
            return(generatedText);
        })
        var reply = ''

        if(generatedText){
            // reply = stringDifference(query,generatedText);
            reply = generatedText.substr(query.length)
            console.log(reply)
        }
        return reply;
    }
    
    useEffect(()=>{
        
        // console.log(user)
        // query_API("Olá meu nome é ").then((data)=>{
        //     console.log(data)
        // })
        
        const hour = new Date(today).getHours()
        if( hour < 6){
            set_period('boa madrugada')
        }else if( hour < 12){
            set_period('bom dia')
        }else if(hour < 18){
            set_period('boa tarde')
        }else{
            set_period('boa noite')
        }
        if(user) readRealtimeData("chat/"+user?.uid).then(data=>{
            // console.log(data)
            if(data){
                if(data.user) set_chat_user(data.user)
                if(data.bot) set_chat_bot(data.bot)
                if(data.painter) set_chat_painter(data.painter)
                set_user_gender(user.gender)
            }
        })

        var_get('diffusion_options').then(data=>{
            if(data){
                const sys = JSON.parse(data)
                // set_painter_batch(sys.models.length)
                set_painter_seed(sys.seed)
                set_painter_sampler(image_samplers.find((sampler)=>sampler.code == sys.sampler))
                set_painter_steps(sys.steps)
                set_painter_width(sys.width)
                set_painter_height(sys.height)
                set_painter_cfg(sys.cfg_scale)
            }
            // console.log()
        })
        // if(user) set_user_name(user.name, set_chat_state('chat'))
        if(user){
            // loadBrain()
            // console.log(user, genders.find(g=>g.value == user.gender).name)
        
            set_user_gender(genders.find(g=>g.value == user.gender).name)
            set_user_name(user.name, set_chat_state('chat'))
        }
        
        if(voices_synth.length) set_speech_voice(voices_synth[0])

    },[user])

    useEffect(()=>{
        if(user && !(chat_user.length == 0 && chat_bot.length == 0 && chat_painter.length == 0)){
            writeRealtimeData("chat/"+user?.uid,{user:chat_user,bot:chat_bot, painter:chat_painter})
            
        }
    },[chat_user,chat_bot,chat_painter])

    useEffect(()=>{
        // console.log(thinking)
        // scrollToLast()
    },[thinking])

    async function generate(prompt,breakpoint=undefined,max=100){
        var reply = ''
        set_thinking(thinking=>thinking+1)
        await query_API(prompt,breakpoint,max).then(async(data)=>{
            const regex_point_end = /[.?!;]/g;
            // if(data!='' && regex_point_end.test(data.split(' ').pop()) == true && breakpoint ) {
            //     botReply(data)
            //     return(data)
            // }
            console.log(data)
            var tokens = (prompt+" "+data).split(' ').filter(c=>c!="")

            reply = data

            if(data != '' && (breakpoint || tokens.length <= max) && regex_point_end.test(data.split(' ').pop()) == false){
                if( (!data.includes(assistant[language].server+":") && breakpoint == true) || (!data.includes(breakpoint) && breakpoint != true) ){
                    if(tokens.length <= max){
                        console.log(`...${tokens.length}:tokens...`)
                        const continuation = await generate(prompt+" "+data, breakpoint, max)
                        const similarity = similarText(reply,continuation)
                        if(similarity <= 0.5){
                            reply += continuation
                        }
                    }
                }
            }
            var sentences = splitStringWithPunctuation(reply)
            if(sentences){
                reply = sentences.join(" ")
            }
        })
        if(breakpoint != true){
            reply = reply.split(breakpoint)[0].split(assistant[language].server+":")[0]
        }
        return(reply)
    }
    async function getRating(txt_a, txt_b){
        var ratting = 'NO'
        await generate(`A: "${txt_a}"\B: "${txt_b}"\n With a simple YES or NO is sentence A better than B?`)
        .then((data)=>{
            if(data != '') ratting = data
            console.log("Is A better than B?"+ratting)
        })
        return(ratting)
    }
    
    
    
    function similarWord(a,b) {
        var lA = a.length;
        var lB = b.length;
        var equivalency = 0;
        var minLength = (lA > lB) ? lB : lA;
        var maxLength = (lA < lB) ? lB : lA;
        for(var i = 0; i < minLength; i++) {
            if(a[i] == b[i]) {
                equivalency++;
            }
        }
        return (equivalency / maxLength);
    }
    async function upload_images(image_blobs, image_info, isPublic=false){
        var img_index = 0
        let urls = []
        var image_data = image_blobs[img_index]
        console.log(image_data)
        if(!image_data) return
        return new Promise(async (res, rej)=>{
            const onLoad = async (fb_url) => {
                urls.push(fb_url)
                img_index += 1
                if(img_index < image_blobs.length){
                    image_data = image_blobs[img_index]
                    await upload_image(image_data, image_info, isPublic).then(onLoad)
                }else{
                    res(urls)
                }
            }
            await upload_image(image_data, image_info, isPublic)
            .then(onLoad)
        })
    }
    async function upload_image(image_info, isPublic=false){
        return new Promise(async (res, rej)=>{
            const name  = 'painter_'+image_info.id+'_'+image_info.index+'.jpg'
            var url = ''
            await blob_to_image(image_info.blob).then(async image_file => {
                // set_thinking(thinking=>thinking+1)
                image_file.name = name
                image_file.isPublic = isPublic
                image_file.model = image_info.model

                await upload_file(image_file,'chat_photos',
                (progress)=>{
                    // set_thinking(thinking=>thinking+1)
                    console.log(progress+"%")                        
                }).then((fb_url) => {
                    url = fb_url
                    // urls.push(fb_url)
                    set_thinking(thinking=>thinking+1)
                })
            })
            res(url)
        })
    }
    function clear_inputs(){
        set_thinking(0)
        chat_input.current?.clear()
        set_user_query('')
    }
    async function sendMessage(event){
        console.log(user_query)
        // chat_timer.current?.reset()
        chat_input.current?.stopRecognition()
        
        var reply_txt = ''
        var reply_AI = assistant[language].apology

        var _chat_user = [...chat_user]
        _chat_user.push({
            id:createId(),
            index:chat_user.length,
            from:"user",
            text:user_query,
            time:Date.now()
        })
        set_chat_user(_chat_user)
        
        if(chat_action == assistant[language].actions[2]){ //'summerize'
            SpeechSynth({text:'Okay, let me think...'})
            set_thinking(1)
            
            await summerize_text(user_query, Math.max(uniqueWords(user_query).length,150))
            .then(response=>{
                botReply(response)
            })

            clear_inputs()
            return
        }
        if(painter_models.length > 0 && chat_action == assistant[language].actions[1]){ //'create image'
            set_thinking(3)

            let [inputs,forget] = user_query.split("/forget")
            var prompts = inputs.toLocaleLowerCase().replace('/imagine')
            
            if(painter_auto || !forget || forget?.length == 0) forget = prompt_score('EasyNegative, blury, deformed, cropped, low quality, ' +forget,'forget');

            // console.log(inputs)
            const models_array = clone_array(painter_models.map(m=>m.code),painter_batch)
            const options = {
                id:createId(),
                imagine:prompts,
                forget: forget,
                models:models_array,
                seed:painter_seed,
                sampler:painter_sampler.code,
                steps:painter_steps,
                width:painter_width,
                height:painter_height,
                cfg_scale: painter_cfg,
                images:models_array.map((m_name,i)=>{return{
                    index:i,
                    id:createId(),
                    model:m_name,
                    url:'./loading.jpg',
                    owner:user?.uid
                }})
            }
            await botReply(`Okay, I will generate some images for you.`)
            
            var_set('diffusion_options',JSON.stringify(options))
            var _chat_painter = [...chat_painter]
            _chat_painter.push({
                id:options.id,
                index:chat_painter.length,
                from:"painter",
                text:'AI Models: '+options.models.filter((value, index, self) => self.indexOf(value) === index).join(' '),
                images:models_array.map((m_name,i)=>{return{
                    index:i,
                    id:createId(),
                    model:m_name,
                    url:'./loading.jpg',
                    owner:user?.uid
                }}),
                config:options,
                time:Date.now()
            })
            set_chat_painter(_chat_painter)
            var urls = []
            
            await generate_image(options,(image_info)=>{
                console.log(image_info)
                // image_blobs_array = [...image_blobs]
                upload_image(image_info, true)
                .then(url=>{
                    urls.push(url)
                    _chat_painter.at(-1).images[image_info.index].url = url
                    set_thinking(thinking=>thinking+1)
                    set_chat_painter(_chat_painter)
                })
                
            }).then(async (image_galery_data)=>{
                console.log(image_galery_data)
                // image_blobs_array = [...image_blobs]
                clear_inputs()
                botReply(`There you go, I successfully generated all your images.`)
            }).catch(async e=>{
                clear_inputs()
                botReply(`I apologize, I successfully generated ${urls.length} images. ${e.message}`)
                // console.error(e)
            })
            
            
            // await upload_images(image_blobs_array, "bubble_painter_"+options.id)
            // .then(url_array=>{
            //     urls = url_array
            // })

            
            
            return
        }
        
        const merged_chat = _chat_user.concat(chat_bot)
        merged_chat.sort((a, b) => a.time - b.time)
        
        var resumo = ''
        var index = 2
        var sentiment = ''
        console.log(merged_chat)
        
        if(merged_chat.length >= 2){
            while (resumo.length < max_history && index < merged_chat.length) {
                index += 2
                resumo = '\n'
                merged_chat.slice(-index).map((i)=>{
                    if(i.from == 'user'){
                        resumo += `\n${assistant[language].client}: `+ i.text
                    }else{
                        resumo += `\n${assistant[language].server}: ` + i.text
                    }
                })
            }
            console.log("Length of memory = "+resumo.length, "Recals "+index+" of "+merged_chat.length+" replies")
            
            if(resumo != '') await generate(resumo+'\n'+assistant[language].analysis)
            .then(async(analys_feedback)=>{
                if(analys_feedback != ''){
                    sentiment = '\n'+assistant[language].feedback+analys_feedback
                }
                console.log(sentiment)
            })
        }
        // return
        //Explain with details what is the AI singularity
        await zero_shot_classification(user_query, assistant[language].understand)
        .then(async(action)=>{
            console.log("The action ="+action.option)
            // reply_AI = action
            
            await query_API_new(`${user_query}. ${assistant[language].explain[0]} ${action.option} ${assistant[language].explain[1]} `)
            .then(async(data)=>{
                if(data != ''){
                    console.log('As explanation ='+data)
                    reply_AI = data
                }
            })
        
            await generate(`${assistant[language].orientation}
${assistant[language].client}: ${assistant[language].firstQ}
${assistant[language].server}: ${assistant[language].firstA}
${resumo}
${sentiment}
${assistant[language].client}: ${user_query}.
${assistant[language].server}: ${reply_AI}
${assistant[language].client}: ${assistant[language].continue}
${assistant[language].server}: `, assistant[language].client+":", 200).then(async(chat_data)=>{
                if(chat_data != '') {
                    const similarity = similarText(reply_AI,chat_data)
                    if(chat_data.includes(reply_AI) == false){
                        reply_txt = reply_AI
                        // chat_data = chat_data.split(assistant[language].client+":")[0].replace('AI: ','')
                        if(similarity <= 0.5) reply_txt += chat_data
                    }else{
                        reply_txt = chat_data
                    }
                }
            })
        })

        await summerize_text(reply_txt, 250).then(response=>{
            reply_txt = response
        }).catch((e)=>{
            console.log("Error while summerizing text: "+e.message)
        })

        botReply(reply_txt)
        clear_inputs()

    }

    
    async function speak(text, onEnd=()=>{}){

        
        // var audio = null
        // await text_to_voice(text).then(async (response) => {
            
        //     audio = await playBase64EncodedFlacAudio(response)
            
        //     console.log(audio);
        // });
        // // audio.play()
        // onEnd(audio)
        // return (audio)
        
        // console.log(audio.data.name)
        // await api_get({
        //     route:'synthesize',
        //     body:{
        //         ssml:`<speak>${text}</speak>`,
        //         pitch:speech_pitch,
        //         speed:speech_speed,
        //         voice:speech_voice.code
        //     }
        // })

        // .then((response)=>{
        // if(!response) return
        // var audioData = new Uint8Array(response?.audioContent.data);
        // const blob = new Blob([audioData.buffer],{type:'audio/mp3'});
        // audio = new Audio()
        // audio.addEventListener('onload', ()=>{audio.play()})
        // audio.addEventListener('ended', onEnd);
        // audio.src = audio.data.name
        
        // })
        return audio
    }

    async function botReply(data){
        // const bot_audio = await speak(data,()=>{ set_thinking(0) })
        SpeechSynth({text:data})
        set_thinking(0)
        
        var _chat_bot = [...chat_bot]
        _chat_bot.push({
            id:createId(),
            index:chat_bot.length,
            from:"bot",
            text:data,
            time:Date.now(),
            // audio:bot_audio
        })
        set_chat_bot(_chat_bot)
    }
    function scrollToLast(){
        // console.log(chat_painel.current.scrollTop)
        if(chat_painel && chat_painel.current) chat_painel.current.scrollTo({
            top: 0, //chat_painel.current.scrollHeight
            behavior: 'smooth',
        });
    }
    function playAudio(item){
        SpeechSynth({text:item.text})
        // var voice = null
        // // console.log(item)
        // if(item.from == 'user'){
        //     voice = voices.find(v=>v.lang == speech_voice.lang && v.sex == user_gender)
        //     voice.pitch = -1
        //     voice.speed = 1.3
        // }else{
        //     voice = speech_voice
        //     voice.pitch = speech_pitch
        //     voice.speed = speech_speed
        // }
        
        // if(item.audio) {
        //     // item.audio.addEventListener('ended', () => {
        //     //     console.log(item.text, "audio ENDED",chat_input)
        //     //     if(chat_input.current.state.isRecognizing == false) chat_input.current.startRecognition()
        //     // });
        //     if(item.audio.paused) item.audio.play()
        // }else{
        //     // api_get({
        //     //     route:'synthesize',
        //     //     body:{
        //     //         ssml:`<speak>${item.text}</speak>`,
        //     //         pitch:voice.pitch,
        //     //         speed:voice.speed,
        //     //         voice:voice.code
        //     //     }
        //     // })
        //     SpeechSynth(item.text).then((response)=>{
        //         if(response) console.log(response)
                
        //         clear_inputs()
        //         return
        //         var audioData = new Uint8Array(response?.audioContent.data);
        //         const blob = new Blob([audioData.buffer],{type:'audio/falc'});
        //         const new_audio = new Audio( URL.createObjectURL(blob) );
                
        //         new_audio.play()
        //         // if(item.from == 'user'){
        //         //     var _chat = [...chat_user]
        //         //     _chat[item.index].audio = new_audio
        //         //     set_chat_user(_chat)
        //         // }else{
        //         //     var _chat = [...chat_bot]
        //         //     _chat[item.index].audio = new_audio
        //         //     set_chat_bot(_chat)
        //         // }
        //     })
        // }
    }
    
    function draw_chat(){
        const merged_chat = chat_user.concat(chat_bot).concat(chat_painter)
        merged_chat.sort((a, b) => a.time - b.time)
        return(<ChatScroller data={merged_chat.reverse()} playAudio={(bubble)=>{SpeechSynth({text:bubble.text})}} set_image_galery={set_image_galery}/>)
    }

    function user_icon(){
        return(<div className='flex w-full flex-grow-1 justify-content-center'>
        <div className='flex w-8rem h-8rem bg-white-alpha-50 border-circle overflow-hidden mb-5 justify-content-center'>
            <div className='flex w-11 h-11 m-1 bg-gray-800 border-circle overflow-hidden justify-content-center align-content-center'>
                <i className="pi pi-user mt-4 text-white-alpha-50" style={{'fontSize': '4em'}}></i>
            </div>
        </div>
    </div>)
    }

    function draw_config_sidebar(){
        return(<div className='flex flex-wrap flex-grow-1 w-full justify-content-center p-fluid grid formgrid col-12 gap-4 p-0 m-0 h-auto'>
            <Tooltip target=".custom-tooltip-btn">
                {model_option && <>
                    <h4>{model_option.name}</h4>
                </>}
            </Tooltip>
            <div className='flex-grow-1 12'>
                <div><label style={{
                    whiteSpace:"nowrap"
                }}>Painter</label></div>
                <MultiSelect id="models"
                    style={{ textAlign:"left", width:"100%", marginTop:"10px" }}
                    value={painter_models}
                    options={image_models}
                    showSelectAll={false}
                    // showClear={true}
                    // maxSelectedLabels={1}
                    minSelectedLabels={1}
                    tooltip={'Select AI Diffusion Models to use for image generation.'}
                    tooltipOptions={{position:"right", style:{width:"300px",whiteSpace:"pre-wrap"}}}
                    dropdownIcon="pi pi-palette"
                    panelClassName="p-1 bg-black-alpha-40 bg-blur-3 h-30rem max-h-screen overflow-scroll"
                    panelHeaderTemplate={()=>{return(<label className='flex text-green-400 pt-2 pl-4'>AI Diffusion Models</label>)}}
                    selectedItemsLabel={painter_models.length+' Models'}
                    selectedItemTemplate={(option)=>{
                        if(!option) return(<label className='text-gray-400'>AI Models</label>)
                        return(<div className='flex'>
                            {option.name}
                        </div>)
                    }}
                    onChange={(e)=>{
                        let value = e.value
                        if(!value || e.value.length == 0) return
                        set_painter_batch(Math.min(painter_batch,Math.max(1,8-(value.length*2))))
                        set_painter_models(value)
                    }}
                    // optionLabel="name"
                    optionLabel={(option)=>{
                        return(<div onMouseOver={()=>{set_model_option(option)}}  className='custom-tooltip-btn flex col-12 w-15rem h-2rem flex-grow-1 justify-content-between align-items-center'>
                            <label>
                                {option.name}
                            </label>
                            <h5>{option.price}</h5>
                        </div>)
                    }}
                />
            </div>
            
            <div className='flex-grow-1 col-12 md:4 lg:col-4'>
                <div><label>Steps</label></div>
                <InputText id="steps" style={{ width:"100%", marginTop:"10px" }} value={painter_steps} onChange={(e) => set_painter_steps(e.target.value)} />
                <Slider min={1} max={150} value={painter_steps} onChange={(e) => set_painter_steps(e.value)} />
            </div>

            <div className='flex-grow-1 col-12 md:4 lg:col-4'>
                <div><label className='white-space-nowrap'>CFG Scale</label></div>
                <InputText id="cfg_scale"
                    tooltip={'Recommended value: 7.5;\nContinuous Flow Gradient, How much to prioritize prompt over creativity.'}
                    tooltipOptions={{position:"bottom", style:{width:"300px",whiteSpace:"pre-wrap"}}}
                    style={{ width:"100%", marginTop:"10px" }} value={painter_cfg} onChange={(e) => set_painter_cfg(e.target.value)} />
                <Slider min={0} max={50} value={painter_cfg} step={1} onChange={(e) => set_painter_cfg(e.value)} />
            </div>
            <div className='flex-grow-1 col-12'>
            <div className='flex gap-2 align-items-center'>
                    <i className='pi pi-share-alt' />
                    <label>Seed</label>
                </div>
                <div className='flex h-auto align-items-end p-inputgroup'>
                    <InputText id="painter_seed"
                        // suffix=" %"
                        value={painter_seed}
                        style={{ marginTop:"10px" }}
                        onChange={(e) => set_painter_seed(e.target.value)}
                    /><Button
                        tooltip='New Seed'
                        tooltipOptions={{position:'top'}}
                        icon='pi pi-sync'
                        className='p-button-text'
                        onClick={(e)=>{
                            set_painter_seed(parseInt(createId(Math.ceil(Math.random()*10),false,'1234567890')))
                        }}
                    />

                </div>
            </div>
            <div className='flex-grow-1 col-3'>
                <div className='flex gap-2 align-items-center'>
                    <i className='pi pi-arrows-h' />
                    <label>Width</label>
                </div>
                <InputText value={painter_width} suffix=' px' disabled={true} id="steps" style={{ width:"100%", marginTop:"10px" }} onChange={(e) => set_painter_width(e.target.value)} />
                <Slider min={256} max={1024} step={256} value={painter_width} onChange={(e) => set_painter_width(e.value)} />
            </div>
            <div className='flex-grow-1 col-3'>
                <div className='flex gap-2 align-items-center'>
                    <i className='pi pi-arrows-v' />
                    <label>Height</label>
                </div>
                <InputText value={painter_height} suffix=' px' disabled={true} id="steps" style={{ width:"100%", marginTop:"10px" }} onChange={(e) => set_painter_height(e.target.value)} />
                <Slider value={painter_height} min={256} max={1024} step={256} onChange={(e) => set_painter_height(e.value)} />
            </div>
            <div className='flex-grow-1 col-12 md:4 lg:col-4'>
                <div className='flex gap-2 align-items-center'>
                    <i className='pi pi-image' />
                    <label>{painter_batch*painter_models.length} Pictures</label>
                </div>
                <InputNumber disabled={true}//{painter_models.length==0}
                    suffix={` x ${painter_models.length} = ${painter_batch*painter_models.length}`}
                    id="batch" style={{ width:"100%", marginTop:"10px" }} value={painter_batch} onChange={(e) => set_painter_batch(e.target.value)} />
                <Slider disabled={painter_models.length >= 4}
                    min={1} max={Math.min(6,8-(painter_models.length*2))} value={Math.max(1,painter_batch)} onChange={(e) => set_painter_batch(e.value)} />
            </div>
            
            <div className='flex-grow-1 col-12 '>
                <div><label style={{
                    whiteSpace:"nowrap"
                }}>Sampler</label></div>
                <Dropdown id="type"
                    style={{ textAlign:"left", width:"100%", marginTop:"10px" }}
                    value={painter_sampler}
                    options={image_samplers}
                    onChange={(e)=>{set_painter_sampler(e.value)}}
                    optionLabel="name"
                    placeholder="Selecione Sampler"
                />
            </div>
            
            
            {/* <div className='flex-grow-1 col-12'>
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
            </div> */}

            <div className='flex-grow-1 w-full mt-8 p-8' />

            <div className='flex flex-grow-1 w-full h-3rem flex-grow-1 absolute top-0'>
                <Button id="cofirm_options"
                    className='p-button-success p-button-text shadow-none'
                    label='Okay'
                    icon='pi pi-check'
                    onClick={() => show_settings(false)}
                />
            </div>
            
            <div className='pointer-events-none flex-grow-1 absolute bottom-0 mt-3 w-full'>
                
            <div className='flex flex-grow-1 w-full h-10rem responsive  bg-blur-2 bg-gradient-bottom'/>
                <Button id="delete_chat"
                    className='pointer-events-auto bottom-0 p-3 absolute shadow-none p-button-danger p-button-text'
                    label='Delete Chat'
                    icon='pi pi-trash'
                    onClick={() => confirmPosition('top')}
                />
                
            </div>
        </div>)
        return(<div className='flex flex-wrap justify-content-center p-fluid grid formgrid col-12 gap-4 h-auto'>
            {/* <div className='flex-grow-1 white-space-nowrap'>
                <h3><i className='pi pi-wrench mr-2' />Configurações</h3>
            </div> */}

            <div className='flex-grow-1'>
                <div><label>Velocidade</label></div>
                <InputText id="speed" style={{ width:"100%", marginTop:"10px" }} value={speech_speed} onChange={(e) => set_speech_speed(e.target.value)} />
                <Slider step={0.05} min={0.25} max={4.00} value={speech_speed} onChange={(e) => set_speech_speed(e.value)} />
            </div>

            <div className='flex-grow-1'>
                <div><label>Memoria</label></div>
                <InputText id="memory" style={{ width:"100%", marginTop:"10px" }} value={max_history} onChange={(e) => set_max_history(e.target.value)} />
                <Slider step={20} min={100} max={600} value={max_history} onChange={(e) => set_max_history(e.value)} />
            </div>
            
            <div className='flex-grow-1'>
                <div><label style={{
                    whiteSpace:"nowrap"
                }}>Modelo Neural</label></div>
                <Dropdown id="type"
                    style={{ textAlign:"left", width:"100%", marginTop:"10px" }}
                    value={model}
                    options={text_models}
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

            <div className='flex-grow-1 absolute bottom-0 mb-3'>
                <Button
                    className='p-button-danger p-button-text'
                    label='Apagar Chat' icon='pi pi-trash'
                    onClick={() => confirmPosition('bottom-left')}
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
    function draw_processing(){
        return(<>
            {thinking > 0 && <div className={'relative z-3 slidedown animation-duration-300 animation-iteration-1 flex w-min h-auto  '+(show_sidebar?'p-0':' m-4')}>
                
                <div className={'absolute z-4 pt-2 text-white-alpha text-center flex w-full justify-content-center'}>
                    <Tooltip 
                        className='yellow-tooltip'
                        target=".custom-tooltip-btn"
                        position="bottom"
                        mouseTrack={true}  
                        mouseTrackTop={22}
                    >
                        <h3 className='white-space-nowrap relative w-auto h-1rem z-5 p-0 m-0 mb-2 text-pink-100'><i className='pi pi-ban pr-1 text-pink-500'/> Stop AGI</h3>
                    </Tooltip>
                    <Button
                        tooltip=''
                        tooltipOptions={{position: 'bottom', mouseTrack:true, mouseTrackTop:22}}
                        className='transition-colors bg-blur-2 p-button-lg transition-duration-500 relative z-0 custom-tooltip-btn shadow-8 border-hover p-button-info p-button-rounded p-5 m-0'
                        icon='pi pi-stop-circle'
                        onClick={(e)=>{
                            clear_inputs(e)
                        }}
                        // style={{border:' solid var(--pink-800)'}}
                    />
                </div>
                <ProgressSpinner style={{width: '5rem', height: '5rem'}}
                    className='responsive z-4 pointer-events-none'
                    strokeWidth="2.2"
                    fill="var(--transparent)"
                    animationDuration="0.5s"
                />
            </div>}
        </>)
    }
    function render_message_panel(mode='horizontal'){
        return(<div className={'post relative align-items-center justify-content-center overflow-hidden scrollbar-none flex flex-wrap h-screen '+(show_sidebar?"w-full":"w-1rem")} ref={splitter}>
                        
        {show_sidebar && <div className='card flex h-screen w-full min-h-screen'>
            {mode=='horizontal'&&<div className='files flex flex-wrap shadow-8 mr-2 bg-white-alpha-1 h-screen gap-2 pt-3 pl-2 pr-2 w-full min-h-ma justify-content-center min-600'>

            </div>}
            <div className='flex flex-wrap gap-2 pt-3 pl-2 pr-2 w-full justify-content-center'>
                <div className={slide_in + ' absolute flex z-2 w-full justify-content-center h-max mt-2 '}>
                    <Button icon="pi pi-cog"
                        label="Settings"
                        className='flex shadow-none p-button-lg p-button-text text-gray-300 p-button-rounded'
                        onClick={(e) =>{
                            // text_to_voice("The answer to the universe is 42")
                            // SpeechSynth({text:'Okay, let me think...'})
                            show_settings(true)
                        }}
                    />
                </div>
                <div className={slide_in + ' relative z-0 pt-8 mt-3'}>
                {/* <Timer autoStart={false} ref={chat_timer} time={6} onEnd={()=>{
                    sendMessage()
                }}/> */}
                </div>
                <div className={slide_in + ' flex w-full h-full flex-wrap justify-content-center align-content-between'}>
                    <div className='flex flex-wrap gap-2 pt-3 pl-2 pr-2 w-full justify-content-center'>
                            {/* {user_icon()} */}
                            {thinking == 0 && <div className=' gap-3 align-items-center'>
                                {/* <div><label className='text-gray-500' >Prompt</label></div> */}
                                <label className={painter_auto?'text-green-300':'text-gray-100'} style={{whiteSpace:"nowrap"}}>
                                    {painter_auto?'Auto AI':'Human'}
                                </label>
                                <ToggleButton
                                    className='fadein animation-iteration-1 animation-duration-500 flex p-button-lg p-button-rounded t-1 h-1rem w-1rem p-4 m-0 mt-2 shadow-none border-none'
                                    checked={painter_auto}
                                    onChange={(e) => set_painter_auto(e.value)}
                                    onLabel=""
                                    offLabel=""
                                    onIcon="pi pi-bolt"
                                    offIcon="pi pi-user"
                                    style={{width: '10em'}}
                                />
                            </div>}
                            <div>
                                {draw_processing()}
                            </div>
                        {render_message_box()}
                        
                        <div className='flex flex-grow-1 w-full h-max justify-content-center'>
                            <Button
                                disabled={disabled || user_query == ""}
                                iconPos="right"
                                icon="pi pi-send"
                                className='mt-2 bg-blur-2 p-button-outlined bg-black-alpha-50 p-button-lg p-button-rounded '
                                label="Send"//{selection_to_speak?.length>0 && selection_to_speak?.length != user_query?.length? "Falar Seleção":"Falar Texto"}
                                onClick={sendMessage}
                            />
                            
                        </div>
                        
                        
                    </div>
                </div>
            </div>
            
        </div>
        }
        {!show_sidebar &&<div className='flex fixed z-4 w-auto h-auto justify-content-end align-items-center left-0 top-0'>
            {draw_processing()}
        </div>}
    </div>)
    }
    function render_message_box(){
        return(
            <div className='flex w-full h-auto'>
                <SpeechToText
                    // query_value={user_query}
                    language={speech_voice?.lang || language}
                    ref={chat_input}
                    disabled={disabled || thinking > 0}
                    // onChange={(text)=>{
                    //     // console.log(text)
                    //     // chat_timer.current?.reset()
                    //     if(typeof(text)=='string') set_user_query(text)
                    // }}
                    onUpdate={(final, interim)=>{
                        // chat_timer.current?.reset()
                        let text = final +(interim==""?"":"\n"+ interim)
                        if(typeof(text)!='string') text =''
                        set_user_query(text)
                    }}
                    onPause={async ()=>{
                        if(user_query != '') {
                            await set_voice_synth(user_query)
                        }
                    }}
                    onConfirm={async ()=>{
                        let _query = chat_input.current.state.finalTranscript
                        await set_voice_synth(_query)
                        
                        set_user_query(_query)
                        if(!assistant[language.toLocaleLowerCase()]) {
                            set_thinking(0)
                            return
                        }
                        const _actions = assistant[language.toLocaleLowerCase()]?.actions
                        zero_shot_classification(_query, _actions)
                        .then(async response=>{
                            set_code(response)
                            set_chat_action(response.option)
                            switch (response.option) {
                                case _actions[1]: //'create image'
                                    if(painter_auto){
                                        set_thinking(thinking=>thinking+1)
                                        await generate_prompts(_query+', mdjrny-v4, masterpiece, best quality,').then(return_prompts=>{
                                            let prompts = prompt_score(return_prompts)
                                            console.log(prompts)
                                            set_user_query(prompts)
                                            chat_input.current?.setState({finalTranscript:prompts})
                                            set_thinking(0)
                                        })
                                    }
                                    break;
                            
                                default:
                                    console.log(response)
                                    break;
                            }
                            
                        })

                    }}
                />
            </div>
        )
    }
    function render_chat_panel(){
        return(<div ref={chat_painel} className='flex w-full h-screen overflow-scroll hide-scroll'>
        {/* {selection_to_speak.length>0?selection_to_speak:user_query} */}
        {chat_state == "name" && <div className='flex w-full h-full justify-content-center align-items-center'>
            <div className=''>
                <div className="p-inputgroup w-full">

                    <span className="p-float-label">
                        <InputText id="name_input" value={user_name} onChange={(e) => set_user_name(e.target.value)} />
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
        {chat_state == "chat" && empty_chat &&<div className='flex w-full h-full justify-content-center align-items-center'>
            <h3 className='text-white'>Olá {user_name}, {period}.<br/>O que gostaria de tratar?</h3>
        </div>}

        {!empty_chat && <div className='flex relative w-full h-full top-0 '>
            
            
            <ChatContextMenu
                chat_user={chat_user}
                chat_bot={chat_bot}
                
                onAction={(bubble,mode)=>{
                    // console.log(mode,bubble)
                    var _chat = []

                    if(bubble.from == 'user'){
                        _chat = [...chat_user]
                    }else{
                        _chat = [...chat_bot]
                    }
                    switch (mode) {
                        case 'Delete':
                            _chat = _chat.filter(b => b.index != bubble.index)
                            break;
                        case 'Listen':
                            // playAudio(bubble)
                            SpeechSynth({text:bubble.text})
                            break;
                        default:
                            console.log(mode+" command not found!")
                            break;
                    }

                    if(bubble.from == 'user'){
                        set_chat_user(_chat)
                    }else{
                        set_chat_bot(_chat)
                    }
                }}
            >
                
                {draw_chat()}
            </ChatContextMenu>
            {/* {chat_painel.current.scrollTop > 10 && <Button
                icon='pi pi-chevron-up'
                className='slideup text-matrix animation-duration-300 animation-iteration-1 flex fixed bottom-0 m-3 p-5 p-button-outlined bg-black-alpha-50 bg-blur-2 shadow-6 border-3 p-button-lg p-button-rounded'
                onClick={()=>{
                    scrollToLast()
                }}
            />} */}
        </div>}
    </div>)
    }
    const slide_in = 'fadeinleft animation-duration-200 animation-iteration-1'
    var disabled = !(chat_state != "name" && user_name != "")
    // if(!win) return(<></>)
    const empty_chat = chat_user.length == 0 && chat_bot.length == 0 && chat_painter.length == 0
    return(
        <div >
            <Sidebar className='w-4 pb-3 w-30rem' position='left' visible={settings} onHide={() => show_settings(false)}>
                {draw_config_sidebar()}
            </Sidebar>
            <div className='pointer-events-none flex fixed z-2 w-full h-5rem bg-blur-2 bg-gradient-top'></div>
            <div className='hide_on_mobile'>
                <Splitter onResizeEnd={(e)=>{
                    // console.log(e)
                    if(!user) document.getElementById('name_input').focus()
                    if(!show_sidebar && splitter.current.offsetWidth > 10){
                        set_show_sidebar(true && user)
                    }else if(splitter.current.offsetWidth < 200){
                        set_show_sidebar(false)
                    }
                    // console.log(e,splitter.current.offsetWidth,e.sizes.current[0])
                }} gutterSize={15} style={{height: '100%', width:"100%"}} layout="horizontal">
                    <SplitterPanel size={10} style={{height: '100%', width:"100%" , ... show_sidebar?{maxWidth:'66.6svw', minWidth:'128px'}:{maxWidth:'10px'}} } >
                        {render_message_panel()}
                    </SplitterPanel>
                    <SplitterPanel size={90} className='flex h-full w-full'>
                        {render_chat_panel()}
                    </SplitterPanel>
                </Splitter>
            </div>

            <div className='flex flex-wrap show_on_mobile hidden'>
                

                <div className='fixed top-0 left-0 w-screen h-screen show_on_mobile'>
                    <Splitter gutterSize={30} layout="vertical" style={{height: '100%', width:"100svw"}} >
                        <SplitterPanel size={90} className='w-screen overflow-scroll flex flex-wrap hide-scroll'>
                            
                            {render_chat_panel()}

                            
                            
                        </SplitterPanel>
                        <SplitterPanel size={10} className='flex max-h-30rem min-h-10rem'>
                            <div className='sticky flex top-0 left-0 w-0 h-0 pointer-events-none'>
                                <Button
                                    disabled={disabled || user_query == ""}
                                    iconPos="right"
                                    icon="pi pi-send"
                                    className='fixed left-50 pointer-events-auto h-min mt-2 bg-blur-2 p-button-outlined bg-black-alpha-50 p-button-lg p-button-rounded '
                                    label="Send"//{selection_to_speak?.length>0 && selection_to_speak?.length != user_query?.length? "Falar Seleção":"Falar Texto"}
                                    onClick={sendMessage}
                                    style={{transform:"Translate(-50%, -90px)"}}
                                />
                            </div>
                            <div className='flex flex-wrap w-full min-h-3rem pt-3 overflow-scroll hide-scroll'>
                                
                                {render_message_box()}

                            </div>
                            
                        </SplitterPanel>
                    </Splitter>
                </div>
            </div>

            <ConfirmDialog />
            <Toast ref={toast} />
            {image_galery[1] && <div
                className={' flex justify-content-center align-items-center fixed top-0 left-0 z-3 h-screen w-screen'}>
                
                <div
                    className='fadein animation-duration-300 animation-iteration-1 flex w-full h-full left-0 top-0 absolute bg-black-alpha-50 bg-blur-3 z-0'
                    onClick={(e)=>{
                        e.stopPropagation()
                        e.preventDefault()
                        set_image_galery([0,null])
                    }}
                    onTouch={(e)=>{
                        e.stopPropagation()
                        e.preventDefault()
                        set_image_galery([0,null])
                    }}
                />
                {/* transform: scale3d(0.3, 0.3, 0.3); */}
                <div className='flex h-full z-2'>
                    {/* <img src={image_galery[1].images[image_galery[0]]} onError={(e) => e.target.src = './error_404.jpg'} className='flex bg-contain bg-center bg-no-repeat border-round-md'></img> */}
                    <ImageEditor
                        onHide={(e)=>{
                            set_image_galery([0,null])
                            set_exit(false)
                        }}
                        onBack={()=>{
                            if(image_galery[0] > 0)
                                set_image_galery(_image_galery => [_image_galery[0]-1,_image_galery[1]] )}}
                        onNext={()=>{
                            if((image_galery[0]+1 < image_galery[1].images.length))
                                set_image_galery(_image_galery => [_image_galery[0]+1,_image_galery[1]] )
                        }}
                        onExit={(value)=>{
                            set_exit(value)
                        }}
                        speak={(text)=>{SpeechSynth({text:text}, false)}}
                        galery={image_galery}
                        index={image_galery[0]}
                        length={image_galery[1]?.images.length}
                        image={image_galery[1]?.images[image_galery[0]]}
                    />
                </div>
                {/* <div className='fixed top-0 w-full z-3'>
                    {actionHeader()}
                </div> */}
            </div>}
            
        </div>
    )
}