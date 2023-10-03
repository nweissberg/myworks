import React, { Component } from "react";
import { AutoComplete } from 'primereact/autocomplete';

class AutoCompleteChips extends Component {
	constructor(props) {
		super(props);
		this.state = {
			filtered_forget: [],
			selected_forget: null,
			forget_tokens: []
		};
	}

	componentDidMount() {
		this.updateTokens();
	}

	componentDidUpdate(prevProps) {
		if (prevProps.tokens !== this.props.tokens) {
			this.updateTokens();
		}
	}

	updateTokens() {
		const { tokens, value } = this.props;
		const forget_tokens = Object.entries(tokens).map(([name, value], id) => ({ name, id, value }));
		const selected_forget = value.split(',').map((obj, i) => ({ name: obj, index: i + forget_tokens.length, value: 1 }));
		
		this.setState({
			forget_tokens,
			selected_forget
		});
	}

	search_forget = (event) => {
		setTimeout(() => {
			let _filtered_forget;
			const { forget_tokens } = this.state;

			_filtered_forget = this.state.forget_tokens.filter((token) => {
				return token.name.startsWith(event.query.toLowerCase());
			});
		
			this.setState(prevState => ({
				filtered_forget: [..._filtered_forget, { name: event.query.toLowerCase(), index: prevState.forget_tokens.length, value: 0 }]
			}));
		}, 250);
	}

	render() {
		const { filtered_forget, selected_forget } = this.state;

		return (
			<AutoComplete
				className="chip-auto-complete flex w-full"
				value={selected_forget}
				suggestions={filtered_forget.length <= 1 ? [...filtered_forget, ...this.state.forget_tokens.sort((a, b) => b.value - a.value)] : filtered_forget}
				completeMethod={this.search_forget}
				field="name"
				multiple
				placeholder="Digite uma característica📝"
				aria-label="aria-label"
				dropdownarialabel="dropdownAriaLabel"
				onChange={(e) => {
					const _value = e.value && e.value.length > 0 ? e.value : null;
					if (_value) this.props.onChange?.(Object.values(_value).map(obj => obj.name));
					this.setState({
						selected_forget: _value
					});
				}}
			/>
		);
	}
}

export default AutoCompleteChips;
