import { FC } from "react";
import { TextInput, TextInputProps, View, ViewProps } from "react-native";
import { Container, ErrorText, LabelText, Wrapper } from "./styles";

interface CustomTextInputProps {
    textInputProps?: TextInputProps;
    containerProps?: ViewProps;
    label?: string;
    error?: string;
}

export const CustomTextInput: FC<CustomTextInputProps> = ({
    textInputProps,
    containerProps,
    label,
    error
}) => {
    return(
        <Wrapper>
            {label && <LabelText>{label}</LabelText>}
            <Container
                {...containerProps}
            >
                <TextInput 
                    {...textInputProps}
                />
            </Container>
            {error && <ErrorText>{error}</ErrorText>}
        </Wrapper>
    )
};