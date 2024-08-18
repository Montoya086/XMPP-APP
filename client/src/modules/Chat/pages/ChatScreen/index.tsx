import { AppBackground, Button, CustomTextInput, SwitchButton } from "@components/";
import { FC, useEffect, useRef, useState } from "react";
import { FlatList, Keyboard, Linking, Text, TextInput, TouchableOpacity, View } from "react-native";
import { RootStackScreenProps } from "src/navigations/types/ScreenProps";
import xmppService from '../../../../utils/xmpp';
import { useDispatch } from "react-redux";
import { changeAppState, addMessage, removeUser, setUser, useAppSelector, clearChats, setLoading, addChat, setCurrentChat, changeStatus, incrementNonRead, resetNonRead, addMessageGroup, addNotification, removeNotification, GroupMessage, addChatGroup, registerUserGroup, resetNonReadGroup, incrementNonReadGroup, deleteNotificationAccount, deleteDatabaseAccount, setStatusMessage } from "@store/";
import { AcceptButton, AddButton, AddContactModalContainer, ChatBubble, ChatContainer, ChatInfoStatusContainer, ChatWrapper, ContactItem, ContactItemNameStatus, ContactsContainer, FileButton, FileContainer, HeaderContainer, InputContainer, InputWrapper, LogoutButton, MenuContainer, NoChatText, NoChatWrapper, NotificationButtonsContainer, NotificationContainer, NotificationTextContainer, RejectButton, SectionTitleContainer, SendButton, SendStatusMessageButton, StatusBall, StatusCard, StatusMessageContainer, UserStatusContainer, UserStatusWrapper } from "./styles";
import Send from "../../../../assets/icons/send.svg";
import Menu from "../../../../assets/icons/menu.svg";
import Off from "../../../../assets/icons/off.svg";
import Plus from "../../../../assets/icons/plus.svg";
import Logo from "../../../../assets/icons/logo.svg";
import Clip from "../../../../assets/icons/clip.svg";
import Info from "../../../../assets/icons/info.svg"
import { useChat } from "./useChat";
import uuid from 'react-native-uuid';
import ReactNativeModal from "react-native-modal";
import Toast from "react-native-toast-message";
import DocumentPicker from 'react-native-document-picker';
import RNFS, { stat } from 'react-native-fs';
import { Buffer } from 'buffer';
import Autolink from 'react-native-autolink';

