import Auth from "../../modules/Auth";

export const GET_ANIME_EPI = "GET_ANIME_EPI";
export const GET_ANIME_EPI_SUCCESS = "GET_ANIME_EPI_SUCCESS";

function getAnimeEpi(animeid, epid) {
	return dispatch => {
		dispatch({
			type: GET_ANIME_EPI,
			epid: epid,
			payload: {
				client: "API",
				request: {
					method: "get",
					url: `/anime/${animeid}/episodio/${epid}`,
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						Authorization: `bearer ${Auth.getToken()}`
					}
				}
			}
		});
	};
}

export function queueGetAnimeEpi(animeid, epid) {
	return {
		queue: GET_ANIME_EPI,
		callback: (next, dispatch, getState) => {
			dispatch(getAnimeEpi(animeid, epid));
			next();
		}
	};
}
