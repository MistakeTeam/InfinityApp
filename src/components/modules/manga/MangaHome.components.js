import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import ScrollBooster from "../../../../API/ScrollBooster";

export default class MangaHome extends Component {
	componentDidMount() {
		const { queueGetMangaList } = this.props.actions;
		queueGetMangaList();

		let viewportEl = $(".mangalist")[0];
		let scr = new ScrollBooster({
			viewport: viewportEl,
			emulateScroll: true,
			mode: "x",
			onUpdate: function(data) {
				viewportEl.scrollLeft = data.position.x;
				scr.updateMetrics();
			}
		});
		scr.updateMetrics();
		setTimeout(() => {
			scr.updateMetrics();
		}, 10);
	}

	render() {
		const { mangaList } = this.props;

		mangaList.sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0));

		return (
			<div
				className="manga-home"
				style={{ display: "flex", flexDirection: "column" }}
			>
				<span>Mangá</span>
				<div className="mangalist">
					<div className="container">
						<ul>
							{mangaList.map((item, index) => {
								return (
									<li key={item.id}>
										<NavLink
											to={`/manga/${item.id}`}
											className="mangalist-item"
										>
											{item.name}
										</NavLink>
									</li>
								);
							})}
						</ul>
					</div>
				</div>
			</div>
		);
	}
}
