import React, { Component } from 'react'

import { createID } from '../../../helpers/util.helpers';

export default class list extends Component {
    constructor(props) {
        super(props);

        console.log(this.props);

        this.ListAdd = this.ListAdd.bind(this);
        this.ListAddSave = this.ListAddSave.bind(this);
    }

    ListAdd(e) {
        e.persist();

        if ($("#warpper-list-add>.list-add").hasClass("is-idle")) {
            $("#warpper-list-add>.list-add").removeClass("is-idle");
            $("#warpper-list-add>.list-add").find("textarea").focus();
            $("#warpper-list-add>.list-add").find("textarea").trigger("click");
        }
    }

    ListAddSave(e) {
        e.persist();

        const {
            quadros,
            actions: { queueAddBoardList },
            match: {
                params: { boardid }
            }
        } = this.props;

        let l = {
            name: $(this.jsListAdd).find("textarea").val(),
            id: createID(10),
            cards: []
        };

        if (l.name == "") return;

        queueAddBoardList(boardid, l);

        if (!$("#warpper-list-add>.list-add").hasClass("is-idle")) {
            $("#warpper-list-add>.list-add").addClass("is-idle");
        }
    }

    render() {
        const {
            quadros,
            match: {
                params: { boardid }
            }
        } = this.props;

        return (
            <div>
                {quadros.find((r) => r.id == boardid).lists.map((list, index) => {
                    return (
                        <div className="warpper-list" key={list.id}>
                            <div
                                style={{ height: '100%', display: 'flex', position: 'absolute', borderRight: '1px solid #ffc430', borderBottom: '1px solid #ffc430' }}
                            >
                                <div className="list-container">
                                    <div className="list-header is-idle">
                                        <div className="list-header-target editing-target"></div>
                                        <span className="list-header-name editing-target">{list.name}</span>
                                        <textarea
                                            className="list-header-name-input js-list-name-input"
                                            spellCheck="false"
                                            dir="auto"
                                            maxLength="512"
                                            style={{ overflow: 'hidden', wordWrap: 'break-word', height: '25px' }}
                                        >{list.name}</textarea>
                                    </div>
                                    <div className="list-content"></div>
                                    <div className="card-options animation-default">
                                        <div
                                            className="card-options-checklist is-idle animation-default"
                                            style={{ width: '0px', opacity: '0' }}
                                        >
                                            <span>Checklist</span>
                                            <div className="card-options-checklist-input-container">
                                                <textarea
                                                    className="js-card-options-checklist-name-input"
                                                    spellCheck="false"
                                                    dir="auto"
                                                    maxLength="512"
                                                    style={{ overflow: 'hidden', wordWrap: 'break-word', height: '25px' }}
                                                ></textarea>
                                                <div>
                                                    <span>Salvar</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="list-add-card is-idle">
                                        <span className="list-add-card-text">Adicionar outro cartão</span>
                                        <div className="list-add-card-input-container">
                                            <textarea
                                                className="js-list-add-card-name-input"
                                                spellCheck="false"
                                                dir="auto"
                                                maxLength="512"
                                                style={{ overflow: 'hidden', wordWrap: 'break-word', height: '25px' }}
                                            ></textarea>
                                            <div>
                                                <span>Salvar</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
                <div className="warpper-list" id="warpper-list-add">
                    <div className="list-add is-idle">
                        <span
                            onClick={this.ListAdd}
                        >Adicionar outra lista</span>
                        <div
                            className="list-add-input-container"
                            ref={(r) => (this.jsListAdd = r)}
                        >
                            <textarea
                                spellCheck="false"
                                dir="auto"
                                maxLength="512"
                                style={{ overflow: 'hidden', wordWrap: 'break-word', height: '25px' }}
                            ></textarea>
                            <div
                                onClick={this.ListAddSave}
                            >
                                <span>Salvar</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
