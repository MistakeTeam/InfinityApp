import Auth from "../../modules/Auth";

export const CLEAN_MANGA_CAP = "CLEAN_MANGA_CAP";
export const GET_MANGA = "GET_MANGA";
export const GET_MANGA_SUCCESS = "GET_MANGA_SUCCESS";
export const GET_MANGA_CAP = "GET_MANGA_CAP";
export const GET_MANGA_CAP_SUCCESS = "GET_MANGA_CAP_SUCCESS";
export const GET_MANGA_LIST = "GET_MANGA_LIST";
export const GET_MANGA_LIST_SUCCESS = "GET_MANGA_LIST_SUCCESS";
export const SET_MANGA = "SET_MANGA";

function cleanMangaCap() {
	return dispatch => {
		dispatch({
			type: CLEAN_MANGA_CAP
		});
	};
}

export function queueCleanMangaCap() {
	return {
		queue: CLEAN_MANGA_CAP,
		callback: (next, dispatch, getState) => {
			dispatch(cleanMangaCap());
			next();
		}
	};
}

function getMangaList() {
	return dispatch => {
		dispatch({
			type: GET_MANGA_LIST,
			payload: {
				client: "API",
				request: {
					method: "get",
					url: "/mangalist",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						Authorization: `bearer ${Auth.getToken()}`
					}
				}
			}
		});
	};
}

export function queueGetMangaList() {
	return {
		queue: GET_MANGA_LIST,
		callback: (next, dispatch, getState) => {
			dispatch(getMangaList());
			next();
		}
	};
}

function getMangaCap(mangaid, capid) {
	return dispatch => {
		dispatch({
			type: GET_MANGA_CAP,
			capid: capid,
			payload: {
				client: "API",
				request: {
					method: "get",
					url: `/manga/${mangaid}/capitulo/${capid}`,
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						Authorization: `bearer ${Auth.getToken()}`
					}
				}
			}
		});
	};
}

export function queueGetMangaCap(mangaid, capid) {
	return {
		queue: GET_MANGA_CAP,
		callback: (next, dispatch, getState) => {
			dispatch(cleanMangaCap());
			dispatch(getMangaCap(mangaid, capid));
			next();
		}
	};
}

function getManga(mangaid) {
	return dispatch => {
		dispatch({
			type: GET_MANGA,
			payload: {
				client: "API",
				request: {
					method: "get",
					url: `/manga/${mangaid}`,
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						Authorization: `bearer ${Auth.getToken()}`
					}
				}
			}
		});
	};
}

export function queueGetManga(mangaid) {
	return {
		queue: GET_MANGA,
		callback: (next, dispatch, getState) => {
			dispatch(getManga(mangaid));
			next();
		}
	};
}

function setManga(manga) {
	return dispatch => {
		dispatch({
			type: SET_MANGA,
			data: manga
		});
	};
}

export function queueSetManga(mangaid) {
	return {
		queue: SET_MANGA,
		callback: (next, dispatch, getState) => {
			let manga = getState().mangaReducer.mangaList.find(
				manga => manga.id == mangaid
			);

			if (!manga) {
				dispatch({
					type: GET_MANGA_LIST,
					payload: {
						client: "API",
						request: {
							method: "get",
							url: "/mangalist",
							headers: {
								"Content-Type": "application/x-www-form-urlencoded",
								Authorization: `bearer ${Auth.getToken()}`
							}
						}
					}
				}).then(response => {
					if (response.type.endsWith("_SUCCESS")) {
						dispatch(
							setManga(
								getState().mangaReducer.mangaList.find(
									manga => manga.id == mangaid
								)
							)
						);
					}
				});
			} else {
				dispatch(setManga(manga));
			}

			next();
		}
	};
}
