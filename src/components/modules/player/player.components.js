import React, { Component } from "react";
import Auth from "../../../modules/Auth";
import Axios from "axios";

export default class player extends Component {
	constructor(props) {
		super(props);

		this._onTouchInsidePlayer = this._onTouchInsidePlayer.bind(this);

		console.log(this.props);
	}

	componentDidMount() {
		Axios({
			method: "get",
			url: "http://localhost:3000/api/anime/RS1MKKUSAAAmGNvNZ3sbAXiMwTfnkZgX/episodio/YFdiZORbNHQqWaVM5P4pNnZTpEiR6Vrh",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Authorization: `bearer ${Auth.getToken()}`
			}
		}).then((r) => {
			this.player.src = r.data;
		})

		// this.player.src = "http://localhost:3000/api/anime/RS1MKKUSAAAmGNvNZ3sbAXiMwTfnkZgX/episodio/YFdiZORbNHQqWaVM5P4pNnZTpEiR6Vrh";
		// this.player.src = "http://localhost:3000/api/anime/jfhagxm0BfEi6Z5dDOYzDuUr7y41c1KF/episodio/bC0D2CdJfYSkFL1Rl5XVKnQri6wkQAxG";
		// this.player.src = "http://localhost:3000/api/anime/d6XayfYMDhoBm3VuuSRqbMhtED5ZWdSQ/episodio/N5ZwrPKWj35T6BJGPVqQWzSsqukesoPv";

		this.player.addEventListener("contextmenu", e => {
			e.preventDefault();
			return false;
		});
	}

	_onTouchInsidePlayer() {
		if (this.player.paused) {
			this.player.play();
		} else {
			this.player.pause();
		}
	}

	render() {
		const style = {
			width: 854,
			height: 480,
			background: "#000"
		};

		return (
			<d-playerwrapper>
				<d-playerinner>
					<video
						controls={true}
						onClick={this._onTouchInsidePlayer}
						style={style}
						ref={player => (this.player = player)}
						autoPlay={true}
					/>
				</d-playerinner>
			</d-playerwrapper>
		);
	}
}
