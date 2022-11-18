import React from 'react';
import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom";
import {ToastContainer} from 'react-toastify';
import projectFunctions from "./tools/project_functions";
import Login from "./pages/auth/Login";
import Main from "./pages/Main/Main";
import Project_functions from "./tools/project_functions";
import Team_List from "./pages/Team/Team_List";
import Team_Main from "./pages/Team/Team_Main";
import Clients_Main from "./pages/Clients/Clients_Main";
import Clients_List from "./pages/Clients/Clients_List";
import Clients_Details from "./pages/Clients/Clients_Details";
import TS_List from "./pages/TimeSheets/TS_List";


export default class App extends React.Component{

    state={}

    render() {
        return (
            <>

                <BrowserRouter>
                    <Routes>

                        <Route path="/"
                               element={<Navigate replace to={ projectFunctions.verifSession(localStorage.getItem("usrtoken"),
                                   parseInt(localStorage.getItem("exp"))) === true ? "/home/team/list" : "login"} />}
                        />

                        <Route path="login" element={<Login/>}/>
                        <Route path="home" element={<Main/>}>
                            {
                                Project_functions.verifSession(localStorage.getItem("usrtoken"),localStorage.getItem("exp")) === false &&
                                <Route path="home" element={<Navigate replace to={"login"}/>}/>
                            }
                            <Route path={"team"} element={<Team_Main/>}>
                                <Route path={"list"} element={<Team_List/>}/>
                            </Route>
                            <Route path={"clients"} element={<Clients_Main/>}>
                                <Route path={"list"} element={<Clients_List/>}/>
                                <Route path={"details/:id"} element={<Clients_Details/>}/>
                            </Route>
                            <Route path={"timesheets"} element={<Team_Main/>}>
                                <Route path={"list"} element={<TS_List/>}/>
                            </Route>

                        </Route>
                    </Routes>
                </BrowserRouter>

                <ToastContainer
                    containerId="id"
                    draggable={false}
                    autoClose={4000}
                />

            </>
        );
    }

}
