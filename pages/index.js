import styles from "../styles/Home.module.css";
import { Button } from "primereact/button";
import { Clock } from "../componets/Clock";
import { useRouter } from "next/router";
// import MyTimeline from './components/mytimeline';
// import UserProfile from './components/user_profile';
import MatrixBackGround from './components/matrix_bg';
import { InputText } from "primereact/inputtext";
import Planeta from './planeta';
import { useEffect, useState } from "react";
import generate_image, { get_image } from "./athena/interface_api";
import { useUtils } from "./utils";
// import { api_get } from './api/connect';
// import { useEffect } from 'react';
// import img from 'next/image';
import { SpeedDial } from 'primereact/speeddial';

export default function Home() {
	// const clock = new Clock
	// var tick = 0
	const [edit_menu, set_edit_menu] = useState(false)
	const [generate, set_generate] = useState(false)
	const [museum, set_museum] = useState()
	const {blob_to_image} = useUtils()

	function gen_new(){
		if(generate){
			get_image({
				cfg:7.7,
				steps:22,
				steps: 22,
				cache:false,
				seed: Date.now(),
				cfg_scale:7.7,
				use_cache: true,
				wait_for_model: true,
				model: 'prompthero/openjourney-v4',
				parameters: { width:512, height:512},
				inputs: "make a painting in davinci style of the museum of art of sa o paulo masp, mdjrny-v4, masterpiece, best quality, 8k, red letter, pastel, minimalistic style, open ceiling, highly detailed, painted by velazquez, beksinski, giger , depth of field, sharp focus, hdr, full body, absurdres, high detail, intricate, detailed, ultra-detailed, looking at viewer, highres, high quality, detailed face, detailed eyes, intricate details, outdoors, ultra high res, 4k, extremely detailed, realistic, photorealistic, raw photo, cinematic lighting",
				negative_prompt: "blury, deformed, cropped, low quality, bad anatomy, undefined, multilated, long neck, mutation, malformed limbs, username, poorly drawn face, mutated, easynegative, blurry, monochrome, missing fingers, error, missing legs, jpeg artifacts, watermark, text, too many fingers, poorly drawn hands, duplicate, extra legs, signature",
			}).then(async img_blob=>{
				const new_image = await blob_to_image(img_blob)
				set_museum(new_image.src)
				set_generate(false)
			}).catch((e)=>{
				set_generate(false)
			})
		}
	}

	useEffect(()=>{
		return(gen_new())
	},[generate])

	const items = [
		{
			label: 'Reimagine',
			icon: 'pi pi-sync',
			command: () => {
				set_generate(true)
				// toast.current.show({ severity: 'info', summary: 'Add', detail: 'Data Added' });
			}
		},
		{
			label: 'Love',
			icon: 'pi pi-heart',
			command: () => {
			  router.push('geotimeline')
				// toast.current.show({ severity: 'success', summary: 'Update', detail: 'Data Updated' });
			}
		},
		{
		  label: 'Download',
		  icon: 'pi pi-cloud-download',
		  command: () => {
			router.push('athena')
			  // toast.current.show({ severity: 'success', summary: 'Update', detail: 'Data Updated' });
		  }
		},
		{
			label: 'Download CV',
			icon: 'pi pi-link',
			command: () => {
			  set_qrcode(true)
				// toast.current.show({ severity: 'error', summary: 'Delete', detail: 'Data Deleted' });
			}
		},
	];

	const router = useRouter();

	return (
		<main className="bg-black scrollbar-none">
			<div className='z-0'>
				<MatrixBackGround/>
			</div>
			<header
				className=" transform-gpu wrapper hide-scroll h-screen w-screen overflow-x-hidden"
				//style='background-image: url("/image/backgrounds/bg-galaxy-b.jpg");'
			>
				<div className="bg-black-alpha-80 absolute w-screen h-screen top-0"></div>
				<div className="parallax_bg pointer-events-none overflow-hidden">
					<img
						priority="true"
						quality="100"
						layout="fill"
						src="/image/backgrounds/bg-galaxy-a.jpg"
						alt="hero-0"
						className="z-0 overflow-hidden opacity-50 hover:"
					/>
				</div>
				
				<div className="pointer-events-none isolate hero-grid-wrap h-[440px] sm:h-[470px] md:h-[500px] lg:h-[530px] absolute top-0">
					<div className="hero-grid"></div>
				</div>
				
				<div className=" container flex flex-col items-center overflow-hidden">
					
					<div className="flex max-lg:flex-col items-center mb-6 gap-4 mt-8 z-1">
						<div className="text-white text-sm font-medium border px-3 py-1 rounded-md border-white/20">
							Beta Privado
						</div>
					</div>
					<h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-[#888] relative tracking-tighter text-center mb-6 md:mb-12 max-w-[780px]">
						<span className="text-white">Crie imagens </span>
						<span className="mix-blend-color-dodge">com Inteligência Artificial</span>
					</h1>
					<p className="text-gray-200 mix-blend-color-dodge sm:text-lg md:text-xl text-center max-w-[550px] mb-12 md:mb-16 xl:mb-20">
						Uma plataforma para criar, editar e hospedar suas artes e design em um único lugar.
						Um aplicativo baseado em IA desenvolvido para marketing e design modernos.
					</p>
					<form className="email-form mb-8" id="">
						<InputText
							type="email"
							className="border-none"
							placeholder="Email para acesso ao beta"
							required=""
						/>
						<div className="button-wrapper">
							<Button icon='pi pi-envelope text-green-800 text-3xl' className="m-0 p-0 w-max" type="submit" />
						</div>
					</form>
				</div>
				
				<div className="isolate relative flex surface-card z-1 w-full justify-content-center">
					<div className="grid grid-nogutter max-w-screen-lg">
						<div className="flex col-12 md:col-6 justify-content-center py-5 md:justify-content-start align-items-center p-3">
							
							<div className="relative flex w-full h-full">
								<img
									width={400}
									height={400}
									src = {museum?museum:"/image/backgrounds/hero-1.jpg"}
									alt="hero-1"
									className= {(generate?"blur-2":"")+" border-round-xl overflow-hidden shadow-8 w-full h-auto transition-all transition-duration-500"}
								/>

								<div style={{transform:"Translate(0.1rem,0.25rem)"}}>
									<SpeedDial
										className='right-0 bottom-0 mb-1 p-4 z-2 absolute'
										model={items}
										direction="up"
										transitionDelay={30}
										showIcon="pi pi-bars"
										hideIcon="pi pi-times"
										visible={edit_menu}
										buttonClassName="flex z-3 p-button-success color p-4 p-button-outlined p-button-rounded border-3"
										// buttonTemplate={(data)=>{
										// 	return(<Button
										// 		// onClick={()=>{set_edit_menu(!edit_menu)}}
										// 		icon={`pi pi-eye`}
										// 		// className="absolute z-4 p-button-success  p-4 p-button-outlined p-button-rounded border-3"
										// 	/>)
										// }}
									/>
								</div>

								<i className={(generate?
									"pi-sync pi-spin text-white-alpha-50 text-8xl center origin-center":
									"opacity-80 pi-eye  text-blue-500 border-cyan-500 cursor-pointer right-0 bottom-0 m-5 p-2 border-3")+
									" border-circle absolute pointer-events-none z-0 pi hover:pi-spin absolute transition-all transition-duration-300"}
								/>
							</div>
						</div>
						<div className="col-12 md:col-6 p-4 sm:p-6 text-center md:text-left flex align-items-center">
							<section>
								<div className="text-4xl text-white font-bold mb-3">
									Criatividade sem limites 💭
									<span className="text-3xl text-primary block mb-1">
										Imagine infinitas obras
									</span>
								</div>
								<p className="text-500 line-height-4">
									Crie imagens impressionantes usando <i className="font-bold text-700">linguegem natural</i>, de forma que não perca suas ideias pensando em quais <i className="font-bold text-700">prompts</i> deva usar.
									Escreva ou fale como se tivesse em uma conversa com um amigo, um artista ou um vendedor. Liberte o diretor de arte que existe dentro de você.
								</p>
							</section>
						</div>
					</div>
				</div>
				
				<div className="isolate relative flex bg-black-alpha-60 bg-blur-1 z-1 w-full justify-content-center">
					<div className="grid grid-nogutter max-w-screen-lg">
						
						<div className="col-12 md:col-6 p-4 sm:p-6 text-center md:text-left flex align-items-center flex-order-1">
							<section>
								<div className="text-4xl text-white font-bold mb-3">
									Feito com paixão ❤️‍🔥
									<span className="text-3xl text-primary block mb-1">
										Nycholas Weissberg
									</span>
								</div>
								<p className="text-700 line-height-4">
									Não há um <i className="font-bold text-900">desafio</i> que não possa ser ultrapassado, uma <i className="font-bold text-900">ferramenta</i> que não possa ser dominada, um 
									<i className="font-bold text-900"> código</i> que não possa ser escrito e uma <i className="font-bold text-900">habilidade</i> que não possa ser adquirida. Posso não saber como 
									fazer tudo, mas <i className="font-bold text-900">sempre</i> busco aprender, ou encontrar uma solução para o problema. Como um artista, eu 
									amo criar e como programador amo pensar.<br/><br/>
								</p>
								<p className="font-bold text-white text-lg text-right">
									<span className="text-3xl text-primary font-light">❝</span><i>O conhecimento existe, só devemos buscar!</i><span className="text-3xl text-primary font-light">❞</span>
									<br/><h5 className="text-600">@Nyco3D</h5>
								</p>
							</section>
						</div>
						<div className="flex col-12 md:col-6 p-8 sm:p-4 flex-order-0 md:flex-order-1 justify-content-center py-5 md:justify-content-center align-items-center">
							<img
								width={333}
								height={333}
								src="/image/profile.jfif"
								alt="hero-2"
								className="border-circle overflow-hidden shadow-8 w-full h-auto max-w-20rem"
							/>
						</div>
					</div>
				</div>
			</header>
		</main>
	);
}
