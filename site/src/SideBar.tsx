import React, {useEffect, useState} from 'react';
import './App.css';

import DefaultPfp from './images/PngItem_1503945.png';
import AccMenuButton from "./AccMenuButton";
import PicSignOut from './images/basebuttons/sign-out 1.png'
import PicHome from './images/basebuttons/home 1.png'
import PicLock from './images/basebuttons/lock 1.png'
import PicPencil from './images/basebuttons/pencil 1.png'
import PicFriends from './images/basebuttons/friends 1.png'
import PicRecList from './images/basebuttons/list-format 1.png'
import PicBell from './images/basebuttons/notifications 1.png'
import ProfilePhoto from "./ProfilePhoto";
import {Authentication, SidebarConfig} from "./App";
import SpotifyPlayer from "react-spotify-web-playback";
import SearchIcon from './images/basebuttons/search_icon2.png';
import {track} from "./MyTypes";

function SideBar(props: {nowPlaying: track | undefined, authentication: Authentication, sidebarConfig: SidebarConfig}) {
    console.log("now playing", props.nowPlaying)
    return (
        <div className={"Side-bar"}>
            <ProfilePhoto image={props.sidebarConfig.profilePicturePath ?? DefaultPfp}/>


            <div className={"Account-menu"}>
                <div className={"Player-box"}>
                    {props.nowPlaying !== undefined ?
                        <SpotifyPlayer
                            uris={[props.nowPlaying.uri]}
                            token={props.authentication.accessToken}
                        />
                        : <></>
                    }
                </div>
                <AccMenuButton picture={PicHome} picAlt={"house"} txtContent={"Account Overview"} route={"/"}/>
                <AccMenuButton picture={PicHome} picAlt={"house"} txtContent={"Dashboard"} route={"/dashboard"}/>
                <AccMenuButton picture={SearchIcon} picAlt={"lock"} txtContent={"Search"} route={"/search"}/>
                <AccMenuButton picture={PicPencil} picAlt={"pencil"} txtContent={"Edit Profile"} route={"/editprofile"}/>
                <AccMenuButton picture={PicLock} picAlt={"lock"} txtContent={"Settings"} route={"/changepassword"}/>
                <AccMenuButton picture={PicFriends} picAlt={"friends"} txtContent={"Friends List"} route={"/friendslist"}/>
                <AccMenuButton picture={PicRecList} picAlt={"list"} txtContent={"My Recommendations"} route={"/myrecommendations"}/>
                <AccMenuButton picture={PicSignOut} picAlt={"exit"} txtContent={"Sign Out"} route={"/signout"}/>
            </div>
        </div>
    )
}

export default SideBar;