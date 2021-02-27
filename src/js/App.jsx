import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./components/Header";
import Pipelines from "./routes/Pipelines";
import Dashboards from "./routes/Dashboards";

export default function App() {
    return (    
        <Router basename="/app">
            <div className="w-full h-screen flex flex-col">
                <Header />
                <div className="w-full flex-grow overflow-y-scroll">
                    <Switch>
                        <Route path="/dashboards">
                            <Dashboards />
                        </Route>
                        <Route path="/pipelines">
                            <Pipelines />
                        </Route>
                    </Switch>
                </div>
            </div>
        </Router>
    );
}
