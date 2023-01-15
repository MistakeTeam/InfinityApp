import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import Board from "../../../components/modules/board/board.component";

import * as BoardActions from "../../../store/actions/board.actions";

const mapStateToProps = (state) => ({
	...state.boardReducer,
});

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators(BoardActions, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Board);
