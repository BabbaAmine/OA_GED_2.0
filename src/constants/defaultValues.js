import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import React from "react";
import {withStyles} from "@mui/material/styles";
import StepConnector from "@mui/material/StepConnector";

export const paginationOptions = { rowsPerPageText: 'lignes par page', rangeSeparatorText: 'de', selectAllRowsItem: true, selectAllRowsItemText: 'Total' }
export const tableContextMessage = {singular:"Ligne",plural:"Lignes",message:"sélectionnés"}
export const customTableStyle = {
    header: {
        style: {
            backgroundColor: "#f0f0f0",
        },
    },
}



//export const primaryColor="#A00015"
export const primaryColor="#1565C0"
export const textTitleColor="#951d22"
export const grayColor="#F4F6F8"

