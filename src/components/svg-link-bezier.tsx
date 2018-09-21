import * as React from 'react';
import { Canvas } from './'
import { ConnectorMeta } from '../atoms';

export interface BezierState {
    Smetadata: ConnectorMeta | null;
    Mouse: {
        x: number;
        y: number;
    },
    Emetadata: ConnectorMeta | null;
    isValid: boolean;
}

export class SVGLinkBezier extends React.Component<any, BezierState> {
    constructor(props) {
        super(props);
        this.state = {
            Smetadata: null,
            Emetadata: null,
            Mouse: {
                x: null,
                y: null,
            },
            isValid: false,
        }
    }
    render() {
        const Inp = this.state.Smetadata && this.state.Smetadata.isOutp ? this.state.Emetadata : this.state.Smetadata;
        const Outp = this.state.Smetadata && this.state.Smetadata.isOutp ? this.state.Smetadata : this.state.Emetadata;

        // TODO: order mouse and S so that the bezier normal always points in the right direction
        let instructions = '';
        if (this.state.Smetadata) {
            instructions = `
            M ${this.state.Smetadata.Position.x}, ${this.state.Smetadata.Position.y}
            C ${this.state.Smetadata.Position.x + 50},${this.state.Smetadata.Position.y} ${this.state.Mouse.x - 50},${this.state.Mouse.y} ${this.state.Mouse.x},${this.state.Mouse.y}
            `
        }
        return (
            <div onMouseUp={this.onMouseUp}>
                <svg style={{ position: 'absolute' }} width="100%" height="100%">
                    {this.pointsAreValid() &&
                        <path
                            d={instructions}
                            fill="none"
                            stroke="#00DACD"
                            strokeWidth={5}
                        />
                    }
                </svg>
                <div style={{ position: 'absolute', top: '0', left: '0' }}>
                    <Canvas
                        onConnectorDrag={this.onDragStart}
                        onConnectorDetected={this.onConnectorDetected}
                        onConnectorLost={this.onConnectorLost}
                        currentConnection={{ Inp, Outp }}
                        connectionCallback={this.cleanConnection}
                    />
                </div>
            </div>
        );
    }

    pointsAreValid = () => {
        return this.state.Smetadata && this.state.Smetadata.Position.x &&
            this.state.Smetadata.Position.y && this.state.Mouse.x && this.state.Mouse.y;
    }

    onDragStart = (Smetadata) => {
        document.addEventListener('mousemove', this.onMouseMove);
        this.setState({ Smetadata });
    }

    onMouseMove = e => {
        this.setState({ Mouse: { x: e.pageX, y: e.pageY } })
    }

    onMouseUp = e => {
        document.removeEventListener('mousemove', this.onMouseMove);
        if (!this.state.isValid) {
            this.setState({ Mouse: { x: null, y: null }, Smetadata: null });
        }
    }

    onConnectorDetected = (metadata) => {
        if (this.state.Smetadata && this.state.Smetadata.isOutp !== undefined &&
            this.state.Smetadata.isOutp !== metadata.isOutp) {
            this.setState({ isValid: true, Emetadata: metadata })
        }
    }

    onConnectorLost = e => {
        // depois de deixar a conexão e sair do no isso roda e tira o Emeta do state
        this.setState({ isValid: false, Emetadata: null })
    }

    cleanConnection = () => {
        this.setState({ isValid: false, Emetadata: null, Smetadata: null, Mouse: { x: null, y: null } });
    }
}