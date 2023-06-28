import { useState, useEffect } from "react";
import { AutoComplete } from 'primereact/autocomplete';

export default function AutoCompleteChips(props) {
	const [filtered_forget, set_filtered_forget] = useState([])
	const [selected_forget, set_selected_forget] = useState(null)
	const [forget_tokens, set_forget_tokens] = useState([])

	useEffect(()=>{
		set_forget_tokens(Object.entries(props.tokens).map((key,id)=>{
			return({name:key[0],id:id,value:key[1]})
		}))
		set_selected_forget(props.value.split(',').map((obj,i)=>{
			return({name:obj,index:i+forget_tokens.length, value:1})
		}))
	},[props])

	const search_forget = (event) => {
		// forget_tokens[0].name = event.query.toLowerCase()
		setTimeout(() => {
			let _filtered_forget;
			
			_filtered_forget = forget_tokens.filter((token) => {
				return token.name.startsWith(event.query.toLowerCase());
			});
		
			set_filtered_forget([..._filtered_forget, {name:event.query.toLowerCase(),index:forget_tokens.length, value:0}]);
		}, 250);
	}

	return (
		<AutoComplete
			className="chip-auto-complete flex w-full"
			value={selected_forget}
			suggestions={filtered_forget.length<=1?[...filtered_forget,...forget_tokens.sort((a,b)=>b.value - a.value)]:filtered_forget}
			completeMethod={search_forget}
			field="name"
			multiple
			placeholder="Digite uma característica📝"
			aria-label="aria-label"
			dropdownarialabel="dropdownAriaLabel"
			// {...props}
			onChange={(e) => {
				var _value = null
				if(e.value && e.value.length > 0) _value = e.value
				if(_value) props.onChange?.(Object.values(_value).map(obj=>obj.name))
				set_selected_forget(_value)
			}}
		/>
	);
}
