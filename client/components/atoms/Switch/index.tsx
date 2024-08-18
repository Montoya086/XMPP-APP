import { FC, useState } from "react";
import { Container, Text, TextContainer } from "./styles";

interface ButtonProps {
    text1: string;
    text2: string;
    current: boolean
    onPress: () => void;
}

export const SwitchButton: FC<ButtonProps> = ({
    text1,
    text2,
    onPress,
    current
}) => {


    return(
        <Container
            onPress={()=>{
                onPress()
            }}
        >
            <TextContainer active={!current}>
                <Text active={!current}>
                    {text1}
                </Text>
            </TextContainer>
            <TextContainer active={current}>
                <Text active={current}>
                    {text2}
                </Text>
            </TextContainer>
        </Container>
    )
}