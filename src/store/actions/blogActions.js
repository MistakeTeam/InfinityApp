export function getPost(id) {
	return {
		type: "GET_POST",
		payload: {
			request: {
				url: `/blog/${id}`,
			},
		},
	};
}

export function getAllPost() {
	return {
		type: "GET_ALL_POST",
		payload: {
			request: {
				url: `/blog/all`,
			},
		},
	};
}
