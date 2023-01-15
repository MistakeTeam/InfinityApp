import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import ProfileHud from "../../components/navbar/ProfileHud.components";

import * as UserActions from "../../store/actions/user.actions";

const mapStateToProps = state => ({
	...state.userReducer
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators(UserActions, dispatch)
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ProfileHud);
