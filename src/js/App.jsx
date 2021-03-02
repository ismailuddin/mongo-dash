import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Header from "./components/Header";
import Pipelines from "./routes/Pipelines";
import Dashboards from "./routes/Dashboards";
import { Toaster } from "react-hot-toast";

export default function App() {
    return (    
        <Router basename="/app">
            <Toaster />
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
                        <Route path="/">
                            <Redirect to="/dashboards" />
                        </Route>
                    </Switch>
                </div>
            </div>
        </Router>
    );
}
