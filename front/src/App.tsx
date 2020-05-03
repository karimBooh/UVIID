import React, {Component} from 'react';
import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import Home from "./Component/Home";
import Room from "./Component/Room";

class App extends Component {
  render() {
    return (
        <Router>
            <div >
                <Switch>
                    <Route path="/room/:id">
                        <Room />
                    </Route>
                    <Route path="/">
                        <Home />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
  }
}

export default App;
