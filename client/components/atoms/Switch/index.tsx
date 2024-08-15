import { FC, useState } from "react";
import { Container, Text, TextContainer } from "./styles";

interface ButtonProps {
    text1: string;
    text2: string;
    onPress: () => void;
}

export const SwitchButton: FC<ButtonProps> = ({
    text1,
    text2,
    onPress
}) => {

    const [selectedState, setSelectedState] = useState(0)

    const handlePress = () =>{
        if (selectedState === 0){
            setSelectedState(1)
        } else {
            setSelectedState(0)
        }

        onPress()
    }

    return(
        <Container
            onPress={handlePress}
        >
            <TextContainer active={selectedState === 0}>
                <Text active={selectedState === 0}>
                    {text1}
                </Text>
            </TextContainer>
            <TextContainer active={selectedState === 1}>
                <Text active={selectedState === 1}>
                    {text2}
                </Text>
            </TextContainer>
        </Container>
    )
}