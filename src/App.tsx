import * as React from 'react';
import './App.css';
import {SVGLinkBezier} from './components';

class App extends React.Component<any, any>{

  public render() {
    return (
      <div className="App">
      <SVGLinkBezier/>
      </div>
    );
  }
}

export default App;
