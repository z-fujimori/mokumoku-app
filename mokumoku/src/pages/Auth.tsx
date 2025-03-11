import React from "react";
import SignupForm from "../components/auth/SignupForm";
import LoginForm from "../components/auth/LoginForm";

const AuthPage = (props:{
    setIsUpdateViewState: React.Dispatch<React.SetStateAction<boolean>>
}) => {


    return (
        <div>
            <SignupForm setIsUpdateViewState={props.setIsUpdateViewState} />
            <LoginForm setIsUpdateViewState={props.setIsUpdateViewState} />
            {/* <LogoutButton /> */}
        </div>
    );
};

export default AuthPage;