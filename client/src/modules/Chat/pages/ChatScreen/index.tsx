import { AppBackground, Button, CustomTextInput } from "@components/";
import { FC } from "react";
import { Text } from "react-native";
import { RootStackScreenProps } from "src/navigations/types/ScreenProps";
import xmppService from '../../../../utils/xmpp';
import { useDispatch } from "react-redux";
import { changeAppState, removeUser, setUser } from "@store/";
import { ChatContainer, ChatWrapper, HeaderContainer, InputContainer, InputWrapper, SendButton } from "./styles";
import Send from "../../../../assets/icons/send.svg";


const ChatScreen:FC<RootStackScreenProps<"Chat">> = () => {
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(removeUser());
        xmppService.disconnect();
        dispatch(changeAppState({appNavigationState: 'NOT_LOGGED_IN'}));
    }
    {/* <Button
                text="Go to login"
                onPress={() => {
                    handleLogout()
                }}
            />
            <Button
                text="Message"
                onPress={() => {
                    xmppService.sendMessage("mon21552@alumchat.lol", "Hello world");
                }}
            /> */}
    return (
        <AppBackground isSafe>
            <ChatContainer>
                <HeaderContainer>
                    <Text
                        style={{
                            fontSize: 20,
                            fontWeight: "bold",
                            color: "#fff"
                        }}
                    >Chat Screen</Text>
                </HeaderContainer>
                <ChatWrapper>

                </ChatWrapper>
                <InputContainer>
                    <InputWrapper>
                        <CustomTextInput/>
                    </InputWrapper>
                    <SendButton
                        onPress={() => {
                            xmppService.sendMessage("mon21552@alumchat.lol", "Hello world");
                        }}
                    >
                        <Send
                            width={30}
                            height={30}
                        />
                    </SendButton>
                </InputContainer>
            </ChatContainer>
        </AppBackground>
    )
}

export default ChatScreen;