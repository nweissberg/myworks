import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";

function PageBy() {
	const button_class = 'w-full md:max-w-20rem border-orange-600 shadow-8 border-3 p-button-rounded p-button-lg font-bold p-button-warning'
	const icon_class = ' text-3xl'

	return (<div className="surface-50 flex scrollbar-none flex-wrap w-screen h-screen flex-wrap overflow-y-scroll ">
		<div className="flex flex-wrap w-screen justify-content-center">
			<h1 className="text-orange-300 text-center">Atendimento Presencial</h1>
			<h3>Terça há Domingo das 10h às 19h</h3>
			<h4>R. Santa Cruz, 1673 - Centro, Piracicaba - SP</h4>
		</div>
		<div className="col-12 md:col-4 text-center flex align-items-center">
			<div className="blur-load " style={{backgroundImage: 'url(image/NycoTattooLoad.jpg)'}}>
				<img className='' alt='Nyco Tattoo Logo' width='100%' src='image/NycoTattoo.jpg' />
			</div>
		</div>
		<div className="col-12 md:col-4 p-4 sm:p-6 text-center md:text-left flex align-items-center">
			<section className="grid gap-3 md:gap-4 lg:gap-6 justify-content-center">
			<Button label='Localização' 
				className={button_class}
				icon={'pi pi-map-marker' + icon_class}
				onClick={()=>{
					window.open('https://goo.gl/maps/arfGxeT1dkfM3TX4A')
				}}
			/>
			<Button label='Instagram'
				className={button_class}
				icon={'pi pi-instagram' + icon_class}
				onClick={(e)=>{
					window.open('https://instagram.com/nycotattoo').focus();
				}}
			/>
			<Button label='Whatsapp'
				className={button_class}
				icon={'pi pi-whatsapp' + icon_class}
				onClick={(e)=>{
					window.open('https://wa.me/5519989566778').focus();
				}}
			/>
			<Button label='Telefone'
				className={button_class}
				icon={'pi pi-phone' + icon_class}
				onClick={(e)=>{
					window.open('tel:+5519989566778','_self')
				}}
			/>
			
			<Button label='Avaliar'
				className={button_class}
				icon={'pi pi-star' + icon_class}
				onClick={()=>{
					window.open('https://g.page/r/CWQygj4cDIz1EBM/review')
				}}
				
			/>
			<Button label='Compartilhar'
				className={button_class}
				icon={'pi pi-send' + icon_class}
				onClick={()=>{
					navigator.share({
						title: 'Nyco Tattoo',
						message:'Tatuador no centro de Piracicaba',
						url:'https://imaginy.web.app/?pg=by'
					})
				}}
			/>
				
			</section>
		</div>
		<div className="col-12 md:col-4 p-4 sm:p-6 text-center flex align-items-center justify-content-center h-screen">
			<section className="max-w-20rem">
				<img alt='https://imaginy.web.app/by' width='100%' src='image/qrcode.jpg' />
			</section>
		</div>
	</div>);
}

export default PageBy;
