import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import Post from "../../components/blog/post";
import { getPost } from "../../store/actions/blogActions";

class PostView extends Component {
	constructor(props, context) {
		super(props, context);
	}

	componentDidMount() {
		const {
			router: {
				match: { params },
			},
		} = this.props;

		this.props.actions.getPost(params.id);
	}

	render() {
		const {
			blogReducer: { post },
		} = this.props;

		return (
			<div>
				{Object.keys(post).length > 0 ? (
					<Post post={post} />
				) : (
					<div>Postagem não encontrada! :(</div>
				)}
			</div>
		);
	}
}

const mapDispatchToProps = (dispacth) => {
	return { ...bindActionCreators({ getPost }, dispacth) };
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
)(PostView);
