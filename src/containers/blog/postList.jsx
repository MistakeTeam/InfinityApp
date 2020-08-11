import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";

import Post from "../../components/blog/post";

class PostList extends Component {
	static propTypes = {
		posts: PropTypes.object.isRequired,
	};

	constructor(props, context) {
		super(props, context);
	}

	render() {
		if (!this.props.posts.length) {
			return <div>Sem postagens :(</div>;
		}

		return (
			<div>
				{this.props.posts.map((post) => {
					return <Post post={post} />;
				})}
			</div>
		);
	}
}

const mapDispatchToProps = (dispacth) =>
	bindActionCreators(BlogActions, dispacth);

const mapStateToProps = (state) => {
	return {
		blogReducer: state.blogReducer,
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(PostList);
