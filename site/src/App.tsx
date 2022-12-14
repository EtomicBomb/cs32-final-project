import React, {useEffect, useState} from 'react';
import './App.css';
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";
import PrivacySettings from "./routes/PrivacySettings";
import EditProfile from "./routes/EditProfile";
import ChangePassword from "./routes/ChangePassword";
import NotificationSettings from "./routes/NotificationSettings";
import FriendsList from "./routes/FriendsList";
import SignOut from "./routes/SignOut";
import DefaultPfp from "./images/PngItem_1503945.png";
import Home from "./routes/Home";
import NewSession from "./routes/NewSession";
import Unauthenticated from "./routes/Unauthenticated";
import SideBar from "./SideBar";
import MyRecommendations from "./routes/MyRecommendations";
import Dashboard from "./routes/suggestions/Dashboard";
import {track} from "./MyTypes";
import axios from "axios";

type SidebarConfig = {
    profilePicturePath: string,
}

type Authentication = {
    sessionToken: string, // created by our browser to authenticate our requests
    accessToken: string, // needed to make direct requests to spotify
}

function App() {
    const [authentication, setAuthentication] = useState<Authentication>()
    const [sidebarConfig, setSidebarConfig] = useState<SidebarConfig>({
        profilePicturePath: DefaultPfp,
    })
    const [nowPlaying, setNowPlaying] = useState<track | undefined>()

    useEffect(() => {
        if (!authentication) return
        const fifteenMinutes = 1000*60*15;
        const handle = setInterval(async () => {
            const config = {
                headers: {
                    'Authentication': authentication.sessionToken,
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': '*',
                }
            }
            await axios.get(process.env.REACT_APP_REFRESH_ENDPOINT as string, config)
                .then(response => {
                    console.log('setting authentication')
                    setAuthentication({ ...authentication, accessToken: response.data })
                })
        }, fifteenMinutes)

        return () => clearInterval(handle)
    }, [authentication, setAuthentication])

    if (authentication) {
        console.log('access token', authentication.accessToken)
        return (
            <BrowserRouter>
                <SideBar
                    nowPlaying={nowPlaying}
                    authentication={authentication}
                    sidebarConfig={sidebarConfig}
                />
                <Routes>
                    <Route path={"/"} element={<Home authentication={authentication} setSidebarConfig={setSidebarConfig} setNowPlaying={setNowPlaying}/>}/>
                    <Route path={"dashboard"} element={<Dashboard
                        sessionToken={authentication.sessionToken} nowPlaying={nowPlaying} setNowPlaying={setNowPlaying}/>}/>
                    <Route path={"privacysettings"} element={<PrivacySettings/>}/>
                    <Route path={"editprofile"} element={<EditProfile/>}/>
                    <Route path={"changepassword"} element={<ChangePassword/> }/>
                    <Route path={"notificationsettings"} element={<NotificationSettings/>}/>
                    <Route path={"FriendsList"} element={<FriendsList/>}/>
                    <Route path={"signout"} element={<SignOut/>}/>
                    <Route path={"myrecommendations"} element={<MyRecommendations authentication={authentication}/>}/>
                </Routes>
            </BrowserRouter>
        )
    } else {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path={"/"} element={<Unauthenticated />}/>
                    <Route path={"newSession"} element={<NewSession setAuthentication={setAuthentication}/>}/>
                </Routes>
            </BrowserRouter>
        )

    }
}

export type { SidebarConfig, Authentication }
export default App
