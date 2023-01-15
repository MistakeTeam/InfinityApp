import React, { Component } from "react";
import { NavLink } from "react-router-dom";

export default class Manga extends Component {
	componentWillMount() {
		setTimeout(() => {
			$(".manga-home").css("display", "none");
		}, 10);

		const {
			actions: { queueGetManga, queueSetManga },
			match: {
				params: { mangaid }
			}
		} = this.props;
		queueGetManga(mangaid);
		queueSetManga(mangaid);

		setTimeout(() => {
			$(".manga-page").css("display", "flex");
		}, 10);
	}

	componentWillUnmount() {
		setTimeout(() => {
			$(".manga-home").css("display", "flex");
		}, 10);
	}

	render() {
		const {
			mangaReading,
			match: {
				params: { mangaid }
			}
		} = this.props;

		mangaReading.capitulos.sort(
			(a, b) => a.name.match(/[\w]\d+$/) - b.name.match(/[\w]\d+$/)
		);

		return (
			<d-manga class="manga-page" style={{ display: "none" }}>
				<div className="container">
					<span>{mangaReading.name}</span>
					<div className="manga-cap-list">
						<ul>
							{mangaReading.capitulos.map((item, index) => {
								return (
									<li key={item.id}>
										<div className="manga-cap-item">
											<NavLink to={`/manga/${mangaid}/capitulo/${item.id}`}>
												{item.name}
											</NavLink>
										</div>
									</li>
								);
							})}
						</ul>
					</div>
				</div>
			</d-manga>
		);
	}
}
