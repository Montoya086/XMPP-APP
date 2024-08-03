import { FC } from "react";
import { TextInput, TextInputProps, View, ViewProps } from "react-native";
import { Container, LabelText, Wrapper } from "./styles";

interface CustomTextInputProps {
    textInputProps?: TextInputProps;
    containerProps?: ViewProps;
    label?: string;
}

export const CustomTextInput: FC<CustomTextInputProps> = ({
    textInputProps,
    containerProps,
    label
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
        </Wrapper>
    )
};