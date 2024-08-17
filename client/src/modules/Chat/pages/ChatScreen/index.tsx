import { AppBackground, Button, CustomTextInput, SwitchButton } from "@components/";
import { FC, useEffect, useRef, useState } from "react";
import { FlatList, Keyboard, Linking, Text, TextInput, TouchableOpacity, View } from "react-native";
import { RootStackScreenProps } from "src/navigations/types/ScreenProps";
import xmppService from '../../../../utils/xmpp';
import { useDispatch } from "react-redux";
import { changeAppState, addMessage, removeUser, setUser, useAppSelector, clearChats, setLoading, addChat, setCurrentChat, changeStatus, incrementNonRead, resetNonRead, addMessageGroup } from "@store/";
import { AddButton, AddContactModalContainer, ChatBubble, ChatContainer, ChatWrapper, ContactItem, ContactItemNameStatus, ContactsContainer, FileButton, FileContainer, HeaderContainer, InputContainer, InputWrapper, LogoutButton, MenuContainer, NoChatText, NoChatWrapper, SectionTitleContainer, SendButton, StatusBall, StatusCard, UserStatusContainer, UserStatusWrapper } from "./styles";
import Send from "../../../../assets/icons/send.svg";
import Menu from "../../../../assets/icons/menu.svg";
import Off from "../../../../assets/icons/off.svg";
import Plus from "../../../../assets/icons/plus.svg";
import Logo from "../../../../assets/icons/logo.svg";
import Clip from "../../../../assets/icons/clip.svg";
import { useChat } from "./useChat";
import uuid from 'react-native-uuid';
import ReactNativeModal from "react-native-modal";
import Toast from "react-native-toast-message";
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import { Buffer } from 'buffer';

