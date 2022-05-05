import React, {useState} from 'react';
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
import MyRecommendations from "./routes/MyRecommendations";
import SignOut from "./routes/SignOut";
import DefaultPfp from "./images/PngItem_1503945.png";
import Home from "./routes/Home";
import NewSession from "./routes/NewSession";
import Unauthenticated from "./routes/Unauthenticated";
import SideBar from "./SideBar";

type SidebarConfig = {
    profilePicturePath: string,
}



function App() {
    const [sessionToken, setSessionToken] = useState<string>('')
    const [sidebarConfig, setSidebarConfig] = useState<SidebarConfig>({
        profilePicturePath: DefaultPfp,
    })

    if (sessionToken) {
        return (
            <BrowserRouter>
                <SideBar sidebarConfig={sidebarConfig}/>
                <Routes>
                    <Route path={"/"} element={<Authenticate sessionToken={sessionToken}><Home sessionToken={sessionToken} setSidebarConfig={setSidebarConfig}/></Authenticate>}/>
                    <Route path={"newSession"} element={<NewSession setSessionToken={setSessionToken}/>}/>
                    <Route path={"privacysettings"} element={<Authenticate sessionToken={sessionToken}><PrivacySettings/></Authenticate>}/>
                    <Route path={"editprofile"} element={<Authenticate sessionToken={sessionToken}><EditProfile/></Authenticate>}/>
                    <Route path={"changepassword"} element={<Authenticate sessionToken={sessionToken}><ChangePassword/></Authenticate>}/>
                    <Route path={"notificationsettings"} element={<Authenticate sessionToken={sessionToken}><NotificationSettings/></Authenticate>}/>
                    <Route path={"FriendsList"} element={<Authenticate sessionToken={sessionToken}><FriendsList/></Authenticate>}/>
                    <Route path={"myrecommendations"} element={<Authenticate sessionToken={sessionToken}><MyRecommendations/></Authenticate>}/>
                    <Route path={"signout"} element={<Authenticate sessionToken={sessionToken}><SignOut/></Authenticate>}/>
                </Routes>
            </BrowserRouter>
        )
    } else {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path={"/"} element={<Authenticate sessionToken={sessionToken}><Home sessionToken={sessionToken} setSidebarConfig={setSidebarConfig}/></Authenticate>}/>
                    <Route path={"newSession"} element={<NewSession setSessionToken={setSessionToken}/>}/>
                </Routes>
            </BrowserRouter>
        )

    }
}

function Authenticate(props: {sessionToken: string, children: JSX.Element}) {
    if (props.sessionToken) {
        return props.children
    } else {
        return <Unauthenticated />
    }
}

export type { SidebarConfig }
export default App
