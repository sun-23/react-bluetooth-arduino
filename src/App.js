import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import CodeUI from "./screen/CodeUI";
import JSEditor from "./screen/JSEditor";

import "./App.css";

export default function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul className='nav'>
            <Link className='link' to="/">code-ui</Link>
            <Link className='link' to="/js-editor">Javascript</Link>
            <Link className='link' to="/blockly">blockly</Link>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route exact path="/">
            <CodeUI />
          </Route>
          <Route path="/js-editor">
            <JSEditor />
          </Route>
          <Route path="/blockly">
            <div>
                <p>blockly</p>
            </div>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}