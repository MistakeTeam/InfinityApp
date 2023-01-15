import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import MangaPage from "../../../components/modules/manga/MangaPage.components";

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
)(MangaPage);