const ChatScreen:FC<RootStackScreenProps<"Chat">> = () => {
    const dispatch = useDispatch();
    const flatlistRef = useRef<FlatList>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAddContactOpen, setIsAddContactOpen] = useState(false);
    const [isChangeStatusOpen, setIsChangeStatusOpen] = useState(false);
    const [isServiceConnected, setIsServiceConnected] = useState(false);
    const [statusSwitchState, setStatusSwitchState] = useState(false);
    const [userInfo, setUserInfo] = useState(false)
    const [fileContent, setFileContent] = useState("")
    const [myStatus, setMyStatus] = useState<"online" | "away" | "xa" | "dnd" | "offline">("offline");
    const [myStatusMessage, setMyStatusMessage] = useState("")
    const { messageValues, contactValues } = useChat({
        onContactSubmit: () => {
            setIsAddContactOpen(false);
        }
    });
    const {users} = useAppSelector(state => state.database);
    const { users:groupUsers } = useAppSelector(state => state.groupDatabase)
    const {isLoading} = useAppSelector(state => state.loading);
    const { jid:currentChat, type: currentChatType, name: currentChatName } = useAppSelector(state => state.chatSlice);
    const {
        content: notifications
    } = useAppSelector(state => state.notificationsSlice) 
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
        console.log("GROUP DATABASE", JSON.stringify(groupUsers, null, 2))
    }, [users, groupUsers]);

    const handleGetContacts = async () => {
        const res = await xmppService.getContacts();
        console.log("RES", res);

        res.contacts.map((contact) => {
            dispatch(addChat({user: jid, with: contact.jid.split("@")[0]}));
        })

        
    }
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
                dispatch(registerUserGroup(jid))
                await handleGetContacts();
                xmppService.unblockPresence(jid, true);
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

    const handleCreateNotification = async (from: string, roomJid: string) =>{
        console.log("ROOMJID FROM NOTI: ", roomJid)
        const groupName = await xmppService.getGroupName(roomJid)
        if(groupName){
            dispatch(addNotification({
                from,
                jid,
                name: groupName,
                roomJid: roomJid
            }))
            Toast.show({
                type: "info",
                text1: "New Notification",
                text2: `You have a new notification`
            });
        }
    }

    const handleNewChatGroup = async (roomJid:string, chatGroupMessage:GroupMessage) => {
        dispatch(addMessageGroup({
            user: jid,
            with: roomJid,
            name: roomJid,
            message: chatGroupMessage
        }))
        dispatch(incrementNonReadGroup({user: jid, with: roomJid}));
    }

    // Listen for messages
    useEffect(() => {
        if (isServiceConnected && xmppService.getXMPP() !== null) {
            xmppService.removeStanzaListener();

            xmppService.listenForMessages((from, message, type, room) => {
                console.log("MESSAGE: ", from, message, type);
                if (type === "single") {
                    const parsedFrom = from.split("@")[0];
                    dispatch(addMessage({user: jid, with: parsedFrom, message: {message, from: parsedFrom, uid: uuid.v4().toString()}}));
                    handleNotification(parsedFrom);
                    xmppService.unblockPresence(from);
                } else {
                    if (room){
                        handleNewChatGroup(
                            room,
                            {
                                from,
                                message,
                                uid: uuid.v4().toString()
                            },
                            
                        )
                    }
                }
            });

            xmppService.listenForPresenceUpdates((status, from, statusMessage) => {
                if(statusMessage && jid != from.split("@")[0]){
                    dispatch(setStatusMessage({
                        user: jid, 
                        with: from.split("@")[0],
                        statusMessage
                    }))
                }
                if (from.split("@")[1]?.split(".")[0] == "conference"){
                    return
                }

                if (from.split("@")[0] === jid) {
                    setMyStatus(status);
                    if(statusMessage){
                        setMyStatusMessage(statusMessage)
                    }
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

            xmppService.listenForGroupChatInvitations((from, roomJid)=>{
                handleCreateNotification(from, roomJid)
            })
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

    const acceptGroupChatInvitation = async (groupJid: string, index: number, groupName: string) =>{
        try{
            dispatch(addChatGroup({
                name: groupName,
                user: jid,
                with: groupJid
            }))
            await xmppService.acceptGroupChatInvitation(groupJid, jid)
            dispatch(removeNotification({
                jid,
                index
            }))
        }catch{
            Toast.show({
                type: "error",
                text1: "Error accepting groupchat"
            })
        }
    }

    const handleDeleteAccount = () =>{
        dispatch(deleteNotificationAccount(jid))
        dispatch(deleteDatabaseAccount(jid))
        handleLogout()
    }

    const handleFetchUserInfo = async()=> {
        setUserInfo(true)
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
                    <Text
                        style={{
                            fontSize: 20,
                            fontWeight: "bold",
                            color: "#fff"
                        }}
                    >
                        {currentChatName}
                    </Text>
                    {currentChatType === "single" && (
                        <TouchableOpacity
                            onPress={handleFetchUserInfo}
                        >
                            <Info
                                width={30}
                                height={30}
                            />
                        </TouchableOpacity>
                    )}

                </HeaderContainer>
                <ChatWrapper>
                    {currentChat ? (
                        <>
                            {!isLoading && (
                                <FlatList
                                    ref={flatlistRef}
                                    data={currentChatType == "single" ? users[jid]?.chats[currentChat]?.messages : groupUsers[jid]?.chats[currentChat]?.messages}
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
                                                        <Autolink
                                                            text={item.message}
                                                            onPress={(url) => Linking.openURL(url)}
                                                            linkStyle={{ color: 'blue', textDecorationLine: 'underline' }}
                                                            textProps={{
                                                                style:{
                                                                    color: "#fff"
                                                                }
                                                            }}
                                                        />
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
                        {!!users[jid]?.chats && (
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
                        )}
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
                        </SectionTitleContainer>
                        {!!groupUsers[jid]?.chats && (
                            <FlatList
                                scrollEnabled
                                data={Object.keys(groupUsers[jid]?.chats)}
                                renderItem={({item}) => {
                                    return (
                                        
                                        <ContactItem
                                            onPress={() => {
                                                dispatch(setCurrentChat({jid: item, type: "group", name: groupUsers[jid]?.chats[item].name}));
                                                dispatch(resetNonReadGroup({user: jid, with: item}));
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
                                                    {groupUsers[jid]?.chats[item].name}
                                                </Text>
                                            </ContactItemNameStatus>
                                            <Text
                                                style={{
                                                    color: "#000",
                                                    fontSize: 10,
                                                }}
                                            >
                                                {groupUsers[jid]?.chats[item]?.nonRead || 0} new messages
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
                        )}
                    </ContactsContainer>
                    <Button
                        text = "Delete account"
                        onPress={() => {
                            xmppService.deleteAccount()
                            handleDeleteAccount()
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
                        current={statusSwitchState}
                        onPress={()=>{
                            setStatusSwitchState(!statusSwitchState)
                        }}
                    />
                    {statusSwitchState ? (
                        <>
                            <FlatList
                                data={notifications[jid]}
                                renderItem={({item, index})=>{
                                    return (
                                        <NotificationContainer>
                                            <NotificationTextContainer>
                                                <Text
                                                    style={{
                                                        color: "#000"
                                                    }}
                                                >
                                                    {item.from.split("@")[0]+" has invited you to "+"'"+item.name+"'"}
                                                </Text>
                                            </NotificationTextContainer>
                                            <NotificationButtonsContainer>
                                                <AcceptButton
                                                    onPress={()=>{
                                                        acceptGroupChatInvitation(item.roomJid, index, item.name)
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            color: "#fff",
                                                            fontWeight: "bold"
                                                        }}
                                                    >
                                                        Accept
                                                    </Text>
                                                </AcceptButton>
                                                <RejectButton
                                                    onPress={()=>{
                                                        dispatch(removeNotification({
                                                            jid,
                                                            index
                                                        }))
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            color: "#fff",
                                                            fontWeight: "bold"
                                                        }}
                                                    >
                                                        Reject
                                                    </Text>
                                                </RejectButton>
                                            </NotificationButtonsContainer>
                                        </NotificationContainer>
                                    )
                                }}
                            />
                        </>
                    ):(
                        <>
                            <StatusCard
                                onPress={() => {
                                    xmppService.updatePresence("online", myStatusMessage);
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
                                    xmppService.updatePresence("away", myStatusMessage);
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
                                    xmppService.updatePresence("xa", myStatusMessage);
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
                                    xmppService.updatePresence("dnd", myStatusMessage);
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
                            <StatusMessageContainer>
                                <CustomTextInput
                                    textInputProps={{
                                        value: myStatusMessage,
                                        placeholder: "My status...",
                                        onChangeText: (value)=>{
                                            setMyStatusMessage(value)
                                        }
                                    }}
                                />
                                <SendStatusMessageButton
                                    onPress={()=>{
                                        xmppService.updatePresence(myStatus, myStatusMessage)
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: "#fff",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        Send
                                    </Text>
                                </SendStatusMessageButton>
                            </StatusMessageContainer>
                        </>
                    )}
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
            {/* UserInfo modal */}
            <ReactNativeModal
                isVisible={!!userInfo}
                onBackdropPress={() => {
                    setUserInfo(false)
                }}
                onBackButtonPress={() => {
                    setUserInfo(false)
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
                    <Text
                        style={{
                            color: "#000",
                            fontSize: 32,
                        }}
                    >
                        {currentChat}
                    </Text>
                    <ChatInfoStatusContainer>
                        <Text
                            style={{
                                color: "#000",
                                fontSize: 18,
                            }}
                        >
                            {users[jid]?.chats[currentChat]?.status || "offline"}
                        </Text>
                        <StatusBall
                            status={users[jid]?.chats[currentChat]?.status || "offline"}
                        />
                    </ChatInfoStatusContainer>
                    <Text
                        style={{
                            color: "#000",
                            fontSize: 18,
                        }}
                    >
                        {"\""+users[jid]?.chats[currentChat]?.statusMessage+"\"" || "No status"}
                    </Text>
                </AddContactModalContainer>
            </ReactNativeModal>
        </AppBackground>
    )
}

export default ChatScreen;