import Auth from "../../modules/Auth";

import {
	GET_USER_SUCCESS,
	POST_LOGIN_SUCCESS,
	POST_LOGIN_FAIL,
	POST_SINGUP_SUCCESS,
	POST_SINGUP_FAIL
} from "../actions/user.actions";

const INITTIAL_STATE = {
	user: {
		login_errors: {},
		signup_errors: {},
		data: {
			createdAt: "",
			discriminador: "",
			tag: "",
			avatarURL: "",
			xp: "",
			level: "",
			money: ""
		},
		username: "",
		id: ""
	}
};

export default function user(state = INITTIAL_STATE, action) {
	// console.log(action);
	switch (action.type) {
		case GET_USER_SUCCESS:
			delete action.payload.data.user.email;
			delete action.payload.data.user.password;
			delete action.payload.data.user.token;
			return {
				...state,
				user: {
					...state.user,
					...action.payload.data.user
				}
			};
		case POST_LOGIN_SUCCESS:
			Auth.authenticateUser(action.payload.data.user);
			delete action.payload.data.user.email;
			delete action.payload.data.user.password;
			delete action.payload.data.user.token;
			return {
				...state,
				user: {
					...state.user,
					...action.payload.data.user
				}
			};
		case POST_LOGIN_FAIL:
			return {
				...state,
				user: {
					...state.user,
					login_errors: action.error
				}
			};
		case POST_SINGUP_SUCCESS:
			Auth.authenticateUser(action.payload.data.user);
			delete action.payload.data.user.email;
			delete action.payload.data.user.password;
			delete action.payload.data.user.token;
			return {
				...state,
				user: {
					...state.user,
					...action.payload.data.user
				}
			};
		case POST_SINGUP_FAIL:
			return {
				...state,
				user: {
					...state.user,
					signup_errors: action.error
				}
			};
		default:
			return state;
	}
}
