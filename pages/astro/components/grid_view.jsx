// import React, { useEffect, useState } from 'react';
import { Dropdown } from "primereact/dropdown";

export default function AstroGrid(props) {

  return <div className={"grid h-min p-3 "+ props.className}>
	{props.planets.map((planet,i)=>{
		return(<div key={planet.name} className="flex align-items-center justify-content-center col-12">
			<div className="flex gap-4 align-items-center justify-content-between w-full min-w-30rem">
				<img width='33px' height='33px' src={"/image/icon/"+planet.name+".png"} alt={planet.name} />
				<h5 className="capitalize text-white text-2xl md:text-lg lg:text-2xl xl:text-2xl text-center" key={'planet_'+planet.name}>
					{planet.name}{planet.zodiac &&<span>: <span className="text-green-400">{planet.zodiac?.name}</span></span>}
				</h5>
				{props.zodiac && <Dropdown className="w-5rem h-3rem capitalize"
					value={planet.zodiac?planet.zodiac:null}
					onChange={(e)=>{props.AssignZodiac(i,e.value)}}
					options={props.zodiac}
					optionLabel={(sign)=>{
						return(<div key={sign.name} className="flex items-center gap-2">
							<img className="w-2rem h-2rem" src={"/image/icon/"+sign.name+".png"} alt={sign.name} />
						</div>)
					}}
					itemTemplate={(sign)=>{
						return(<h3 key={sign.name}>{sign.name}</h3>)
					}}
				/>}
			</div>
			
		</div>
		)
	})}
</div>;
}
