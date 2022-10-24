import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import React from "react";
import logo from "../../assets/logos/smartco_logo_2.png"
import "./style.css"



export default function LandingTopBar(props) {

    return(
        <nav className="navbar navbar-expand-lg navbar-light">
            <div className="container position-relative"><a href="/fr" aria-label="Home"
                                                            className="navbar-brand nuxt-link-active">
                <img src={logo} style={{width:"30%"}}/>
            </a>
                <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"/>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">

                    <ul  className="navbar-nav font-weight-bold flex-grow-1 justify-content-center font-size-paragraph-4"
                         data-v-befd13a4="">
                        <li className="nav-link" data-v-befd13a4=""><a href="" data-v-befd13a4=""
                                                                       className="">
                            Création d'entreprise
                        </a></li>
                        <li className="nav-link" data-v-befd13a4=""><a href=""
                                                                       data-v-befd13a4="" className="">
                            Modification d'entreprise
                        </a></li>
                        <li className="nav-link" data-v-befd13a4=""><a href="" data-v-befd13a4="" className="">
                            Prix
                        </a></li>
                        <li className="nav-link" data-v-befd13a4=""><a href="" data-v-befd13a4=""
                                                                       className="">
                            A propos
                        </a></li>
                    </ul>
                    <ul className="navbar-nav ml-auto d-lg-flex d-xl-flex align-items-lg-center align-items-xl-center"
                        data-v-befd13a4="">
                        <li data-v-befd13a4="">
                            <hr className="divider d-lg-none" data-v-befd13a4=""/>
                        </li>
                        <li className="nav-item free-support d-lg-none" data-v-befd13a4="">
                            <div className="text" data-v-befd13a4="">Support gratuit :</div>
                            <div className="text-primary" data-v-befd13a4=""><a href="tel:+41585959999"
                                                                                data-v-494e0a02=""
                                                                                data-v-befd13a4=""> +41 58 595 99 99 </a></div>
                        </li>
                        <li data-v-befd13a4=""><a href="/login" className="btn btn-outline-primary mb-2 mb-lg-0 mr-2"
                                                  style={{fontWeight:700}}
                                                  data-v-befd13a4="">
                            Connexion
                        </a> <a href="/register" className="btn btn-primary mb-2 mb-lg-0" data-v-befd13a4="" style={{fontWeight:700}}>
                            Créer un compte
                        </a></li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}