const ChatScreen:FC<RootStackScreenProps<"Chat">> = () => {
    const dispatch = useDispatch();
    const flatlistRef = useRef<FlatList>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAddContactOpen, setIsAddContactOpen] = useState(false);
    const [isChangeStatusOpen, setIsChangeStatusOpen] = useState(false);
    const [isServiceConnected, setIsServiceConnected] = useState(false);
    const [fileContent, setFileContent] = useState("")
    const [myStatus, setMyStatus] = useState<"online" | "away" | "xa" | "dnd" | "offline">("offline");
    const { messageValues, contactValues } = useChat({
        onContactSubmit: () => {
            setIsAddContactOpen(false);
        }
    });
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
    }

    const handleNotification = (from: string) => {
        if (currentChat !== from) {
            //custom toast
            Toast.show({
                type: "info",
                text1: "New Message",
                text2: `You have a new message from ${from}`
            });
            dispatch(incrementNonRead({user: jid, with: from}));
        }
    }

    useEffect(() => {
        console.log("DATABASE", JSON.stringify(users, null, 2));
    }, [users]);

    const handleGetContacts = async () => {
        const res = await xmppService.getContacts();
        console.log("RES", res);

        res.contacts.map((contact) => {
            dispatch(addChat({user: jid, with: contact.jid.split("@")[0]}));
        })

        
    }

    /* const handleGroupMessage = async (room: string, message?: string) => {
        const name = await xmppService.getGroupName(room)
        if (message){
            dispatch(addMessageGroup({
                user: jid,
                name: name || '',
                with: room,
                message: {
                    from
                }
            }))
        }
    }
 */
    // Connect to XMPP
    useEffect(() => {
        console.log("USE EFFECT", jid);
        const execute = async () => {
            console.log("EXECUTE", jid);
            if(xmppService.getXMPP() === null) {
                console.log("XMPP NOT CONNECTED, CONNECTING");
                setIsServiceConnected(false);
                await handleConnect();
                console.log("XMPP CONNECTED");
            } else {
                console.log("XMPP ALREADY CONNECTED");
            }
            xmppService.updatePresence("online");

            setTimeout(async () => {
                await handleGetContacts();
                xmppService.unblockPresence(jid);
                dispatch(setLoading(false))
                setIsServiceConnected(true);
            }, 2000);
        }

        if (jid) {
            execute();
        }
        return () => {
            setIsServiceConnected(false);
            xmppService.disconnect();
        }
    }, [jid]);

    // Listen for messages
    useEffect(() => {
        if (isServiceConnected && xmppService.getXMPP() !== null) {
            xmppService.removeStanzaListener();

            xmppService.listenForMessages((from, message, type, room) => {
                console.log(from, message, type);
                if (type === "single") {
                    const parsedFrom = from.split("@")[0];
                    dispatch(addMessage({user: jid, with: parsedFrom, message: {message, from: parsedFrom, uid: uuid.v4().toString()}}));
                    handleNotification(parsedFrom);

                } else {
                    if (room){
                        //handleGroupMessage(from, message)
                    }
                }
                xmppService.unblockPresence(from);
            });

            xmppService.listenForPresenceUpdates((status, from) => {
                if (from.split("@")[0] === jid) {
                    setMyStatus(status);
                    return;
                }
                dispatch(changeStatus({user: jid, with: from.split("@")[0], status}));
                xmppService.unblockPresence(from);
            });

            xmppService.listenForFileMessages((from, message) => {
                console.log(from, message);
                const parsedFrom = from.split("@")[0];
                dispatch(addMessage({user: jid, with: parsedFrom, message: {message, from: parsedFrom, uid: uuid.v4().toString()}}));
                handleNotification(parsedFrom);
                xmppService.unblockPresence(from);
            });
        }
    }, [currentChat, isServiceConnected]);

    // Scroll to bottom when new message is added
    useEffect(() => {
        scrollToBottom();
    }, [users[jid]?.chats[currentChat]?.messages]);

    // Scroll to bottom when keyboard
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

    const handleSelectFile = async () => {

        const res = await DocumentPicker.pick({
            type: [DocumentPicker.types.allFiles],
        });
        const file = res[0]
        if (file){
            console.log("File:", file)
            const fileBase64 = await RNFS.readFile(file.uri, 'base64');
            console.log('Selected file:', fileBase64);
            try {
                await xmppService.sendFile(currentChat+"@"+hostName, {
                    name: file.name || "",
                    type: file.type || "",
                    base64: fileBase64,
                })
                dispatch(addMessage({ 
                    user: jid, 
                    with:currentChat, 
                    message: { 
                        message: "file://"+fileBase64+"//"+file.name, 
                        from: jid, 
                        uid: uuid.v4().toString() 
                    } 
                }));
            } catch {
                Toast.show({
                    type: "error",
                    text1: "Error sending file",
                })
            }
        }
    }

    async function openDocument(contentUri: string) {
        try {
            const base64 = contentUri.replace("file://", "").split("//")[0]
            const decodedText = Buffer.from(base64, 'base64').toString('utf-8');
            console.log("TEXT", decodedText)
            setFileContent(decodedText)
        } catch (err) {
            console.error('Error reading file from URI:', err);
        }
    }

    return (
        <AppBackground isSafe>
            {/* Chat Screen */}
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
                    <TouchableOpacity
                        onPress={handleGetContacts}   
                    >
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: "bold",
                                color: "#fff"
                            }}
                        >
                            GetContacts
                        </Text>
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
                                                {item.message.startsWith('file://') ? (
                                                    <>
                                                        <Text
                                                            style={{
                                                                color: "#fff",
                                                                fontWeight: "bold"
                                                            }}
                                                        >
                                                            {item.from}
                                                        </Text>
                                                        <FileContainer
                                                            onPress={()=>{
                                                                openDocument(item.message)
                                                            }}
                                                        >
                                                            <Clip/>
                                                            <Text
                                                                style={{
                                                                    color: "#fff"
                                                                }}
                                                            >
                                                                Open: {item.message.replace("file://", "").split("//")[1]}
                                                            </Text>
                                                        </FileContainer>
                                                    </>
                                                ): (
                                                    <>
                                                        <Text
                                                            style={{
                                                                color: "#fff",
                                                                fontWeight: "bold"
                                                            }}
                                                        >
                                                            {item.from}
                                                        </Text>
                                                        <Text
                                                            style={{
                                                                color: "#fff"
                                                            }}
                                                        >
                                                            {item.message}
                                                        </Text>
                                                    </>
                                                )}
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
                        <FileButton
                            onPress={handleSelectFile}
                        >
                            <Clip
                                width={30}
                                height={30}
                            />
                        </FileButton>
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
            {/* Menu Modal*/}
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
                        <UserStatusContainer
                            onPress={() => {
                                setIsChangeStatusOpen(true);
                            }}
                        >
                            <Text
                                style={{
                                    color: "#000",
                                    fontSize: 20,
                                    fontWeight: "bold"
                                }}
                            >
                                Connected as:
                            </Text>
                            <ContactItemNameStatus>
                                <Text
                                    style={{
                                        color: "#000",
                                        fontSize: 18,
                                    }}
                                >
                                    {jid}
                                </Text>
                                <StatusBall
                                    status={myStatus}
                                />
                            </ContactItemNameStatus>
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
                            <AddButton
                                onPress={() => {
                                    setIsAddContactOpen(true);
                                }}
                            >
                                <Plus
                                    width={15}
                                    height={15}
                                />
                            </AddButton>
                        </SectionTitleContainer>
                        <FlatList
                            scrollEnabled
                            data={Object.keys(users[jid]?.chats)}
                            renderItem={({item}) => {
                                return (
                                    
                                    <ContactItem
                                        onPress={() => {
                                            dispatch(setCurrentChat({jid: item}));
                                            dispatch(resetNonRead({user: jid, with: item}));
                                            setIsMenuOpen(false);
                                        }}
                                        isSelected={currentChat === item}
                                    >
                                        <ContactItemNameStatus>
                                            <Text
                                                style={{
                                                    color: "#000",
                                                    fontSize: 18,
                                                }}
                                            >
                                                {item}
                                            </Text>
                                            <StatusBall
                                                status={users[jid]?.chats[item]?.status || "offline"}
                                            />
                                        </ContactItemNameStatus>
                                        <Text
                                            style={{
                                                color: "#000",
                                                fontSize: 10,
                                            }}
                                        >
                                            {users[jid]?.chats[item]?.nonRead || 0} new messages
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
            {/* Add Contact Modal */}
            <ReactNativeModal
                isVisible={isAddContactOpen}
                onBackdropPress={() => {
                    setIsAddContactOpen(false);
                }}
                onBackButtonPress={() => {
                    setIsAddContactOpen(false);
                }}

                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: 0,
                    flexDirection: 'row',
                }}

                animationIn="slideInUp"
                animationOut="slideOutDown"
            >
                <AddContactModalContainer>
                    <CustomTextInput
                        textInputProps={{
                            placeholder: "Enter contact jid",
                            value: contactValues.values.contact,
                            onChangeText: contactValues.handleChange("contact"),
                        }}
                    />
                    <Button
                        text = "Add Contact"
                        onPress={contactValues.handleSubmit}
                    />
                </AddContactModalContainer>
            </ReactNativeModal>
            {/* Change Status Modal */}
            <ReactNativeModal
                isVisible={isChangeStatusOpen}
                onBackdropPress={() => {
                    setIsChangeStatusOpen(false);
                }}
                onBackButtonPress={() => {
                    setIsChangeStatusOpen(false);
                }}

                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: 0,
                    flexDirection: 'row',
                }}

                animationIn="slideInUp"
                animationOut="slideOutDown"
            >
                <AddContactModalContainer>
                    <SwitchButton
                        text1="Status"
                        text2="Notifications"
                        onPress={()=>{}}
                    />
                    <StatusCard
                        onPress={() => {
                            xmppService.updatePresence("online");
                            setIsChangeStatusOpen(false);
                        }}
                    >
                        <Text>
                            Online
                        </Text>
                        <StatusBall
                            status="online"
                        />
                    </StatusCard>
                    <StatusCard
                        onPress={() => {
                            xmppService.updatePresence("away");
                            setIsChangeStatusOpen(false);
                        }}
                    >
                        <Text>
                            Away
                        </Text>
                        <StatusBall
                            status="away"
                        />
                    </StatusCard>
                    <StatusCard
                        onPress={() => {
                            xmppService.updatePresence("xa");
                            setIsChangeStatusOpen(false);
                        }}
                    >
                        <Text>
                            Extended Away
                        </Text>
                        <StatusBall
                            status="xa"
                        />
                    </StatusCard>
                    <StatusCard
                        onPress={() => {
                            xmppService.updatePresence("dnd");
                            setIsChangeStatusOpen(false);
                        }}
                    >
                        <Text>
                            Do Not Disturb
                        </Text>
                        <StatusBall
                            status="dnd"
                        />
                    </StatusCard>
                </AddContactModalContainer>
            </ReactNativeModal>
            {/* File content */}
            <ReactNativeModal
                isVisible={!!fileContent}
                onBackdropPress={() => {
                    setFileContent("")
                }}
                onBackButtonPress={() => {
                    setFileContent("")
                }}

                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: 0,
                    flexDirection: 'row',
                }}

                animationIn="slideInUp"
                animationOut="slideOutDown"
            >
                <AddContactModalContainer>
                    <TextInput
                        style={{
                            width: "100%"
                        }}
                        multiline
                        accessible={false}
                        value={fileContent}
                    />
                </AddContactModalContainer>
            </ReactNativeModal>
        </AppBackground>
    )
}

export default ChatScreen;