import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import MangaHome from "../../../components/modules/manga/MangaHome.components";

import * as MangaActions from "../../../store/actions/manga.actions";

const mapStateToProps = state => ({
	...state.mangaReducer
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators(MangaActions, dispatch)
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(MangaHome);
