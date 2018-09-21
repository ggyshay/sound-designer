import * as React from 'react';
import './card.css';

export interface CardComponentProps{
    handleCardDrag: (e: any) => void;
    type: string;
}

export class CardComponent extends React.Component<CardComponentProps> {
    render() {
        return (
            <div>
                <div className="card" onMouseDown={this.props.handleCardDrag}>
                    <div className="card-header">
                        <p>{this.props.type}</p>
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
        );
    }
}