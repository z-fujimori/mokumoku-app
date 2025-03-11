import React from "react";
import { invoke } from '@tauri-apps/api/core'
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Button, Typography, Container } from "@mui/material";
import { supabase } from "../../lib/supabaseClient";
import { signupSchema } from "../../lib/authSchema";
import { z } from "zod";

type LoginData = z.infer<typeof signupSchema>;

const LoginForm = (props:{
    setIsUpdateViewState: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginData>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (input: LoginData) => {
        const { email, password } = input;
        const ret_token = await invoke<string>("login", {"email": email, "password": password})
            .then(() => {props.setIsUpdateViewState(true)})
            .catch(err => {console.error(err); return "";});
        // const { data, error } = await supabase.auth.signInWithPassword({
        //     email,
        //     password,
        // });

        // if (error) {
        //     console.error("ログインエラー:", error.message);
        //     return;
        // }

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
        </Container>
    );
};

export default LoginForm;
