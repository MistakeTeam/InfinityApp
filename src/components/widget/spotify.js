import React, { Component } from 'react'

export default class spotify extends Component {
    render() {
        return (
            <div style={{
                display: 'none',
                background: 'linear-gradient(90deg, #ffc430 80%, transparent 96%)'
            }} id="statusbar-presence">
                <div style={{ display: 'none' }} id="asset-large-image">
                    <div id="asset-image-title">
                        <a></a>
                    </div>
                    <div style={{
                        display: 'grid',
                        position: 'relative'
                    }}>
                        <div style={{
                            disply: 'none',
                            background: 'linear-gradient(to right, rgba(17,17,17,0.2) 0%,rgba(17,17,17,0.2) 0%,rgba(17,17,17,0) 1%,rgba(17,17,17,0) 100%)'
                        }} id="presence-player">
                            <div id="presence-timestamp">
                                <span></span>
                            </div>
                        </div>
                        <img src='' style={{ borderRadius: '0 0 0 5px' }}></img>
                    </div>
                </div>
                <div style={{ display: 'none' }} id="more-presence">
                    <span className="fa fa-arrow-up"></span>
                </div>
                <div id="presence-state">
                    <a></a>
                </div>
                <div id="presence-detail"></div>
            </div>
        )
    }
}
