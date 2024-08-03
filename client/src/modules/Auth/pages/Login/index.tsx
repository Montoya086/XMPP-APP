import { AppBackground, CustomTextInput, Button } from "@components/";
import React, { FC } from "react";
import { FormContainer, SignUpText, SignUpTextNormal } from "./styles";
import Logo from "../../../../assets/icons/logo.svg";

const LoginScreen: FC = () => {
    const [text, setText] = React.useState("");
    return (
        <AppBackground isSafe>
            <FormContainer>
                <Logo
                    width={200}
                    height={200}
                />
                <CustomTextInput
                    textInputProps={{
                        placeholder: "mail@alumchat.lol",
                        value: text,
                        onChangeText: text => setText(text),
                    }}
                    label="Email"
                />
                <CustomTextInput
                    textInputProps={{
                        placeholder: "mysecretpassword",
                        value: text,
                        onChangeText: text => setText(text),
                    }}
                    label="Password"
                />
                <Button
                    text="Login"
                    onPress={() => {}}
                />
                <SignUpTextNormal>
                    {"Don't have an account? "}
                    <SignUpText
                        onPress={() => {
                            console.log("Sign Up");
                        }}
                    >
                        Sign Up
                    </SignUpText>
                </SignUpTextNormal>
            </FormContainer> 
        </AppBackground>
    )
}

export default LoginScreen;