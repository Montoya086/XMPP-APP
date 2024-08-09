import { AppBackground, Button, CustomTextInput } from "@components/";
import { FC, useEffect, useRef } from "react";
import { FlatList, Keyboard, Text } from "react-native";
import { RootStackScreenProps } from "src/navigations/types/ScreenProps";
import xmppService from '../../../../utils/xmpp';
import { useDispatch } from "react-redux";
import { changeAppState, addMessage, removeUser, setUser, useAppSelector, clearChats, setLoading } from "@store/";
import { ChatBubble, ChatContainer, ChatWrapper, HeaderContainer, InputContainer, InputWrapper, SendButton } from "./styles";
import Send from "../../../../assets/icons/send.svg";
import { useChat } from "./useChat";
import uuid from 'react-native-uuid';

const ChatScreen:FC<RootStackScreenProps<"Chat">> = () => {
    const dispatch = useDispatch();
    const flatlistRef = useRef<FlatList>(null);
    const { messageValues } = useChat();
    const {users} = useAppSelector(state => state.database);
    const {isLoading} = useAppSelector(state => state.loading);
    const {
        hostName,
        hostUrl,
        jid,
        password
      } = useAppSelector(state => state.user)

    const scrollToBottom = () => {
        flatlistRef.current?.scrollToEnd({ animated: true });
    };

    useEffect(() => {
        console.log(JSON.stringify(users, null, 2));
    }, [users]);

    useEffect(() => {
        if (jid) {

            if(xmppService.getXMPP() === null) {
                dispatch(setLoading(true))
                xmppService.connect({
                    service: hostUrl,
                    domain: hostName,
                    resource: '',
                    username: jid,
                    password: password
                  })
            }

            xmppService.listenForConnection(() => {
                dispatch(setLoading(false))
            })

            xmppService.listenForMessages((from, message) => {
                console.log(from, message);
                const parsedFrom = from.split("@")[0];
                dispatch(addMessage({user: jid, with: parsedFrom, message: {message, from: parsedFrom, uid: uuid.v4().toString()}}));
            });

            return () => {
                xmppService.disconnect();
            }
        }
    }, [jid]);

    useEffect(() => {
        scrollToBottom();
    }, [users[jid]?.chats["mon21552"]?.messages]);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
          'keyboardDidShow',
          () => {
            setTimeout(() => {
                scrollToBottom();
            }, 50);
          }
        );
    
        return () => {
          keyboardDidShowListener.remove();
        };
      }, []);

    const handleLogout = () => {
        dispatch(removeUser());
        xmppService.disconnect();
        dispatch(changeAppState({appNavigationState: 'NOT_LOGGED_IN'}));
    }

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
                    <Button
                        text="borrar"
                        onPress={() => {
                            dispatch(clearChats());
                        }}
                    />
                </HeaderContainer>
                <ChatWrapper>
                    {!isLoading && (
                        <FlatList
                            ref={flatlistRef}
                            data={users[jid]?.chats["mon21552"]?.messages}
                            renderItem={({item}) => {
                                return (
                                    <ChatBubble
                                        isSender={item.from === jid}
                                        onLayout={() => {
                                            scrollToBottom();
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: "#fff"
                                            }}
                                        >
                                            {item.message}
                                        </Text>
                                    </ChatBubble>
                                )
                            }}
                            keyExtractor={(item) => item.uid}
                            style={{
                                padding: 10
                            }}
                        />
                    )}
                </ChatWrapper>
                <InputContainer>
                    <InputWrapper>
                        <CustomTextInput
                            textInputProps={{
                                placeholder: "Type a message",
                                value: messageValues.values.message,
                                onChangeText: messageValues.handleChange("message"),
                            }}
                        />
                    </InputWrapper>
                    <SendButton
                        onPress={() => {
                            messageValues.handleSubmit();
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