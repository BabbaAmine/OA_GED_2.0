import React from "react";
import {Viewer, ProgressBar, Worker} from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import utilFunctions from "../../tools/functions";


export default function ModernPdfViewr(props){



    const defaultLayoutPluginInstance = defaultLayoutPlugin();


    return(
        <div>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.13.216/build/pdf.worker.min.js">
            <Viewer fileUrl={props.base64}
                    renderLoader={(percentages) => (
                        <div style={{ width: '240px' }}>
                            <ProgressBar progress={Math.round(percentages)} />
                        </div>
                    )}
                    plugins={[
                        defaultLayoutPluginInstance
                    ]}
            />
            </Worker>
        </div>
    )




}
