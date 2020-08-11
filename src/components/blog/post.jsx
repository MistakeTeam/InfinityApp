import React, { Component } from "react";
import PropTypes from "prop-types";

export default class Post extends Component {
	static propTypes = {
		post: PropTypes.object.isRequired,
	};

	constructor(props, context) {
		super(props, context);
	}

	render() {
		console.log(this.props);

		return (
			<div>
				<h2>{this.props.post.titulo}</h2>
			</div>
		);
	}
}
