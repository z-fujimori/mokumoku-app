import React, { useState } from "react";
import SignupForm from "../components/auth/SignupForm";
import LoginForm from "../components/auth/LoginForm";
import { ViewState } from "../types";

const AuthPage = (props:{
    setIsUpdateViewState: React.Dispatch<React.SetStateAction<boolean>>,
    setViewState: React.Dispatch<React.SetStateAction<ViewState>>
}) => {

    const [pageState, setPageState] = useState(0);

    return (
        <div className="mt-32">
            {pageState == 1 && <SignupForm setIsUpdateViewState={props.setIsUpdateViewState} setPageState={setPageState} setViewState={props.setViewState} /> }
            {pageState == 0 && <LoginForm setIsUpdateViewState={props.setIsUpdateViewState} setPageState={setPageState} setViewState={props.setViewState} /> }
            {/* <LogoutButton /> */}
        </div>
    );
};

export default AuthPage;