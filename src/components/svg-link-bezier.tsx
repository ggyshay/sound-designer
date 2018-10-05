import * as React from 'react';
import { Subscribe } from 'unstated';
import { ConnectionProvider } from '../providers/connection.provider';
import { Canvas } from './';


export interface BezierState {
    Mouse: {
        x: number;
        y: number;
    };
    isDragging: boolean;
}

export class SVGLinkBezier extends React.Component<any, BezierState> {
    private connectionProvider: ConnectionProvider = null;
    constructor(props) {
        super(props);
        this.state = {
            isDragging: false,
            Mouse: {
                x: null,
                y: null,
            },
        }
    }
    render() {

        return (
            <Subscribe to={[ConnectionProvider]}>
                {(connectionProvider: ConnectionProvider) => {
                    this.connectionProvider = connectionProvider;
                    const { Smetadata } = this.connectionProvider.state;
                    let instructions = '';
                    if (Smetadata) {
                        instructions = `
                        M ${Smetadata.Position.x}, ${Smetadata.Position.y}
                        C ${Smetadata.Position.x + 50},${Smetadata.Position.y} ${this.state.Mouse.x - 50},${this.state.Mouse.y} ${this.state.Mouse.x},${this.state.Mouse.y}
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
                                    currentConnection={{
                                        Inp: this.connectionProvider.getInput(),
                                        Outp: this.connectionProvider.getOutput()
                                    }}
                                />
                            </div>
                        </div>
                    )
                }}
            </Subscribe>

        );
    }

    pointsAreValid = () => {
        return this.connectionProvider.state.Smetadata && this.connectionProvider.state.Smetadata.Position.x &&
            this.connectionProvider.state.Smetadata.Position.y && this.state.Mouse.x && this.state.Mouse.y;
    }

    onDragStart = (Smetadata) => {
        document.addEventListener('mousemove', this.onMouseMove);
        this.connectionProvider.setSPoint(Smetadata);
        this.setState({ isDragging: true });
    }

    onMouseMove = e => {
        this.setState({ Mouse: { x: e.pageX, y: e.pageY } })
    }

    onMouseUp = e => {
        document.removeEventListener('mousemove', this.onMouseMove);
        if (!this.connectionProvider.state.isValid) {
            this.connectionProvider.setSPoint(null);
            this.setState({ Mouse: { x: null, y: null } });
        }
        this.setState({ isDragging: false });
    }

    onConnectorDetected = (Emetadata) => {
        if (this.state.isDragging) {
            this.connectionProvider.setEPoint(Emetadata)
        }
    }

    onConnectorLost = e => {
        if(this.state.isDragging){
            this.connectionProvider.setEPoint(null);
        }
    }

    cleanConnection = () => {
        this.connectionProvider.setEPoint(null);
        this.connectionProvider.setSPoint(null);
        this.setState({ Mouse: { x: null, y: null } });
    }
}