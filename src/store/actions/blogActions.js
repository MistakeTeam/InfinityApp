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
	return async (dispacth) => {
		await dispacth({
			type: "GET_ALL_POST",
			payload: {
				request: {
					url: `/blog/all`,
				},
			},
		});
	};
}
