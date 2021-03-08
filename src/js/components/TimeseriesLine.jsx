import React from "react";
import Plot from "react-plotly.js";
import { useResizeDetector } from 'react-resize-detector';

function TimeseriesLine({ data }) {
    const { width, height, ref } = useResizeDetector();
    return (
        <div ref={ref} style={{ display: 'flex', height: '100%'}}>
            <Plot
                config={{
                    displayModeBar: false,
                }}
                data={data}
                // useResizeHandler={true}
                layout={{
                    autosize: true,
                    width: width,
                    height: 0.95 * height,
                }}
                // style={{ width: "100%", height: "100%" }}
            />
        </div>
    );
}

export default React.memo(TimeseriesLine);
