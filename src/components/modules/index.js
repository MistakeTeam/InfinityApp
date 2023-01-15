import React, { Component } from "react";

import { PropsRoute } from "../../Routes";
import history from "../../history";

import Home from "../../containers/modules/Home.container";

import Board from "../../containers/modules/board/board.conteiner";

import MangaHome from "../../containers/modules/manga/MangaHome.container";
import MangaPage from "../../containers/modules/manga/MangaPage.container";
import MangaViewer from "../../containers/modules/manga/MangaViewer.container";

export default class base extends Component {
	componentWillMount() {
		if (history.location.pathname == "/") {
			history.push("/home");
		}
	}

	render() {
		return (
			<div className="base">
				<div className="container">
					<PropsRoute path="/home" component={Home} />
					<PropsRoute path="/board" component={Board} />
					<PropsRoute path="/manga" component={MangaHome} />
					<PropsRoute path="/manga/:mangaid" component={MangaPage} />
					<PropsRoute path="/manga/:mangaid/capitulo/:capid" component={MangaViewer} />
				</div>
			</div>
		);
	}
}
