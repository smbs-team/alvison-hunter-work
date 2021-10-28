import React from "react";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

import {
    MapIcon,
    ReceiptIcon,
    UserIcon,
    Wallet2Icon,
} from '../../../assets/icons';


import {Link, useHistory} from 'react-router-dom';
import './MenuDrawer.scss';
import {useActions} from "../../../hooks";
import * as rawActions from "../../../store/actions";
import {useSelector} from "react-redux";

import {Store as IStore} from "../../../interfaces/storeInterfaces";


import {flattenStore} from "../../../utils";
import { NAME_SPACE } from "../../../utils/constants";


export interface IDrawerLateral {
    anchorPosition?: "left" | "right";
    isDrawerOpen: boolean;
    toggleDrawerFunction: any;
}

//! Component
export default function MenuDrawer({ anchorPosition = "left", isDrawerOpen = false, toggleDrawerFunction}: IDrawerLateral) {

    const { logout } = useActions(rawActions);
    const history = useHistory();

    const {
        user,
    } = useSelector((store: IStore) => flattenStore(store));

    //Drawer content
    const drawerContent = () => (
        <div
            className="drawerContent"
            role="presentation"
            onClick={toggleDrawerFunction(false)}
            onKeyDown={toggleDrawerFunction(false)}
        >

            {/* Close Icon */}
            <IconButton onClick={toggleDrawerFunction(false)} className="mb-1" >
                <CloseIcon />
            </IconButton>


            {/* is Logged OUT User */}
            {!user && (
                <List>

                    <Link to="/login" className='linkRow'>
                        <ListItem button key="Login123">
                            <ListItemText primary="Login"/>
                        </ListItem>
                    </Link>

                    <Link to="/signup" className='linkRow'>
                        <ListItem button key="SignUp123">
                            <ListItemText primary="Sign Up"/>
                        </ListItem>
                    </Link>

                </List>

            ) }



            {/* is Logged IN User */}
            {user && (
                <List>

                    <Link to="/profile/orders" className='linkRow'>
                        <ListItem button key="Orders123">
                            <ListItemIcon>
                                <ReceiptIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Orders"/>
                        </ListItem>
                    </Link>

                    <Link to="/profile/details" className='linkRow'>
                        <ListItem button key="Account123">
                            <ListItemIcon>
                                <UserIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Account"/>
                        </ListItem>
                    </Link>

                    <Link to="/profile/addresses" className='linkRow'>
                        <ListItem button key="Addresses123">
                            <ListItemIcon>
                                <MapIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Addresses"/>
                        </ListItem>
                    </Link>

                    <Link to="/profile/cards" className='linkRow'>
                        <ListItem button key="Wallet123">
                            <ListItemIcon>
                                <Wallet2Icon/>
                            </ListItemIcon>
                            <ListItemText primary="Wallet"/>
                        </ListItem>
                    </Link>

                    <ListItem onClick={() => logout(history)} button key="Sign Out123" role="button" >
                        <ListItemText primary="Sign Out" classes={{primary: 'font-semibold'}} />
                    </ListItem>

                </List>

            ) }


            <Divider />


            <List>

                <a href="https://reeftechnology.com/careers/" target="_blank" rel="noreferrer"  className='linkRow'>
                    <ListItem button key="Drive123">
                        <ListItemText primary={NAME_SPACE.DRIVE}/>
                    </ListItem>
                </a>

                <a href="https://reeftechnology.com/" target="_blank" rel="noreferrer"  className='linkRow'>
                    <ListItem button key="Partner123">
                        <ListItemText primary={NAME_SPACE.PARTNER}/>
                    </ListItem>
                </a>

            </List>
        </div>
    );

    return (
        <Drawer
            anchor={anchorPosition}
            open={isDrawerOpen}
            onClose={toggleDrawerFunction(false)}
        >
            {drawerContent()}
        </Drawer>
    );
}
