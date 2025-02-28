import React from "react";
import SignupForm from "../components/auth/SignupForm";
import LoginForm from "../components/auth/LoginForm";

const AuthPage: React.FC = () => {


    return (
        <div>
            <SignupForm />
            <LoginForm />
            {/* <LogoutButton /> */}
        </div>
    );
};

export default AuthPage;