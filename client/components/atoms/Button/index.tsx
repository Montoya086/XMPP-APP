import { FC } from "react";
import { Container, Text } from "./styles";

interface ButtonProps {
    text: string;
    onPress: () => void;
}

export const Button: FC<ButtonProps> = ({
    text,
    onPress
}) => {
    return(
        <Container
            onPress={onPress}
        >
            <Text>{text}</Text>
        </Container>
    )
}