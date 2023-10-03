import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { loadYaml, yamlDocToJSON } from "../athena/athena_context";
import { var_get, var_set } from "../utils";
import { getUniverse } from "./solar_system";
import { ToggleButton } from 'primereact/togglebutton';
import { Calendar } from 'primereact/calendar';
import { Inplace, InplaceContent, InplaceDisplay } from 'primereact/inplace';
import CodeViewer from "../components/code_viewer";
import AstroTexts from "./components/texts_view";
import AstroGrid from "./components/grid_view";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { add_data, get_data } from "../api/firebase";
// import { Steps } from 'primereact/steps';
import { Toast } from 'primereact/toast';
import Imaginy from "../components/ml_imaginy";

export default function AstroPage(props) {
	
	const router = useRouter()
	const [astrology, set_astrology] = useState({});
	const [planets, set_planets] = useState([]);
	const [zodiac, set_zodiac] = useState([]);
	const [constelations, set_constelations] = useState({});
	const [grid_view, set_grid_view] = useState(true);
	const [astro_date, set_astro_date] = useState(null);
	const [map_name, set_map_name] = useState('');
	const [map_email, set_map_email] = useState('');
	const [step_active_index, set_step_active_index] = useState(0);
	const toast = useRef(null);
	const calendar = useRef(null)
	const [show_calendar, set_show_calendar] = useState(false);
	const step_items = [
        {
            label: 'Personal',
			icon: 'pi pi-user',
            command: (event) => {
                // toast.current.show({ severity: 'info', summary: 'First Step', detail: event.item.label });
            }
        },
        {
            label: 'Birth Date',
			icon: 'pi pi-calendar',
            command: (event) => {
				// toast.current.show({ severity: 'info', summary: 'Seat Selection', detail: event.item.label });
            },
			disabled: map_name=='',
        },
        {
            label: 'Contact',
			icon: 'pi pi-envelope',
            command: (event) => {
				// toast.current.show({ severity: 'info', summary: 'Pay with CC', detail: event.item.label });
            },
			disabled: astro_date==null,
        },
        {
            label: 'Confirmation',
			icon: 'pi pi-thumbs-up',
            command:(event) => {
                // toast.current.show({severity: 'info', summary: 'Last Step', detail: event.item.label });
				// console.log(astro_date)
				ZodiacData(astro_date).then(_constelations =>{
					console.log(_constelations)
					router.push({pathname:'/astro', query:{map:'local'}})
					set_constelations(_constelations)
				})
            },
			disabled: map_email==''
        }
    ];
	function loadData(){
		loadYaml("/data/astrology.yaml").then((data) => {
			if(!data[0]) return
			set_astrology(yamlDocToJSON(data[0]));
		});
	}

	useEffect(()=>{
		if(router.query.map == 'new'){
			console.log('new map')		
		}
	},[router])
	
	function newMap(){
		set_step_active_index(0)
		set_constelations({})
		set_astro_date(null)
		set_map_name('')
		set_map_email('')
		router.push({pathname:'/astro', query:{map:'new'}})
	}

	async function ZodiacData(date,set=false){
		return await getUniverse({
			'date': date,
			'longitude': -47.635701,
			'latitude': -22.746278,
			'altitude': 16,
		}).then(data => {
			if(!data) return
			var _constelations = {...constelations}
			Object.keys(data).map((key,i)=>{
				_constelations[key] = data[key].zodiac
			})
			_constelations.name = map_name
			_constelations.date = astro_date.getTime()
			_constelations.moon = data.earth.astroBodies[0].zodiac
			if(set){
				set_constelations(_constelations)
			}
			return(_constelations)
		})
	}
	function AssignZodiac(index,constelation){
		console.log(constelation)
		var _constelations = {...constelations}
		var _planets = [...planets]
		_planets[index].zodiac = constelation
		_constelations[_planets[index].name] = constelation.name
		set_planets(_planets)
		set_constelations(_constelations)
	}
	function SetAstroData(_constelations){
		set_planets(Object.keys(astrology.astros).map((key,i)=>{
			return({
				name:key.toLowerCase(),
				...astrology.astros[key],
				zodiac:_constelations[key]?{name:_constelations[key],...astrology.zodiac[_constelations[key]]}:null
			})
		}))
		set_zodiac(Object.keys(astrology.zodiac).map((key,i)=>{
			return({
				name:key,
				...astrology.zodiac[key]
			})
		}))
	}
	
	useEffect(() => {
		loadData()
	}, []);

	useEffect(() => {
		
		// if(!constelations.uid){
		// 	ZodiacData(astro_date,true)
		// }
		// if(!astro_date){
		// 	set_astro_date(new Date())
		// }
		
	}, [astro_date]);

	useEffect(() => {
		// console.log(constelations)
		if(Object.keys(constelations).length > 0){
			SetAstroData(constelations)
			var_set('constelations',JSON.stringify(constelations))
		}
	}, [constelations]);

	useEffect(()=>{
		if(!astrology || Object.keys(astrology).length == 0 || router.query.map != 'local') return
		var_get('constelations').then(async (data)=>{
			var _constelations = data?JSON.parse(data):{}
			if(data){
				if(!data.uid){
					set_constelations(_constelations)
				}else{
					await get_data('astrology.'+data.uid).then(data=>{
						console.log(data)
					})
				}
			}
			// else{
			// 	_constelations = await ZodiacData(astro_date)
			// 	set_constelations(_constelations)
			// }
			if(_constelations.name) set_map_name(_constelations.name)
			SetAstroData(_constelations)
		})
	},[astrology])

	if(router.query.map == 'new'){
		return(<>
		<Toast ref={toast} position="bottom-center"></Toast>
		<header
			className=" transform-gpu wrapper hide-scroll h-screen w-screen overflow-x-hidden"
		//style='background-image: url("/image/backgrounds/bg-galaxy-b.jpg");'
		>

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
			</div>
		</header>
		{step_active_index == 4 && <div className="center">
			<h3>TESTE</h3>
		</div>}
		{step_active_index <= 3 && <div className="flex absolute bottom-0 w-screen p-4 justify-content-between z-1">
			{step_items.map((item,i)=>{
				return(<div key={item.label} className="flex flex-wrap align-items-center justify-content-center gap-3">
					<Button
						disabled={item.disabled}
						icon={item.icon +" text-2xl"}
						className="p-button-rounded p-button-text bg-black-alpha-50 hover:bg-black-alpha-80 p-4"
						onClick={(e)=>{
							set_step_active_index(i)
							item.command()
						}}
					/>
					<h4 className={item.disabled?'':"text-white"}>{item.label}</h4>
				</div>)
			})}
		</div>}

		<div className="flex top-0 left-0 absolute w-screen h-screen overflow-visible justify-content-center">
			{/* <span className="p-float-label">
				<InputText id="username"
					value={map_name}
					onChange={(e) => set_map_name(e.target.value)}
					autoFocus
				/>
				<label htmlFor="username" className="block text-sm font-medium text-white">
					Your Name
				</label>
			</span> */}
			{step_active_index < 4 &&  <form onSubmit={(e)=>{
				e.preventDefault()
				console.log(map_name)
				// return
				// set_step_active_index(step_active_index+1)
				
			}} className={"email-form "+(step_items[step_active_index+1]?.disabled?"":"is-filled")} id="">
				<div className="z-2 absolute top-0 text-center w-full mt-2 text-green-300">
					<h1>{step_items[step_active_index].label}</h1>
				</div>

				{step_active_index==0 &&
				<InputText
					type="name"
					className="border-none text-center"
					placeholder="Full Name"
					required={true}
					value={map_name}
					onChange={(e) => set_map_name(e.target.value)}
				/>}
				{step_active_index==1 &&<>
					{show_calendar && <div className=" fadein animation-iteration-1 animation-duration-300 z-1 bg-blur-1 fixed top-0 left-0 w-screen h-screen bg-black-alpha-50"></div>}
					<Calendar
						ref={calendar}
						className="justify-content-center w-screen"
						inputClassName="text-center border-none text-white capitalize"
						id="touchUI"
						dateFormat="D dd M yy -"
						hourFormat="24"
						tabIndex={0}
						view={astro_date==null && !show_calendar?"year":"date"}
						showTime
						touchUI
						placeholder="Click to select"
						onShow={(e)=>{set_show_calendar(true)}}
						onHide={(e)=>{set_show_calendar(false)}}
						footerTemplate={(e)=>{
							return(<div className="flex justify-content-between w-full">
								<Button
									label='Cancel'
									className="p-button-lg font-bold p-button-rounded p-button-text hover:bg-bluegray-900 bg-black-alpha-20 p-button-secondary hover:text-white"
									icon='pi pi-times font-bold'
									// iconPos="right"
									onClick={(e)=>{
										set_astro_date(null)
										calendar.current.hide()
									}}
								/>
								<Button
									disabled={astro_date==null}
									label={astro_date==null?'Select a date':astro_date.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
									className="p-button-lg font-bold p-button-rounded"
									icon='pi pi-check-circle font-bold'
									iconPos="right"
									onClick={(e)=>{
										calendar.current.hide()
									}}
								/>
							</div>)
						}}
						value={astro_date}
						onChange={(e) => set_astro_date(e.value)}
					/>
				</>
				}
				{step_active_index==2 &&
					<InputText
						id="email"
						value={map_email}
						type="email"
						className="border-none text-center"
						placeholder="Your Email"
						// required={true}
						
						onChange={(e) => set_map_email(e.target.value)}
					/>
				}
				
				{step_active_index < 3 &&
					<div className="button-wrapper">
						<Button
							icon={'text-green-800 text-3xl '+ (step_items[step_active_index+1].disabled?'pi pi-chevron-left':step_items[step_active_index].icon)}
							className="m-0 p-0 w-max"
							// type="submit"
							// disabled={step_items[step_active_index+1].disabled}
							onClick={(e)=>{
								// console.log(e)
								// return
								
								if(step_items[step_active_index+1].disabled){
									set_step_active_index(step_active_index-1)
								}else{
									set_step_active_index(step_active_index+1)
								}
							}}
						/>
					</div>
				}
				{step_active_index==3 && astro_date &&
					<div className="m-3 flex flex-wrap absolute text-center justify-content-center w-auto text-white bg-black-alpha-50 bg-blur-2 p-4 gap-2 border-round-lg">
						<h1>{map_name}</h1>
						<h2 className="text-gray-100 text-xl">{astro_date.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} - {astro_date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</h2>
						<h3 className="text-green-300" >{map_email}</h3>
						<Button
							icon={'text-green-800 text-3xl '+ step_items[step_active_index].icon}
							className="m-0 p-0 w-min"
							// type="submit"
							// disabled={step_items[step_active_index+1].disabled}
							onClick={(e)=>{
								console.log(e)
								step_items[step_active_index].command()
								// return
								set_step_active_index(step_active_index+1)
							
							}} 
						/>
					</div>
				}

				
			</form>}
		</div>
		</>)
	}
	return (
		<>
		{/* <CodeViewer
			header={"Astrology Data"}
			code={astrology}
			language="json"
			highlight=""
			reload={() => {
				loadData();
			}}
		/> */}
		<header className="z-2 px-3 flex bg-white-alpha-10 sm:bg-blur-2 w-full h-4rem align-items-center justify-content-between" >
			<Inplace closable>
				<InplaceDisplay className="h-full flex w-full align-items-center">
					<h3><i className="pi pi-pencil mr-2 text-lg text-green-300 cursor-pointer"/>{map_name || 'Map Name'}</h3>
				</InplaceDisplay>
				<InplaceContent className="h-min flex">
					<InputText value={map_name} onChange={(e) => set_map_name(e.target.value)} autoFocus />
				</InplaceContent>
			</Inplace>
			<h2>Astrology Map</h2>
			<Calendar
				id="astro_date_calendar"
				value={astro_date}
				onChange={(e) => set_astro_date(e.value)}
				onHide={()=>{
					console.log(astro_date)
				}}
				showIcon
				dateFormat="D dd M yy -"
				hourFormat="24"
				showTime
				showButtonBar 
			/>
			
		</header>
		<div className="z-1 flex w-screen h-6rem fixed bg-gradient-top"/>
		<div className="absolute top-0 overflow-y-scroll overflow-x-hidden h-screen py-8 w-screen surface-ground">
			
			<div className="flex grid">
				{grid_view && <AstroGrid className='col-12 sm:col-12 md:col-5 lg:col-4' {...{planets, zodiac, AssignZodiac}} />}
				<AstroTexts className='col' {...{planets, zodiac, AssignZodiac}} />
			</div>
		</div>
		<div className="z-1 flex w-screen h-6rem fixed bg-gradient-bottom bottom-0"/>
		<div className="flex z-2 absolute bottom-0 h-4rem w-screen bg-white-alpha-10 sm:bg-blur-2 align-items-center">
			{/* <label htmlFor="icon">Icon</label> */}
			<div className="flex w-screen px-3 justify-content-between">
				
				<ToggleButton
					checked={grid_view}
					onChange={(e) => set_grid_view(e.value)}
					onLabel="Astro List"
					offLabel="Astro List"
					onIcon="pi pi-eye text-green-300"
					offIcon="pi pi-eye-slash"
					className='sm:icon-only p-button-text border-none shadow-none'
					style={{
						background: 'transparent',
						color:'white'
					}}
					aria-label="Confirmation"
				/>
				<Button
					label="New Map"
					icon="pi pi-calendar-plus text-green-300"
					iconPos="right"
					className="p-button-text text-white border-none shadow-none"
					onClick={newMap}
				/>
				<Button
					label="Save"
					icon="pi pi-cloud-upload text-green-300"
					iconPos="right"
					className="p-button-text border-none shadow-none"
					onClick={(e)=>{
						var _constelations = {...constelations}
						_constelations.name = map_name
						delete _constelations.earth
						if(!_constelations.uid){
							add_data('astrology',_constelations).then((data_uid)=>{
								_constelations.uid = data_uid
								console.warn("NEW MAP", _constelations);
								set_constelations(_constelations)
								if(Object.keys(_constelations).length > 0){
									var_set('constelations',JSON.stringify(_constelations))
								}
							})
						}else{
							set_constelations(_constelations)
							if(Object.keys(_constelations).length > 0){
								var_set('constelations',JSON.stringify(_constelations))
							}
						}

						// console.log(_constelations)
					}}
				/>
			</div>
		</div>
</>);
}
