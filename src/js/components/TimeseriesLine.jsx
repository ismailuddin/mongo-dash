import React from "react";
import Plot from "react-plotly.js";

function TimeseriesLine({ data }) {
    return (
        <div className="w-full">
            <Plot
                config={{
                    displayModeBar: false,
                }}
                data={data}
                useResizeHandler={true}
                layout={{
                    autosize: true,
                }}
                style={{ width: "100%" }}
            />
        </div>
    );
}

export default React.memo(TimeseriesLine);
