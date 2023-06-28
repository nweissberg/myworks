import styles from "../styles/Home.module.css";
import { Button } from "primereact/button";
import { Clock } from "../componets/Clock";
import { useRouter } from "next/router";
import MatrixBackGround from './components/matrix_bg';
import { InputText } from "primereact/inputtext";
// import Planeta from './planeta';
import { useEffect, useState, useRef } from "react";
// import { useUtils } from "./utils";
import { useAuth } from "./api/auth";
import Imaginy from "./components/ml_imaginy";
import { getAuth, sendSignInLinkToEmail } from 'firebase/auth'
import ImaginyEditor from "./components/imaginy_editor";

export default function Home() {
	// const clock = new Clock
	// var tick = 0
	const router = useRouter();
	const auth = getAuth();
	const { user } = useAuth();
	const [user_email, set_user_email] = useState()
	const [image_editor, set_image_editor] = useState(false)
	const editor = useRef()

	const imaginy_editor = <ImaginyEditor
		ref={editor}
		fullscreen={image_editor}
		onFullscreen={(value)=>{set_image_editor(value)}}
	/>

	const actionCodeSettings = {
		// URL you want to redirect back to. The domain (www.example.com) for this
		// URL must be in the authorized domains list in the Firebase Console.
		url: 'https://imaginy.web.app',
		// This must be true.
		handleCodeInApp: true,
		// iOS: {
		// 	bundleId: 'app.imagyny.ios'
		// },
		// android: {
		// 	packageName: 'app.imagyny.android',
		// 	installApp: true,
		// 	minimumVersion: '12'
		// },
		// dynamicLinkDomain: 'imagyny.fsu.web'
	};
	useEffect(() => {
		if(user && router) router.push({pathname:'/editor',shallow:true, query:{doc:"local"}})
	},[user,router])

	
	return <main className="bg-black scrollbar-none  select-none"
		onContextMenu={(e) => {
			e.preventDefault()
			e.stopPropagation()
		}}>
		<div className='z-0'>
			<MatrixBackGround />
		</div>
		<header
			className=" transform-gpu wrapper hide-scroll h-screen w-screen overflow-x-hidden"
		//style='background-image: url("/image/backgrounds/bg-galaxy-b.jpg");'
		>
			<div className="bg-white-alpha-20 absolute w-screen h-screen top-0 blur-3 hide-on-mobile"></div>
			<div className="parallax_bg pointer-events-none overflow-hidden">
				<Imaginy
					alt="background"
					auto={true}
					layout="fill"
					priority="true"
					quality="50"
					className={'z-0 overflow-hidden opacity-70 con'}
					placeholder='/image/backgrounds/bg-galaxy-a.jpg'
					width={2048}
					height={2048}
					description='galaxy, made of The Matrix, source code'
					imagine="space, universe, purple, BASE BLACK, stars, battered, GREEN and BLUE spiral galaxy, low angle, 4k, hyper realistic, focused, extreme details, unreal engine 5, cinematic, 3D, 400MM, masterpiece, best quality, extremely detailed 8K, high resolution, ultra quality, 3D, pixar, pin-up, smooth"
					forget="blury, deformed, cropped, low quality, username, poorly drawn, easynegative, blurry, monochrome, jpeg artifacts, watermark, text, signature"
					style={{
						filter: "contrast(110%) brightness(70%) blur(3px)"
					}}
					model='openjourney-v4'
				/>
				{/* <img
					priority="true"
					quality="100"
					layout="fill"
					src="/image/backgrounds/bg-galaxy-a.jpg"
					alt="hero-0"
					className="z-0 overflow-hidden opacity-50"
				/> */}
			</div>

			<div className="pointer-events-none isolate hero-grid-wrap h-[440px] sm:h-[470px] md:h-[500px] lg:h-[530px] absolute top-0">
				<div className="hero-grid"></div>
			</div>
			<div>

			</div>
			<div className=" container flex flex-col items-center overflow-hidden">
				<div className="flex max-lg:flex-col items-center mb-6 gap-4 mt-8 z-1">
					<div className="text-white text-sm font-medium border px-3 py-1 rounded-md border-white/20">
						Open Alpha
					</div>
				</div>
				<h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-7xl font-extrabold text-[#888] relative tracking-tighter text-center mb-6 md:mb-12 max-w-[780px]">
					<span className="text-white z-1">Crie imagens </span>
					<span className="mix-blend-color-dodge text-400">únicas com Inteligência Artificial</span>
				</h1>
				<p className="text-700 mix-blend-color-dodge text-lg sm:text-xl md:text-3xl text-center max-w-[550px] mb-12 md:mb-16 xl:mb-20">
					Uma plataforma para criar, editar e hospedar suas artes e design em um único lugar.
					Um aplicativo baseado em IA desenvolvido para marketing e design modernos.
				</p>
				{!user && <form onSubmit={(e)=>{
					e.preventDefault()
					console.log(user_email)
					// return
					sendSignInLinkToEmail(auth, user_email, actionCodeSettings)
					.then(() => {
						window.localStorage.setItem('emailForSignIn', user_email);
						console.log(`Email enviado para: `+user_email)
						// ...
					})
					.catch((error) => {
						const errorCode = error.code;
						const errorMessage = error.message;
						console.log(`Error(${errorCode}): ${errorMessage}`)
						// ...
					});
				}} className="email-form mb-8" id="">
					<InputText
						type="email"
						className="border-none text-center"
						placeholder="Email para acesso ao alpha"
						required={true}
						onChange={(e)=>{
							set_user_email(e.target.value)
						}}
					/>
					<div className="button-wrapper">
						<Button
							icon='pi pi-user text-green-800 text-3xl'
							className="m-0 p-0 w-max"
							type="submit"
						/>
					</div>
				</form>}
			</div>

			<div className="isolate relative flex surface-card z-1 w-full justify-content-center">
				<div className="grid grid-nogutter max-w-screen-lg">
					<div className="flex col-12 md:col-6 justify-content-center py-5 md:justify-content-start align-items-center p-3">
						{/* {imaginy_editor} */}
						<Imaginy
							ref={editor}
							auto={false}
							alt="hero-1"
							menu={true}
							placeholder='/image/backgrounds/hero-1.jpg'
							width={400}
							height={400}
							// imaginy_view={this.state.imaginy_view}
							// imaginy_vision={this.state.imaginy_vision}
							// fullscreen={this.props.fullscreen}
							className="relative top-0 left-0 w-auto h-30rem z-1 "
							onClose={() => { console.log("VAI QUE VAI") }}
							model='stable-diffusion-2-1-base'
							description="A photo of a futuristic city on Mars. Neon lights. Tron theme Cyberpunk Future punkYeah"
							imagine="nousr robot, mdjrny-v4, masterpiece, best quality, 8k, pastel, minimalistic style, highly detailed, depth of field, sharp focus, hdr, absurdres, high detail, ultra-detailed, highres, high quality, intricate details, outdoors, ultra high res, 4k, extremely detailed, realistic, photorealistic, raw photo, cinematic lighting"
							forget="symmetrical, blury, deformed, cropped, low quality, bad anatomy, multilated, long neck, mutation, malformed limbs, username, poorly drawn face, mutated, easynegative, blurry, monochrome, missing fingers, error, missing legs, jpeg artifacts, watermark, text, too many fingers, poorly drawn hands, duplicate, extra legs, signature"
							// onFullscreen={(value)=>{this.props.onFullscreen(value)}}
							// onCreate={(imaginy_view, imaginy_vision)=>{
							// 	// console.log(imaginy_view)
							// 	var_set("imaginy_view",imaginy_view,{compressed:true})
							// 	var_set("imaginy_vision",JSON.stringify(imaginy_vision))
							// 	this.setState({imaginy_view:imaginy_view})
							// }}
						/>
					</div>
					
					<div className="col-12 md:col-6 p-4 sm:p-6 text-center md:text-left flex align-items-center">
						<section>
							<div className="text-4xl text-white font-bold mb-3">
								Crie sem limites 💭
								<span className="text-3xl text-primary block mb-1">
									Infinitas obras
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
								amo criar e como programador amo pensar.<br /><br />
							</p>
							<p className="font-bold text-white text-lg text-right">
								<span className="text-3xl text-primary font-light">❝</span><i>Conhecimento existe, devemos buscar!</i><span className="text-3xl text-primary font-light">❞</span>
								<br /><span className="text-600 text-sm font-normal">@Nyco3D</span>
							</p>
						</section>
					</div>
					<div className="flex col-12 md:col-6 p-8 sm:p-4 flex-order-0 md:flex-order-1 justify-content-center py-5 md:justify-content-center align-items-center">
						<img
							width={333}
							height={333}
							src="/image/profile.jpg"
							alt="hero-2"
							className="pointer-events-none border-circle overflow-hidden shadow-8 w-full h-auto max-w-20rem"
						/>
					</div>
				</div>
			</div>

		</header>
	</main>;
}
