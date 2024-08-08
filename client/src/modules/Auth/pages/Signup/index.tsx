import { AppBackground, CustomTextInput, Button, DropDownMenu } from "@components/";
import React, { FC, useEffect } from "react";
import { Container, FormContainer, SignUpText, SignUpTextNormal } from "./styles";
import Logo from "../../../../assets/icons/logo.svg";
import Chevron from "../../../../assets/icons/chevron.svg";
import { useSignUp } from "./useSignUp";
import { RootStackScreenProps } from "src/navigations/types/ScreenProps";

const SignUpScreen: FC<RootStackScreenProps<"Signup">> = ({
    navigation,
}) => {
    const { signUpValues } = useSignUp();

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
                            value: signUpValues.values.jid,
                            onChangeText: signUpValues.handleChange("jid"),
                        }}
                        label="JID"
                        error={signUpValues.errors.jid?.toString()}
                    />
                    <CustomTextInput
                        textInputProps={{
                            placeholder: "mysecretpassword",
                            value: signUpValues.values.password,
                            onChangeText: signUpValues.handleChange("password"),
                            secureTextEntry: true,
                        }}
                        label="Password"
                        error={signUpValues.errors.password?.toString()}
                    />
                    <CustomTextInput
                        textInputProps={{
                            placeholder: "mymail@mail.com",
                            value: signUpValues.values.email,
                            onChangeText: signUpValues.handleChange("email"),
                            secureTextEntry: true,
                        }}
                        label="Email"
                        error={signUpValues.errors.email?.toString()}
                    />
                    <DropDownMenu
                        items={[
                            {
                                label: "alumchat.lol",
                                value: "ws://alumchat.lol:7070/ws/",
                            },
                        ]}
                        onSelect={(item)=>{
                            signUpValues.setFieldValue("serverUrl", item.value);
                            signUpValues.setFieldValue("serverName", item.label);
                        }}
                        selected={{
                            label: signUpValues.values.serverName,
                            value: signUpValues.values.serverUrl,
                        }}
                        label="Server"
                        variant="outlined"
                        chevron={<Chevron />}
                        error={signUpValues.errors.serverName?.toString()}
                    />
                    <Button
                        text="Login"
                        onPress={signUpValues.handleSubmit}
                    />
                    <SignUpTextNormal>
                        {"Already have an account? "}
                        <SignUpText
                            onPress={() => {
                                navigation.navigate("Login");
                            }}
                        >
                            Login
                        </SignUpText>
                    </SignUpTextNormal>
                </FormContainer>
            </Container> 
        </AppBackground>
    )
}

export default SignUpScreen;