// import React, { useEffect, useState } from 'react';
import { Dropdown } from "primereact/dropdown";

export default function AstroTexts(props) {

  return <div className={"flex flex-wrap gap-3 p-3 "+ props.className}>
	{props.planets.map((planet,i)=>{
		if(!planet.zodiac) return(<></>)
		return(<div key={planet.name} className="flex flex-wrap align-items-center mb-5">
			<div className="flex gap-3 align-items-center">
				<img width='22px' height='22px' src={"/image/icon/"+planet.name+".png"} alt={planet.name} />
				<h2 className="capitalize text-xl md:text-xl lg:text-2xl xl:text-3xl" key={'planet_'+planet.name}>
					{planet.name}{planet.zodiac &&<span>: <span className="text-green-400">{planet.zodiac?.name}</span></span>}</h2>
				{props.zodiac && <Dropdown className="w-4rem capitalize"
					value={planet.zodiac?planet.zodiac:null}
					onChange={(e)=>{props.AssignZodiac(i,e.value)}}
					options={props.zodiac}
					optionLabel={(sign)=>{
						return(<div key={sign.name} className="flex items-center gap-2">
							<img className="w-1rem h-1rem" src={"/image/icon/"+sign.name+".png"} alt={sign.name} />
						</div>)
					}}
					itemTemplate={(sign)=>{
						return(<h3 key={sign.name}>{sign.name}</h3>)
					}}
				/>}
			</div>
		
			<div className="flex flex-wrap gap-3 text-bluegray-200 pt-2">
				<label>{planet.meaning}</label>
				
					<label className="text-green-300">{planet.zodiac.meaning}</label>
					<div className="flex flex-wrap gap-2">
						{planet.zodiac.good.map((good,i)=>{
							return(<h4 className="text-cyan-200 uppercase" key={'good_'+i}>{good}</h4>)
						})}
						{planet.zodiac.bad.map((bad,i)=>{
							return(<h4 className="text-orange-200 uppercase" key={'bad_'+i}>{bad}</h4>)
						})}
					</div>
			</div>
		
		</div>
		)
	})}
</div>;
}
