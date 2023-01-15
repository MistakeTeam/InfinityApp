import Auth from "../../modules/Auth";
import history from "../../history";

export const POST_LOGIN = "POST_LOGIN";
export const POST_LOGIN_SUCCESS = "POST_LOGIN_SUCCESS";
export const POST_LOGIN_FAIL = "POST_LOGIN_FAIL";
export const POST_SINGUP = "POST_SINGUP";
export const POST_SINGUP_SUCCESS = "POST_SINGUP_SUCCESS";
export const POST_SINGUP_FAIL = "POST_SINGUP_FAIL";
export const GET_USER = "GET_USER";
export const GET_USER_SUCCESS = "GET_USER_SUCCESS";

function getUser() {
	return dispatch => {
		dispatch({
			type: GET_USER,
			payload: {
				client: "API",
				request: {
					method: "get",
					url: "/getUser",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						Authorization: `bearer ${Auth.getToken()}`
					}
				}
			}
		});
	};
}

export function queueGetUser() {
	return {
		queue: GET_USER,
		callback: (next, dispatch, getState) => {
			dispatch(getUser());
			next();
		}
	};
}

function postLogin(formData) {
	return dispatch => {
		dispatch({
			type: POST_LOGIN,
			payload: {
				client: "Auth",
				request: {
					method: "post",
					url: "/login",
					data: formData,
					headers: {
						"Content-Type": "application/x-www-form-urlencoded"
					}
				}
			}
		}).then(response => {
			if (response.type.endsWith("_SUCCESS")) {
				history.push("/");
			}
		});
	};
}

export function queuePostLogin(formData) {
	return {
		queue: POST_LOGIN,
		callback: (next, dispatch, getState) => {
			dispatch(postLogin(formData));
			next();
		}
	};
}

function postSignup(formData) {
	return dispatch => {
		dispatch({
			type: POST_SINGUP,
			payload: {
				client: "Auth",
				request: {
					method: "post",
					url: "/signup",
					data: formData,
					headers: {
						"Content-Type": "application/x-www-form-urlencoded"
					}
				}
			}
		}).then(response => {
			if (response.type.endsWith("_SUCCESS")) {
				history.push("/");
			}
		});
	};
}

export function queuePostSignup(formData) {
	return {
		queue: POST_SINGUP,
		callback: (next, dispatch, getState) => {
			dispatch(postSignup(formData));
			next();
		}
	};
}
