import * as React from 'react';
import './App.css';
import { SVGLinkBezier } from './components';
import { Provider } from 'unstated';
import { CardNodeProvider } from './providers/card-node.provider';
import { ConnectionProvider } from './providers/connection.provider';
import { SelectionProvider } from './providers/selection.provider';

class App extends React.Component<any, any>{
  private cardNodeProvider: CardNodeProvider;
  private ConnectionProvider: ConnectionProvider;
  private SelectionProvider: SelectionProvider;

  constructor(props) {
    super(props);
    this.cardNodeProvider = new CardNodeProvider();
    this.ConnectionProvider = new ConnectionProvider();
    this.SelectionProvider = new SelectionProvider();
  }

  public render() {
    return (
      <div className="App">
        <Provider inject={[this.cardNodeProvider, this.ConnectionProvider, this.SelectionProvider]}>
          <SVGLinkBezier />
        </Provider>
      </div>
    );
  }
}

export default App;
