import { AppBackground, CustomTextInput, Button, DropDownMenu } from "@components/";
import React, { FC, useEffect } from "react";
import { Container, FormContainer, SignUpText, SignUpTextNormal } from "./styles";
import Logo from "../../../../assets/icons/logo.svg";
import Chevron from "../../../../assets/icons/chevron.svg";
import { useLogin } from "./useLogin";
import { RootStackScreenProps } from "src/navigations/types/ScreenProps";

const LoginScreen: FC<RootStackScreenProps<"Login">> = ({
    navigation,
}) => {
    const { loginValues } = useLogin();

    return (
        <AppBackground isSafe>
            <Container>
                <FormContainer>
                    <Logo
                        width={250}
                        height={150}
                    />
                    <CustomTextInput
                        textInputProps={{
                            placeholder: "myuser123",
                            value: loginValues.values.jid,
                            onChangeText: loginValues.handleChange("jid"),
                        }}
                        label="JID"
                        error={loginValues.errors.jid?.toString()}
                    />
                    <CustomTextInput
                        textInputProps={{
                            placeholder: "mysecretpassword",
                            value: loginValues.values.password,
                            onChangeText: loginValues.handleChange("password"),
                            secureTextEntry: true,
                        }}
                        label="Password"
                        error={loginValues.errors.password?.toString()}
                    />
                    <DropDownMenu
                        items={[
                            {
                                label: "alumchat.lol",
                                value: "ws://alumchat.lol:7070/ws/",
                            },
                        ]}
                        onSelect={(item)=>{
                            loginValues.setFieldValue("serverUrl", item.value);
                            loginValues.setFieldValue("serverName", item.label);
                        }}
                        selected={{
                            label: loginValues.values.serverName,
                            value: loginValues.values.serverUrl,
                        }}
                        label="Server"
                        variant="outlined"
                        chevron={<Chevron />}
                        error={loginValues.errors.serverName?.toString()}
                    />
                    <Button
                        text="Login"
                        onPress={loginValues.handleSubmit}
                    />
                    <SignUpTextNormal>
                        {"Don't have an account? "}
                        <SignUpText
                            onPress={() => {
                                navigation.navigate("Signup");
                            }}
                        >
                            Sign Up
                        </SignUpText>
                    </SignUpTextNormal>
                </FormContainer> 
            </Container>
        </AppBackground>
    )
}

export default LoginScreen;