import * as React from 'react';

export interface CardHeaderProps {
    label: string;
    onMinimizeToggle: () => void;
    onCardClick: (e: any) => void;
    isMinimized: boolean;
}

export class CardHeader extends React.Component<CardHeaderProps> {
    render() {
        return (
            <div className="card-header unselectable" onClick={this.props.onCardClick} id="card-header">
                <p id="card-header-p">{this.props.label}</p>
                <div onClick={this.props.onMinimizeToggle} style={{fontSize: '2rem'}}>{this.props.isMinimized ? '+' : '-'}</div>
            </div>
        );
    }
}