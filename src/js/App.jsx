import React, { Component } from "react";
import Pipeline from "./components/Pipeline";
import axios from "axios";

export default class App extends Component {
    state = {
        pipeline: "",
        collection: "",
    };

    componentDidMount() {}

    onChange = (value, event) => {
        this.setState({ pipeline: value });
    };

    getData = () => {
        const { pipeline, collection } = this.state;
        axios.post("/api/aggregate", {
            collection,
            stages: pipeline
        }).then(({ data }) => {
            console.log(data);
        }).catch(err => {
            console.error(err);s
        })
    }

    render() {
        const { pipeline } = this.state;
        return (
            <div className="h-full w-full">
                <div
                    id="header"
                    className="py-3 px-4 flex justify-between flex-wrap bg-white dark:bg-blueGray-900 z-10 shadow"
                >
                    <h3 className="text-lg font-bold text-blue-900">MongoDB</h3>
                </div>
                <div className="p-6">
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
                    </div>
                </div>
            </div>
        );
    }
}
