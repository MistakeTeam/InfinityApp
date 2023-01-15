import React, { Component } from 'react';

import Navbar from './navbar';
import AppBase from './modules';

import Spotify from './widget/spotify';

import Auth from '../modules/Auth';
import { isElectron } from '../helpers/electron.help';

export default class App extends Component {
	componentDidMount() {
		console.log(navigator);
	}

	render() {
		return (
			<div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
				<div style={{ position: 'relative', height: '100%' }}>
					<div className={`app ${isElectron() ? 'in-electron' : ''} animation-default`}>
						<Navbar />
						{Auth.isUserAuthenticated() ? <AppBase /> : null}
						<Spotify></Spotify>
					</div>
				</div>
			</div>
		);
	}
}
