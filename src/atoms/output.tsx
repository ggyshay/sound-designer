// import * as React from 'react';
// import speakerIcon from '../assets/icons/speaker-icon.svg';
// import './output.css'
// import { Connector } from './connector';
// import { ConnectorMeta } from './card';

// export interface OutputComponentProps {
//     id: string;
//     onConnectorDetected: (meta: ConnectorMeta) => void;
//     onConnectorDrag: (meta: ConnectorMeta) => void;
//     onConnectorLost: (meta: ConnectorMeta) => void;
//     handleCardDrag: (e: any, id: string) => void;
//     connector: ConnectorMeta;
//     Position: { x: number, y: number }
//     type: string;
// }

// export class OutputComponent extends React.Component<OutputComponentProps> {
//     private ref: any;
//     constructor(props) {
//         super(props);
//         this.ref = React.createRef();
//     }
//     render() {
//         const rect = this.ref && this.ref.current && this.ref.current.getBoundingClientRect();
//         const x = rect && rect.left;
//         const y = rect && rect.top;

//         return (
//             <React.Fragment>
//                 {
//                     this.props.connector &&
//                     (
//                         <div className="output-node" ref={this.ref}
//                         style={{ left: this.props.Position.x, top: this.props.Position.y }}  onMouseDown={e => this.props.handleCardDrag(e, this.props.id)}>
//                             <Connector
//                                 Position={{ x: this.props.connector.Position.x, y: this.props.connector.Position.y }}
//                                 isOutp={false}
//                                 onConnectorLost={this.props.onConnectorLost}
//                                 onConnectorDetected={this.props.onConnectorDetected}
//                                 onConnectorDrag={this.props.onConnectorDrag}
//                                 parentX={x}
//                                 parentY={y}
//                                 parentId={this.props.id}
//                                 id={this.props.connector.id}
//                                 connections={[]}
//                                 type={this.props.connector.type}
//                             />
//                             <img src={speakerIcon} />
//                         </div>)
//                 }
//             </React.Fragment>
//         );
//     }

//     handleConnectorDetected = e => {
//         this.props.onConnectorDetected(this.metadata())
//     }

//     handleConnectorLost = e => {
//         this.props.onConnectorLost(this.metadata())
//     }

//     metadata = ():ConnectorMeta => {
//         const rect = this.ref && this.ref.current && this.ref.current.getBoundingClientRect();
//         const x = rect && rect.left;
//         const y = rect && rect.top;
//         return (
//             {
//                 Position: { x, y },
//                 id: 'outputConnector',
//                 isOutp: false,
//                 connections: [],
//                 parentId: this.props.id,
//                 parentX: x,
//                 parentY: y,
//                 type: this.props.type,
//             }
//         )
//     }
// }