import React from "react";
import './menu.css'
import {Link} from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import {textTitleColor} from "../../constants/defaultValues";

export default class Menu extends React.Component{


    state={
        active_item:this.props.active_item
    }

    componentDidMount() {
        console.log(this.props.history)
        let arrow = document.querySelectorAll(".arrow");
        for (var i = 0; i < arrow.length; i++) {
            arrow[i].addEventListener("click", (e)=>{
                console.log("CLICKED")
                let arrowParent = e.target.parentElement.parentElement;
                arrowParent.classList.toggle("showMenu");
            });
        }
    }


    render() {

        if(this.props.openDrawerMenu === true){
            let arrow = document.querySelectorAll(".arrow");
            for (var i = 0; i < arrow.length; i++) {
                arrow[i].addEventListener("click", (e)=>{
                    console.log("CLICKED")
                    let arrowParent = e.target.parentElement.parentElement;
                    arrowParent.classList.toggle("showMenu");
                });
            }
        }

        return(
            <>
                <div className="sidebar close"
                     style={{backgroundColor:this.props.background_color,borderRight:"1px solid #E8E9EB",
                         visibility:this.props.isMobile === false ? "unset" : "hidden"}}
                >
                    <div className="logo-details">
                        {
                            this.props.show_logo === true &&
                            <img src={this.props.ilogo} style={{marginTop:22,height:20}} />
                        }
                    </div>
                    <ul className="nav-links">
                        {
                            this.props.items.map((item,key) => (
                                <li key={key} style={{backgroundColor: this.state.active_item === key+1 ? "#F5FBFF" :"inherit",marginLeft:this.props.size === "big" ? 1 : -7 }}
                                    className={(this.state.active_item === key+1 && this.props.size === "big") ? "s_menu_item" : ""}
                                    onClick={() => {this.setState({active_item:key+1})}}
                                >
                                    {
                                        item.childrens && item.childrens.length > 0 ?
                                            <div className="iocn-link">
                                                <Link style={{cursor:"pointer"}} to={item.route}>
                                                    <i className={item.icon} style={{color:this.state.active_item === key+1 ? textTitleColor : "#fff"}}/>
                                                    <span className="link_name" style={{color:this.state.active_item === key+1 ? textTitleColor : "#fff"}}>{item.title}</span>
                                                </Link>
                                                <i className='bx bxs-chevron-down arrow' style={{color:this.state.active_item === key+1 ? textTitleColor :"#fff"}}/>
                                            </div> :
                                            <Link style={{cursor:"pointer"}} to={item.route} onClick={() => {this.props.setOpenDetailMenu(item)}}>
                                                <i className={item.icon} style={{color:this.state.active_item === key+1 ? "#004671" : "#3F434A"}}/>
                                                <span className="link_name"
                                                      style={{color:this.state.active_item === key+1 ? "#004671" : "#3F434A",fontWeight:this.state.active_item === key+1 ? 700:400}}
                                                >{item.title}</span>
                                            </Link>
                                    }

                                    <ul className={item.childrens && item.childrens.length > 0 ? "sub-menu" : "sub-menu blank"}>
                                        <li>
                                            <Link className="link_name" style={{color:"#004671",cursor:"pointer",fontSize:"1.05rem"}}
                                                  to={item.route}>{item.title}</Link>
                                        </li>
                                        {
                                            (item.childrens || []).map((child,k) => (
                                                <li style={{cursor:"pointer",margin:5}} key={k}>
                                                    <Link style={{fontSize:"1.05rem",color:textTitleColor}} to={child.route}>{child.title}</Link>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </li>
                            ))
                        }

                    </ul>
                </div>

                <Drawer anchor={"left"} open={this.props.openDrawerMenu} onClose={() => {
                    this.props.setOpenDrawerMenu()
                }}
                >
                    <div className="sidebar"
                         style={{backgroundColor:this.props.background_color}}
                    >
                        <div className="logo-details">
                            {
                                this.props.show_logo === true &&
                                <img src={this.props.ilogo} style={{marginTop:22,height:20}} />
                            }
                        </div>
                        <ul className="nav-links">
                            {
                                this.props.items.map((item,key) => (
                                    <li key={key} style={{backgroundColor: this.state.active_item === key+1 ? "#fff" :"inherit" }}
                                        onClick={() => {this.setState({active_item:key+1})}}
                                    >
                                        {
                                            item.childrens && item.childrens.length > 0 ?
                                                <div className="iocn-link">
                                                    <Link style={{cursor:"pointer"}} to={item.route}>
                                                        <i className={item.icon} style={{color:this.state.active_item === key+1 ? textTitleColor : "#fff"}}/>
                                                        <span className="link_name" style={{color:this.state.active_item === key+1 ? textTitleColor : "#fff"}}>{item.title}</span>
                                                    </Link>
                                                    <i className='bx bxs-chevron-down arrow' style={{color:this.state.active_item === key+1 ? textTitleColor :"#fff"}}/>
                                                </div> :
                                                <Link style={{cursor:"pointer"}} to={item.route} onClick={() => {this.props.setOpenDetailMenu(item)}}>
                                                    <i className={item.icon} style={{color:this.state.active_item === key+1 ? "#004671" : "#3F434A"}}/>
                                                    <span className="link_name"
                                                          style={{color:this.state.active_item === key+1 ? "#004671" : "#3F434A",fontWeight:this.state.active_item === key+1 ? 700:400}}
                                                    >{item.title}</span>
                                                </Link>
                                        }

                                        <ul className={item.childrens && item.childrens.length > 0 ? "sub-menu" : "sub-menu blank"}>
                                            <li>
                                                <Link className="link_name" style={{color:"#000",cursor:"pointer",fontSize:"1.05rem"}}
                                                      to={item.route}>{item.title}</Link>
                                            </li>
                                            {
                                                (item.childrens || []).map((child,k) => (
                                                    <li style={{cursor:"pointer",margin:5}} key={k}>
                                                        <Link style={{fontSize:"1.05rem"}} to={child.route}>{child.title}</Link>
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </li>
                                ))
                            }

                        </ul>
                    </div>

                </Drawer>

            </>
        )

    }





}
