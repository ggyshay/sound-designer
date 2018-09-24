import * as React from 'react'
import './component-menu.css'
import sineIC from '../assets/icons/sine-icon.svg';
import envIC from '../assets/icons/env-icon.svg';
import fltIC from '../assets/icons/flt-icon.svg';
import plusIC from '../assets/icons/plus-icon.svg';

export class ComponentMenu extends React.Component<any, any>{
    constructor(props) {
        super(props);
        this.state = {
            active: false
        }
    }
    render() {
        return (
            <div className="menu">
                <div className="menu-button" onMouseEnter={this.handleOpenMenu}>
                    <img src={plusIC} className="plusIC"/>
                </div>
                <div className={"menu-container " + (this.state.active ? "menu-container-expanded" : "")} onMouseLeave={this.handleCloseMenu}>
                    <div className="menu-button" draggable onDragStart={e => this.props.handleDrag(e, 'Oscillator')}>
                        <img src={sineIC} className="nodeIC"/>
                    </div>
                    <div className="menu-button" draggable onDragStart={e => this.props.handleDrag(e, 'Envelope')}>
                        <img src={envIC} className="nodeIC"/>
                    </div>
                    <div className="menu-button" draggable onDragStart={e => this.props.handleDrag(e, 'Filter')}>
                        <img src={fltIC} className="nodeIC"/>
                    </div>
                </div>
            </div>
        );
    }

    handleOpenMenu = () => {
        this.setState({ active: true });
        setTimeout(this.handleCloseMenu, 5000);
    }

    handleCloseMenu = () => {
        this.setState({ active: false });
    }
}