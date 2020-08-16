import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";

import { getAllPost } from "../../store/actions/blogActions";

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

		return (
			<div className="blog-home">
				{postList.length > 0 ? (
					postList.map((post) => {
						let postID = String(post.id).replace(/\.json/, "");

						return (
							<Link to={"/blog/post/" + postID} key={postID}>
								<div className="post-resume" id={postID}>
									<span className="post-resume-titulo">{post.titulo}</span>
									<span className="post-resume-subtitulo">{post.subTitulo}</span>
									<span className="post-resume-autor">{post.autor}</span>
								</div>
							</Link>
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
	return { ...bindActionCreators({ getAllPost }, dispacth) };
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
)(BlogHome);
