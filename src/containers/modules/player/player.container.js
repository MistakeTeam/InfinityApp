import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import PlayerPage from "../../../components/modules/player/player.components";

import * as AnimeActions from "../../../store/actions/anime.actions";

const mapStateToProps = state => ({
	...state.animeReducer
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators(AnimeActions, dispatch)
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(PlayerPage);
