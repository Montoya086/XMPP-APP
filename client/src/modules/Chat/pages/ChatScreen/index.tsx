import { AppBackground, Button, CustomTextInput } from "@components/";
import { FC, useEffect, useRef, useState } from "react";
import { FlatList, Keyboard, Text, TouchableOpacity, View } from "react-native";
import { RootStackScreenProps } from "src/navigations/types/ScreenProps";
import xmppService from '../../../../utils/xmpp';
import { useDispatch } from "react-redux";
import { changeAppState, addMessage, removeUser, setUser, useAppSelector, clearChats, setLoading, addChat, setCurrentChat } from "@store/";
import { AddButton, ChatBubble, ChatContainer, ChatWrapper, ContactItem, ContactsContainer, HeaderContainer, InputContainer, InputWrapper, LogoutButton, MenuContainer, NoChatText, NoChatWrapper, SectionTitleContainer, SendButton, UserStatusContainer, UserStatusWrapper } from "./styles";
import Send from "../../../../assets/icons/send.svg";
import Menu from "../../../../assets/icons/menu.svg";
import Off from "../../../../assets/icons/off.svg";
import Plus from "../../../../assets/icons/plus.svg";
import Logo from "../../../../assets/icons/logo.svg";
import { useChat } from "./useChat";
import uuid from 'react-native-uuid';
import ReactNativeModal from "react-native-modal";
import Toast from "react-native-toast-message";

const ChatScreen:FC<RootStackScreenProps<"Chat">> = () => {
    const dispatch = useDispatch();
    const flatlistRef = useRef<FlatList>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { messageValues } = useChat();
    const {users} = useAppSelector(state => state.database);
    const {isLoading} = useAppSelector(state => state.loading);
    const { jid:currentChat, type: currentChatType } = useAppSelector(state => state.chatSlice);
    const {
        hostName,
        hostUrl,
        jid,
        password
      } = useAppSelector(state => state.user)

    const scrollToBottom = () => {
        flatlistRef.current?.scrollToEnd({ animated: true });
    };

    const handleConnect = async () => {
        dispatch(setLoading(true))
        await xmppService.connect({
            service: hostUrl,
            domain: hostName,
            resource: '',
            username: jid,
            password: password
        })
        dispatch(setLoading(false))
    }

    useEffect(() => {
        console.log(JSON.stringify(users, null, 2));
    }, [users]);

    useEffect(() => {
        const execute = async () => {
            if(xmppService.getXMPP() === null) {
                await handleConnect();
            }

            const res = await xmppService.getContacts();

            res.contacts.map((contact) => {
                dispatch(addChat({user: jid, with: contact.name}));
            });

            xmppService.listenForMessages((from, message) => {
                console.log(from, message);
                const parsedFrom = from.split("@")[0];
                dispatch(addMessage({user: jid, with: parsedFrom, message: {message, from: parsedFrom, uid: uuid.v4().toString()}}));
                if (currentChat !== parsedFrom) {
                    //custom toast
                    Toast.show({
                        type: "info",
                        text1: "New Message",
                        text2: `You have a new message from ${parsedFrom}`
                    });
                }
            });
        }

        if (jid) {
            execute();
            return () => {
                xmppService.disconnect();
            }
        }
    }, [jid]);

    useEffect(() => {
        scrollToBottom();
    }, [users[jid]?.chats[currentChat]?.messages]);

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
                    <TouchableOpacity
                        onPress={() => {
                            setIsMenuOpen(!isMenuOpen);
                        }}
                    >
                        <Menu
                            width={30}
                            height={30}
                        />
                    </TouchableOpacity>
                    <Text
                        style={{
                            fontSize: 20,
                            fontWeight: "bold",
                            color: "#fff"
                        }}
                    >Chat Screen</Text>

                </HeaderContainer>
                <ChatWrapper>
                    {currentChat ? (
                        <>
                            {!isLoading && (
                                <FlatList
                                    ref={flatlistRef}
                                    data={users[jid]?.chats[currentChat]?.messages}
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
                        </>
                    ):(
                        <NoChatWrapper>
                            <Logo
                            width={250}
                            height={150}
                            />
                            <NoChatText>
                                No chat selected
                            </NoChatText>
                        </NoChatWrapper>
                    )}
                    
                </ChatWrapper>
                {currentChat && (
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
                )}
            </ChatContainer>
            <ReactNativeModal
                isVisible={isMenuOpen}
                onBackdropPress={() => {
                    setIsMenuOpen(false);
                }}
                onBackButtonPress={() => {
                    setIsMenuOpen(false);
                }}

                style={{
                    justifyContent: 'flex-start',
                    margin: 0
                }}

                animationIn="slideInLeft"
                animationOut="slideOutLeft"
            >
                <MenuContainer>
                    <UserStatusWrapper>
                        <UserStatusContainer>
                            <Text
                                style={{
                                    color: "#000",
                                    fontSize: 20,
                                    fontWeight: "bold"
                                }}
                            >
                                Connected as:
                            </Text>
                            <Text
                                style={{
                                    color: "#000",
                                    fontSize: 18,
                                }}
                            >
                                {jid}
                            </Text>
                            <Text
                                style={{
                                    color: "#000",
                                    fontSize: 10,
                                }}
                            >
                                {hostName}
                            </Text>
                        </UserStatusContainer>
                        <LogoutButton>
                            <Off
                                width={20}
                                height={20}
                                onPress={handleLogout}
                            />
                        </LogoutButton>
                    </UserStatusWrapper>
                    <ContactsContainer>
                        <SectionTitleContainer>
                            <Text
                                style={{
                                    color: "#000",
                                    fontSize: 20,
                                    fontWeight: "bold"
                                }}
                            >
                                Chats
                            </Text>
                            <AddButton>
                                <Plus
                                    width={15}
                                    height={15}
                                />
                            </AddButton>
                        </SectionTitleContainer>
                        <FlatList
                            data={Object.keys(users[jid]?.chats)}
                            renderItem={({item}) => {
                                return (
                                    <ContactItem
                                        onPress={() => {
                                            dispatch(setCurrentChat({jid: item}));
                                            setIsMenuOpen(false);
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: "#000",
                                                fontSize: 18,
                                            }}
                                        >
                                            {item}
                                        </Text>
                                    </ContactItem>
                                )
                            }}
                            keyExtractor={(item) => item}
                            ItemSeparatorComponent={() => {
                                return (
                                    <View
                                        style={{
                                            height: 5,
                                        }}
                                    />
                                )
                            }}
                        />
                    </ContactsContainer>
                    <ContactsContainer>
                        <SectionTitleContainer>
                            <Text
                                style={{
                                    color: "#000",
                                    fontSize: 20,
                                    fontWeight: "bold"
                                }}
                            >
                                Groups
                            </Text>
                            <AddButton>
                                <Plus
                                    width={15}
                                    height={15}
                                />
                            </AddButton>
                        </SectionTitleContainer>
                    </ContactsContainer>
                    <Button
                        text = "Clear Chats"
                        onPress={() => {
                            dispatch(clearChats(jid));
                        }}
                    />
                </MenuContainer>
            </ReactNativeModal>
        </AppBackground>
    )
}

export default ChatScreen;