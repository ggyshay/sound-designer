import * as React from 'react';
import './card.css';

export interface CardProps {
    x: number;
    y: number;
    handleDragStart: (e: any, id: string) => void;
    id: string;
}

export class Card extends React.Component<CardProps, any> {
    public render() {
        return (
            <div className="card-holder"
                style={{ left: this.props.x, top: this.props.y }}
                draggable
                onDragStart={e => this.props.handleDragStart(e, this.props.id)}
            >
                <div className="connector-left"></div>
                <div className="connector-right" onMouseDown={event => console.log(event.pageX, event.pageY)}></div>
                <div className="card">
                    <div className="card-header">
                        <p>Source</p>
                    </div>
                    <div className="card-display"></div>
                    <select className="source-selector">
                        <option> Sine </option>
                        <option> Square </option>
                        <option> Saw </option>
                        <option> Triangle </option>
                    </select>
                </div>
            </div>
        )
    }
}