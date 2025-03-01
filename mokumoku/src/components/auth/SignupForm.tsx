import React from "react";
import { invoke } from '@tauri-apps/api/core';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Button, Typography, Container } from "@mui/material";
import { supabase } from "../../lib/supabaseClient";
import { signupSchema } from "../../lib/authSchema";
import { z } from "zod";

type SignupData = z.infer<typeof signupSchema>;

const SignupForm: React.FC = () => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupData>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (input: SignupData) => {
        const { email, password } = input;
        const ret_token = await invoke<string>("signup", {"email": email, "password": password})
            .catch(err => {console.error("失敗", err); return "";});

        console.log("トークン:", ret_token);
        alert("サインアップに成功しました！");
    };

    return (
        <Container maxWidth="xs">
            <Typography variant="h5" align="center">
                サインアップ
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
                    登録
                </Button>
            </form>
        </Container>
    );
};

export default SignupForm;
