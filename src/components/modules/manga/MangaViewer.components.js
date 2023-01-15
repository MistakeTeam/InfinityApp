import React, { Component } from "react";
import axios from "axios";

import history from "../../../history";

export default class Manga extends Component {
	constructor(props) {
		super(props);

		const {
			actions: { queueGetMangaCap },
			mangaReading: { capitulos },
			match: {
				params: { mangaid, capid }
			}
		} = this.props;

		queueGetMangaCap(mangaid, capid);
		this.state = {
			capIndex: capitulos.findIndex(capitulo => capitulo.id == capid),
			pagIndex: 0
		};
	}

	componentWillMount() {
		setTimeout(() => {
			$(".manga-page").css("display", "none");
		}, 10);
	}

	componentWillUnmount() {
		setTimeout(() => {
			$(".manga-page").css("display", "flex");
		}, 10);
	}

	nextCap() {
		const {
			actions: { queueGetMangaCap },
			mangaReading: { capitulos },
			match: {
				params: { mangaid }
			}
		} = this.props;

		if (this.state.capIndex + 1 >= capitulos.length) return;

		let nextCap = capitulos[this.state.capIndex + 1];

		this.setState({
			capIndex: this.state.capIndex + 1,
			pagIndex: 0
		});

		queueGetMangaCap(mangaid, nextCap.id);
		history.push(`/manga/${mangaid}/capitulo/${nextCap.id}`);
	}

	previousCap() {
		const {
			actions: { queueGetMangaCap },
			mangaReading: { capitulos },
			match: {
				params: { mangaid }
			}
		} = this.props;

		if (this.state.capIndex - 1 < 0) return;

		let previousCap = capitulos[this.state.capIndex - 1];

		this.setState({
			capIndex: this.state.capIndex - 1,
			pagIndex: 0
		});

		queueGetMangaCap(mangaid, previousCap.id);
		history.push(`/manga/${mangaid}/capitulo/${previousCap.id}`);
	}

	nextPage() {
		const {
			mangaReading: {
				capReading: { paginas }
			}
		} = this.props;

		if (this.state.pagIndex + 1 >= paginas.length) return;

		this.setState({
			pagIndex: this.state.pagIndex + 1
		});
	}

	previousPage() {
		if (this.state.pagIndex - 1 < 0) return;

		this.setState({
			pagIndex: this.state.pagIndex - 1
		});
	}

	render() {
		const {
			mangaReading: {
				capitulos,
				capReading: { paginas }
			}
		} = this.props;

		return (
			<d-manga class="manga-viewer" style={{ display: "flex" }}>
				<div className="controler-capitulo">
					<div className="container">
						{capitulos[this.state.capIndex - 1] ? (
							<div onClick={() => this.previousCap()}>Anterior</div>
						) : (
							<div>Anterior</div>
						)}
						<div>Capítulo {this.state.capIndex + 1}</div>
						{capitulos[this.state.capIndex + 1] ? (
							<div onClick={() => this.nextCap()}>Proximo</div>
						) : (
							<div>Proximo</div>
						)}
					</div>
				</div>
				<div className="page-viewer">
					<div className="container">
						{paginas[this.state.pagIndex] &&
						!paginas[this.state.pagIndex + 1] &&
						capitulos[this.state.capIndex + 1] ? (
							<div onClick={() => this.nextCap()}>
								<img
									id="page-data"
									src={
										"data:image/png+jpeg;base64," +
										new Buffer(paginas[this.state.pagIndex].buffer).toString(
											"base64"
										)
									}
									onClick={() => this.nextPage()}
									onAuxClick={() => this.previousPage()}
								/>
							</div>
						) : paginas[this.state.pagIndex] ? (
							<img
								id="page-data"
								src={
									"data:image/png+jpeg;base64," +
									new Buffer(paginas[this.state.pagIndex].buffer).toString(
										"base64"
									)
								}
								onClick={() => this.nextPage()}
								onAuxClick={() => this.previousPage()}
							/>
						) : (
							<div>
								<span>Carregando...</span>
							</div>
						)}
					</div>
				</div>
				<div className="controler-pagina">
					<div className="container">
						<div onClick={() => this.previousPage()}>anterior</div>
						{paginas[this.state.pagIndex] ? (
							<div>Página {this.state.pagIndex + 1}</div>
						) : (
							<div>
								<span>Carregando...</span>
							</div>
						)}
						<div onClick={() => this.nextPage()}>proximo</div>
					</div>
				</div>
			</d-manga>
		);
	}
}
