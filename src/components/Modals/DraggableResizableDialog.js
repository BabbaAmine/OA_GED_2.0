import React from "react";
import Draggable from "react-draggable";
import {withStyles} from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {ResizableBox} from "react-resizable";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';

const styles = theme => ({
    resizable: {
        position: "relative",
        "& .react-resizable-handle": {
            position: "absolute",
            width: 20,
            height: 20,
            bottom: 0,
            right: 0,
            background:
                "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2IDYiIHN0eWxlPSJiYWNrZ3JvdW5kLWNvbG9yOiNmZmZmZmYwMCIgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSI2cHgiIGhlaWdodD0iNnB4Ij48ZyBvcGFjaXR5PSIwLjMwMiI+PHBhdGggZD0iTSA2IDYgTCAwIDYgTCAwIDQuMiBMIDQgNC4yIEwgNC4yIDQuMiBMIDQuMiAwIEwgNiAwIEwgNiA2IEwgNiA2IFoiIGZpbGw9IiMwMDAwMDAiLz48L2c+PC9zdmc+')",
            "background-position": "bottom right",
            padding: "0 3px 3px 0",
            "background-repeat": "no-repeat",
            "background-origin": "content-box",
            "box-sizing": "border-box",
            cursor: "se-resize"
        }
    }
});

function PaperComponent(props) {
    return (
        <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper {...props} />
        </Draggable>
    );
}

class DraggableResizableDialog extends React.Component {

    render() {
        return (

            <Dialog
                open={this.props.open}
                onClose={() => this.props.onClose}
                maxWidth={false}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
            >
                <ResizableBox
                    height={this.props.height}
                    width={this.props.width}
                    className={this.props.classes.resizable}
                >
                    <DialogTitle style={{cursor: 'move'}} id="draggable-dialog-title">
                        {this.props.title}
                        <IconButton
                            aria-label="close"
                            style={{
                                position: 'absolute',
                                right: 5,
                                top: 5,
                                color: '#c0c0c0'
                            }}
                            onClick={this.props.onClose}
                        >
                            <CloseIcon/>
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        {this.props.content}
                    </DialogContent>
                </ResizableBox>
            </Dialog>

        );
    }
}

export default withStyles(styles)(DraggableResizableDialog);