import React from "react";
import { invoke } from '@tauri-apps/api/core'
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Button, Typography, Container } from "@mui/material";
import { supabase } from "../../lib/supabaseClient";
import { signupSchema } from "../../lib/authSchema";
import { z } from "zod";
import { ViewState } from "../../types";

type LoginData = z.infer<typeof signupSchema>;

const LoginForm = (props:{
    setIsUpdateViewState: React.Dispatch<React.SetStateAction<boolean>>,
    setPageState: React.Dispatch<React.SetStateAction<number>>,
    setViewState: React.Dispatch<React.SetStateAction<ViewState>>
}) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginData>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (input: LoginData) => {
        // props.setViewState(ViewState.load)  // ログイン画面からロードを入れたかったが無理そうか？
        const { email, password } = input;
        const ret_token = await invoke<string>("login", {"email": email, "password": password})
            .then(() => {
                props.setIsUpdateViewState(true);
                // props.setViewState(ViewState.index);  // ログイン画面からロードを入れたかったが無理そうか？
            })
            .catch(err => {
                console.error(err); return "";
                // props.setViewState(ViewState.auth)  // ログイン画面からロードを入れたかったが無理そうか？
            });

        console.log("ログイン成功:", ret_token);
        alert("ログインに成功しました！");
    };

    return (
        <Container maxWidth="xs">
            <Typography variant="h5" align="center">
                ログイン
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name="email"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="メールアドレス"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />
                    )}
                />
                <Controller
                    name="password"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="パスワード"
                            type="password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            error={!!errors.password}
                            helperText={errors.password?.message}
                        />
                    )}
                />
                <Button type="submit" fullWidth variant="contained" color="primary">
                    ログイン
                </Button>
            </form>
            <div className="w-auto flex justify-end">
                <button
                    className="text-sm font-light hover:font-medium m-2" 
                    onClick={()=>{props.setPageState(1)}}>サインインはこちら</button>
            </div>
        </Container>
    );
};

export default LoginForm;
