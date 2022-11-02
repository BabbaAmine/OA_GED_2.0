import React from "react";
import Menu from "../Menu/Menu";
import {
    Outlet, useLocation, useNavigate
} from 'react-router-dom';
import {useMediaQuery} from 'react-responsive'
import {menu_items} from "../Menu/DataMenu";
import defaultAvatar from "../../assets/images/default_avatar.png"
import {Popup} from 'semantic-ui-react'
import {ButtonItem, MenuGroup, Section} from '@atlaskit/menu';
import SignOutIcon from '@atlaskit/icon/glyph/sign-out'
import PersonIcon from '@atlaskit/icon/glyph/person'
import SettingsIcon from '@atlaskit/icon/glyph/settings'
import oa_logo_1 from "../../assets/logo/oa_logo_1.png"
import oa_logo_2 from "../../assets/logo/oa_logo_2.png"
import Avatar from '@mui/material/Avatar';
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export default function Main(props) {

    const location = useLocation()
    const navigate = useNavigate()

    const [toggle_menu, setToggle_menu] = React.useState(false);
    const [openDrawerMenu, setOpenDrawerMenu] = React.useState(false);
    const [openDetailMenu, setOpenDetailMenu] = React.useState(false);
    const [currentPage, setCurrentPage] = React.useState("");
    const [currentPageTitle, setCurrentPageTitle] = React.useState(
        location.pathname.includes("team") ? "Equipe OA" :
            location.pathname.includes("clients") ? "Liste clients" :
                location.pathname.includes("timesheets") ? "TimeSheets" : "Equipe OA"
    );
    const [activeMenuItem, setActiveMenuItem] = React.useState(
        location.pathname.includes("team") ? 1 :
            location.pathname.includes("clients") ? 2 :
                location.pathname.includes("timesheets") ? 3 : 1
    );

    const isMobile = useMediaQuery({query: '(max-width: 825px)'})
    const isBigScreen = useMediaQuery({query: '(min-width: 825px)'})
    let left_distance = isBigScreen ? (openDetailMenu === true ? 270 : toggle_menu === false ? 64 : 0) : 0

    return (
        <>

            <Menu background_color={"#fff"} ilogo={openDetailMenu || openDrawerMenu ? oa_logo_2 : oa_logo_1} top_title="OA Legal" top_title_color="#fff"
                  size={openDetailMenu ? "big":"small"}
                  show_logo={true}
                  show_active_user={false}
                  active_user_name={localStorage.getItem("username")} active_user_details="admin"
                  active_user_img={defaultAvatar}
                  icons_color={"#3F434A"} titles_color={"#3F434A"}
                  items={menu_items}
                  on_logout={() => {
                  }}
                  active_item={activeMenuItem}
                  openDrawerMenu={openDrawerMenu}
                  setOpenDrawerMenu={() => {
                      setOpenDrawerMenu(!openDrawerMenu)
                  }}
                  isMobile={isMobile}
                  openDetailMenu={openDetailMenu}
                  setOpenDetailMenu={(item) => {
                      setCurrentPage(item.uid)
                      setCurrentPageTitle(item.title)
                      openDetailMenu && setOpenDetailMenu(true)
                  }}
                  currentItem={currentPage}
                  history={props.history}

            />

            <section className="home-section"
                     style={{
                         left: left_distance,
                         width: "calc(100% - " + (left_distance).toString() + "px)"
                     }}
            >
                <div className="home-content">

                    <i className={openDetailMenu === true ? "bx bx-menu-alt-left" : "bx bx-menu"}
                       style={{color: "#004671"}}
                       onClick={( event => {
                           if (isBigScreen) {
                               let sidebar = document.querySelector(".sidebar");
                               sidebar.classList.toggle("close");
                               setOpenDetailMenu(!openDetailMenu)
                           } else if (isMobile) {
                               setOpenDrawerMenu(!openDrawerMenu)
                           }
                       })}
                    />

                    <div style={{position: "fixed", right: 5}}>
                        <Popup
                            content={
                                <>
                                    <MenuGroup
                                        maxWidth={180}
                                        minWidth={180}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Section hasSeparator={false}>
                                            <ButtonItem
                                                onClick={() => {
                                                    localStorage.clear()
                                                    navigate("/login",{replace:true})
                                                }}
                                                iconBefore={<SignOutIcon primaryColor="red" label=""/>}
                                            >
                                                Déconnexion
                                            </ButtonItem>
                                        </Section>
                                    </MenuGroup>
                                </>
                            }
                            on='click'
                            position='bottom right'
                            popper={{id: 'popper-container', style: {zIndex: 2000}}}
                            trigger={
                                <div style={{cursor: "pointer"}}>
                                    <div style={{display:"flex"}}>
                                        <div style={{alignSelf:"center"}}>
                                            <Avatar
                                                sx={{ width: 34, height: 34 }}
                                                alt={localStorage.getItem("email")}
                                                src={localStorage.getItem("image")}
                                            />
                                        </div>
                                        <div style={{alignSelf:"center",marginLeft:5}}>
                                            <Typography variant="subtitle1">{localStorage.getItem("username")}</Typography>
                                        </div>
                                        <div style={{alignSelf:"center"}}>
                                            <ArrowDropDownIcon style={{color:"black",marginLeft:3}}/>
                                        </div>
                                    </div>

                                </div>
                            }
                        />

                    </div>
                </div>

                <div style={{
                    paddingTop: 30,
                    backgroundColor:"#F5F5F5"
                }}>
                    <Outlet/>
                </div>
            </section>

        </>
    )


}
