import React from "react";
import Plot from "react-plotly.js";
import { useResizeDetector } from "react-resize-detector";

function TimeseriesLine({ data }) {
    const { width, height, ref } = useResizeDetector();
    console.log(height);
    return (
        <div ref={ref} className="flex-grow">
            <Plot
                config={{
                    displayModeBar: false,
                }}
                data={data}
                layout={{
                    autosize: true,
                    width: width,
                    margin: {
                        t: 0,
                        l: 0,
                        r: 0,
                        b: 0
                    },
                    xaxis: {
                        automargin: true
                    },
                    yaxis: {
                        automargin: true
                    },
                    height: 0.95 * height,
                }}
            />
        </div>
    );
}

export default React.memo(TimeseriesLine);
