import React, { useState } from "react";
import Plot from "react-plotly.js";

function TimeseriesLine({ data, width=null, height }) {
    return (
        <div className="h-full">
            <Plot
                config={{
                    displayModeBar: false,
                }}
                data={data}
                layout={{
                    autosize: true,
                    width: width,
                    uirevision: true,
                    margin: {
                        t: 0,
                        l: 0,
                        r: 0,
                        b: 0
                    },
                    xaxis: {
                        automargin: true,
                    },
                    yaxis: {
                        automargin: true
                    },
                    height: height,
                }}
            />
        </div>
    );
}

export default React.memo(TimeseriesLine);
