import React, { Component } from 'react';
import { NavLink } from "react-router-dom";

import { PropsRoute } from "../../../Routes";

import List from "../../../containers/modules/board/list.conteiner";

import { createID } from '../../../helpers/util.helpers';

export default class Board extends Component {
	constructor(props) {
		super(props);

		this.DockClick = false;

		this.InfinityDockResizeHandleEnter = this.InfinityDockResizeHandleEnter.bind(this);
		this.InfinityDockResizeHandleLeave = this.InfinityDockResizeHandleLeave.bind(this);
		this.InfinityDockResizeHandleDown = this.InfinityDockResizeHandleDown.bind(this);
		this.InfinityDockResizeHandleUp = this.InfinityDockResizeHandleUp.bind(this);
		this.InfinityDockResizeHandleMove = this.InfinityDockResizeHandleMove.bind(this);

		this.QuadrosAdd = this.QuadrosAdd.bind(this);
		this.QuadrosAddSave = this.QuadrosAddSave.bind(this);

		this.state = {
			BOARD_WARPPER_LIST_STYLE_WIDTH: 157.5,
		};
	}

	InfinityDockResizeHandleEnter(e) {
		e.persist();

		$(this.resizeHandle).addClass('visible');
	}

	InfinityDockResizeHandleLeave(e) {
		e.persist();

		$(this.resizeHandle).removeClass('visible');
	}

	InfinityDockResizeHandleDown(e) {
		e.persist();

		this.DockClick = true;
		$(this.resizeHandle).addClass('visible');
		$(this.resizeOverlay).addClass('visible');
		$(this.resizeBase).addClass('visible');
	}

	InfinityDockResizeHandleUp(e) {
		e.persist();

		this.DockClick = false;
		$(this.resizeHandle).removeClass('visible');
		$(this.resizeOverlay).removeClass('visible');
		$(this.resizeBase).removeClass('visible');
	}

	InfinityDockResizeHandleMove(e) {
		e.persist();

		if (!this.DockClick) return;

		let b = (e.clientX / $('#quadros-module-container').width()) * 100;

		if (b >= 99) return;
		if (b <= 4) return $('#quadros-warpper-list').addClass('hide');
		if (b >= 15) $('#quadros-warpper-list').removeClass('hide');

		$('#quadros-warpper-list').css("width", b + "%");
	}

	QuadrosAdd(e) {
		e.persist();

		if ($(this.jsQuadrosAdd).hasClass("is-idle")) {
			$(this.jsQuadrosAdd).removeClass("is-idle");
			$(this.jsQuadrosAdd).find("textarea").focus();
			$(this.jsQuadrosAdd).find("textarea").trigger("click");
		}
	}

	QuadrosAddSave(e) {
		e.persist();

		const {
			actions: { queueAddBoard }
		} = this.props;

		let q = {
			name: $(this.jsQuadrosAdd).find("textarea").val(),
			id: createID(10),
			lists: []
		};

		if (q.name == "") return;

		queueAddBoard(q);

		if (!$(this.jsQuadrosAdd).hasClass("is-idle")) {
			$(this.jsQuadrosAdd).addClass("is-idle");
		}
	}

	render() {
		const { quadros } = this.props;

		return (
			<div className='board-over' style={{ height: '100%' }}>
				<div id='quadros-module-container'>
					<div id='quadros-warpper-list' style={{ width: '15%' }}>
						<div id='quadros-warpper-container'>
							{quadros.map((quadro, index) => {
								return (
									<div
										className="quadros-list-container is-idle"
										key={quadro.id}
									>
										<NavLink to={"/board/" + quadro.id}>
											<span className="quadro-name">
												{quadro.name}
											</span>
										</NavLink>
										<textarea
											spellCheck="false"
											dir="auto"
											maxLength="512"
											style={{ overflow: 'hidden', wordWrap: 'break-word', height: '25px' }}
										>
											{quadro.name}
										</textarea>
									</div>
								)
							})}
							<div className='quadros-add is-idle'
								ref={(r) => (this.jsQuadrosAdd = r)}
							>
								<span
									onClick={this.QuadrosAdd}
								>
									Criar um quadro
								</span>
								<div className='quadros-input-container'>
									<textarea
										spellCheck='false'
										dir='auto'
										maxLength='512'
										style={{ overflow: 'hidden', wordWrap: 'break-word', height: '25px' }}
									/>
									<div
										onClick={this.QuadrosAddSave}
									>
										<span>Salvar</span>
									</div>
								</div>
							</div>
						</div>
						<div
							className='infinity-dock-resize-handle'
							ref={(r) => (this.resizeHandle = r)}
							onMouseDown={this.InfinityDockResizeHandleDown}
							onMouseUp={this.InfinityDockResizeHandleUp}
							onMouseEnter={this.InfinityDockResizeHandleEnter}
							onMouseLeave={this.InfinityDockResizeHandleLeave}
						/>
						<div
							className='infinity-dock-resize-overlay'
							ref={(r) => (this.resizeOverlay = r)}
						/>
					</div>
					<div id='scrollbar-ui-moving' className='no-quadro'>
						<PropsRoute path="/board/:boardid" component={List} />
					</div>
					<div
						className='infinity-dock-resize-base'
						ref={(r) => (this.resizeBase = r)}
						onMouseMove={this.InfinityDockResizeHandleMove}
						onMouseUp={this.InfinityDockResizeHandleUp}
						onMouseLeave={this.InfinityDockResizeHandleUp}
					></div>
				</div>
			</div>
		);
	}
}
