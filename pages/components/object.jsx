import React from 'react'

export default class Object extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	componentDidMount () {
		// console.log(this.props.user)
		this.props.onLoad?.(this)
		this.props.onMount?.(this)
	}
	render () {
		return (
			<div>
				<div>
					{this.props.children}
				</div>
			</div>
		)
	}
}