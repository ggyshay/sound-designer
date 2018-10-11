import * as React from 'react'
import './component-menu.css'
import sineIC from '../assets/icons/sine-icon.svg';
import envIC from '../assets/icons/env-icon.svg';
import fltIC from '../assets/icons/flt-icon.svg';
import plusIC from '../assets/icons/plus-icon.svg';
import { EngineTypeStrings } from 'src/atoms';

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
                    <img src={plusIC} className="plusIC" />
                </div>
                <div className={"menu-container " + (this.state.active ? "menu-container-expanded" : "")} onMouseLeave={this.handleCloseMenu}>
                    <div className="menu-button" draggable onDragStart={e => this.props.handleDrag(e, EngineTypeStrings.oscillator)}>
                        <img src={sineIC} className="nodeIC unselectable" />
                    </div>
                    <div className="menu-button" draggable onDragStart={e => this.props.handleDrag(e, EngineTypeStrings.envelope)}>
                        <img src={envIC} className="nodeIC unselectable" />
                    </div>
                    <div className="menu-button" draggable onDragStart={e => this.props.handleDrag(e, EngineTypeStrings.filter)}>
                        <img src={fltIC} className="nodeIC unselectable" />
                    </div>
                    <div className="menu-button" draggable onDragStart={e => this.props.handleDrag(e, EngineTypeStrings.input)}>
                        <img src={fltIC} className="nodeIC unselectable" />
                    </div>
                    <div className="menu-button" draggable onDragStart={e => this.props.handleDrag(e, EngineTypeStrings.fixedInput)}>
                        <img src={fltIC} className="nodeIC unselectable" />
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