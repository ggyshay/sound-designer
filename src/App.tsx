import * as React from "react";
import "./App.css";
import { SVGLinkBezier } from "./components";
import { Provider } from "unstated";
import { CardNodeProvider } from "./providers/card-node.provider";
import { ConnectionProvider } from "./providers/connection.provider";
import { SelectionProvider } from "./providers/selection.provider";
import { SplashScreen } from "./splash";

class App extends React.Component<any, any> {
  private cardNodeProvider: CardNodeProvider;
  private ConnectionProvider: ConnectionProvider;
  private SelectionProvider: SelectionProvider;

  constructor(props) {
    super(props);
    this.cardNodeProvider = new CardNodeProvider();
    this.ConnectionProvider = new ConnectionProvider();
    this.SelectionProvider = new SelectionProvider();
    this.state = { validated: false };
  }

  public render() {
    if (this.state.validated) {
      return (
        <div className="App">
          <Provider
            inject={[
              this.cardNodeProvider,
              this.ConnectionProvider,
              this.SelectionProvider,
            ]}
          >
            <SVGLinkBezier />
          </Provider>
        </div>
      );
    }
    return <SplashScreen onEnter={() => this.setState({ validated: true })} />;
  }
}

export default App;
