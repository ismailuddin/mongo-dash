import React, { Component } from "react";
import Pipeline from "./components/PipelineStages";
import TimeseriesLine from "./components/TimeseriesLine";
import axios from "axios";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./components/Header";
import Pipelines from './routes/Pipelines';


export default function App() {
    return (
        <Router basename="/dashboard">
            <div className="w-full h-full">
                <Header />
                <div className="w-full h-full">
                    <Switch>
                        <Route path="/home"></Route>
                        <Route path="/pipelines">
                            <Pipelines />
                        </Route>
                    </Switch>
                </div>
            </div>
        </Router>
    );
}

class Other extends Component {
    state = {
        pipeline: "",
        collection: "",
        data: [
            {
                id: 0,
                data: [],
            },
        ],
    };

    componentDidMount() {}

    onChange = (value, event) => {
        this.setState({ pipeline: value });
    };

    getData = () => {
        const { pipeline, collection } = this.state;
        axios
            .post("/api/aggregate", {
                collection,
                stages: pipeline,
            })
            .then(({ data: values }) => {
                const x = values.map((d) => new Date(d.timestamp));
                const y = values.map((d) => d.value);
                this.setState({
                    data: [
                        {
                            x,
                            y,
                            type: "scatter",
                            mode: "lines",
                        },
                    ],
                });
            })
            .catch((err) => {
                console.error(err);
            });
    };

    render() {
        const { pipeline, data } = this.state;
        return (
            <div className="h-full w-full">
                <div
                    id="header"
                    className="py-3 px-4 flex justify-between flex-wrap bg-white dark:bg-blueGray-900 z-10 shadow"
                >
                    <h3 className="text-lg font-bold text-blue-900">MongoDB</h3>
                </div>
                <div className="p-6 w-full">
                    <div className="rounded-sm shadow bg-white p-4">
                        <h3 className="text-lg font-semibold">Pipeline</h3>
                        <Pipeline value={pipeline} onChange={this.onChange} />
                        <div className="grid grid-cols-6 gap-6 py-4">
                            <div className="col-span-6 sm:col-span-3">
                                <label
                                    for="first_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Collection
                                </label>
                                <input
                                    type="text"
                                    onChange={(e) =>
                                        this.setState({
                                            collection: e.target.value,
                                        })
                                    }
                                    name="first_name"
                                    id="first_name"
                                    autocomplete="given-name"
                                    className="mt-1 px-2 py-2 focus:ring focus:ring-indigo-500 focus:outline-none block w-full shadow sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>
                        </div>
                        <button
                            className="mt-16 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                            onClick={this.getData}
                        >
                            Get data
                        </button>
                        <TimeseriesLine data={data} />
                    </div>
                </div>
            </div>
        );
    }
}