import * as React from 'react';
import './App.css';
import { SVGLinkBezier } from './components';
import { Provider } from 'unstated';
import { CardNodeProvider } from './providers/card-node.provider';
import { ConnectionProvider } from './providers/connection.provider';

class App extends React.Component<any, any>{
  private cardNodeProvider: CardNodeProvider;
  private ConnectionProvider: ConnectionProvider;

  constructor(props) {
    super(props);
    this.cardNodeProvider = new CardNodeProvider();
    this.ConnectionProvider = new ConnectionProvider();
  }

  public render() {
    return (
      <div className="App">
        <Provider inject={[this.cardNodeProvider, this.ConnectionProvider]}>
          <SVGLinkBezier />
        </Provider>
      </div>
    );
  }
}

export default App;
