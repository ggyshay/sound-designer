import * as React from 'react';
import './App.css';
import { Card } from './atoms/card';
import { ComponentMenu } from './components/component-menu';

class App extends React.Component<any, any>{
  constructor(props) {
    super(props);

    this.state = {
      dragging: null,
      nodes: [],
    };
  }
  public render() {
    return (
      <div className="App" onDragOver={(e) => this.handleDragOver(e)} onDrop={e => this.handleDrop(e)}>
        {this.state.nodes.map(n => <Card x={n.x} y={n.y} handleDragStart={this.handleCardDrag} key={n.id} id={n.id} />)}
        <ComponentMenu handleDrag={this.handleDragStart} />
      </div>
    );
  }

  handleCardDrag = (e, id) => {
    e.dataTransfer.setData("id", id);
    e.dataTransfer.setData("movement-type", "move")
    e.dataTransfer.setData("drag-point", JSON.stringify({ x: e.clientX, y: e.clientY }));
  }

  handleCardDrop = e => {
    const id = e.dataTransfer.getData("id");
    const nodes = this.state.nodes.splice(0);
    const result = nodes.find(n => n.id === id);
    const startPoint = JSON.parse(e.dataTransfer.getData("drag-point"));

    result.x = result.x + e.pageX - startPoint.x;
    result.y = result.y + e.pageY - startPoint.y;
    this.setState({ nodes });
  }

  handleDragStart = (e, type) => {
    e.dataTransfer.setData("type", type)
  }

  handleDrop = e => {
    const movement_type = e.dataTransfer.getData("movement-type");
    if (movement_type === "move") {
      this.handleCardDrop(e);
    } else {
      const type = e.dataTransfer.getData('type');
      switch (type) {
        default:
          this.createSRCNode(e.pageX, e.pageY, e.type);
          break;
      }
    }
  }

  handleDragOver = e => {
    e.preventDefault();
  }

  createSRCNode = (x, y, type) => {
    const nodes = this.state.nodes.splice(0);
    const id = type + nodes.length;
    nodes.push({ x, y, id });
    this.setState({ nodes })
  }
}

export default App;
