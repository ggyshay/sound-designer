import * as React from 'react';

export interface BezierProps{
    P1: { x: number, y: number;};
    P2: {x: number, y: number}
} 

export class Bezier extends React.Component<BezierProps> {
    render() {
        const instructions = this.createInstructions();
        return instructions ? (
                <path
                    d={instructions}
                    fill="none"
                    stroke="green"
                    strokeWidth={5}
                />
        ) : null;
    }

    createInstructions = () => {
        console.log('create instructions')
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
        console.log('orderPoint for bezier ', P1, P2)
        if (P1.x && P1.y && P2.x && P2.y) {
            return P1.x < P2.x ? { P1, P2 } : { P1: P2, P2: P1 }
        }
        return { P1: null, P2: null };
    }
}