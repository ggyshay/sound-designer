import * as React from 'react';
import "./bezier.css"

export interface BezierProps {
    P1: { x: number, y: number; };
    P2: { x: number, y: number }
    selected: boolean;
    onClick: (e) => void;
    onDoubleClick: (e) => void;
}

export class Bezier extends React.Component<BezierProps> {

    render() {
        const instructions = this.createInstructions();
        const classname = "curve" + (this.props.selected ? ' selected' : '')
        return instructions ? (
            <path
                onDoubleClick={this.props.onDoubleClick}
                onClick={this.props.onClick}
                d={instructions}
                className={classname}
            />
        ) : null;
    }

    createInstructions = () => {
        const { P1, P2 } = this.orderPoints()
        if (P1 && P2) {
            return `
            M ${P1.x}, ${P1.y}
            C ${P1.x + 50},${P1.y} ${P2.x - 50},${P2.y} ${P2.x},${P2.y}
            `
        }
    }

    orderPoints = () => {
        const { P1, P2 } = this.props;
        if (typeof P1.x === 'number' &&
            typeof P1.y === 'number' &&
            typeof P2.x === 'number' &&
            typeof P2.y === 'number') {
            return P1.x < P2.x ? { P1, P2 } : { P1: P2, P2: P1 }
        }
        return { P1: null, P2: null };
    }
}