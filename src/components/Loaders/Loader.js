import React, { Component } from 'react';

class PreLoaderWidget extends Component {

    render() {
        return (
            <div className="preloader">
                <div className="status">
                    <div className="spinner-border avatar-sm m-2" style={{color:"#1565C0"}} role="status"/>
                </div>
            </div>
        )
    }
}

export default PreLoaderWidget;