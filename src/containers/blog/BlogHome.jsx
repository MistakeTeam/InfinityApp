import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as BlogActions from "../../store/actions/blogActions";

class BlogHome extends Component {
	constructor(props, context) {
		super(props, context);
	}

	componentDidMount() {
		this.props.actions.getAllPost();
	}

	render() {
		const {
			blogReducer: { postList },
		} = this.props;
		console.log(this.props);

		return (
			<div>
				{typeof postList === Array.isArray ? (
					postList.map((post) => {
						return (
							<div>
								<h2>{post.titulo}</h2>
							</div>
						);
					})
				) : (
					<div>Nenhuma postagem foi encontrada!</div>
				)}
			</div>
		);
	}
}

const mapDispatchToProps = (dispacth) => {
	return { ...bindActionCreators(BlogActions, dispacth) };
};

const mapStateToProps = (state) => {
	return {
		blogReducer: state.blogReducer,
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
	(stateProps, dispacthProps, ownProps) => {
		return {
			...stateProps,
			router: ownProps,
			actions: dispacthProps,
		};
	},
)(BlogIndex);
