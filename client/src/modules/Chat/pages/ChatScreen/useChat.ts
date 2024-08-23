import { useFormik } from 'formik';
import xmppService from '../../../../utils/xmpp';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';
import uuid from 'react-native-uuid';
import { useDispatch } from 'react-redux';
import { addChat, addChatGroup, addGroup, addMessageGroup, useAppSelector } from '@store/';
import { addMessage } from '@store/';

interface UseChat {
    onContactSubmit: () => void;
}

export const useChat = ({
    onContactSubmit
}:UseChat) => {

    const validationSchema = Yup.object({
        message: Yup.string().required("Message is required"),
    });

    const dispatch = useDispatch();
    const { jid, hostName } = useAppSelector(state => state.user);
    const {jid: currentChat, type: currentChatType} = useAppSelector(state => state.chatSlice);

    const {...messageValues} = useFormik({
        initialValues: {
            message: "",
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            try{
                sendMessage(values.message, currentChatType === "single" ? currentChat+"@"+hostName : currentChat, currentChatType as any);
                if (currentChatType === "single"){
                    dispatch(addMessage({ 
                        user: jid, 
                        with:currentChat, 
                        message: { 
                            message: values.message, 
                            from: jid, 
                            uid: uuid.v4().toString() 
                        } 
                    }));
                }

            } catch (error: any) {
                Toast.show({
                    type: "error",
                    text1: "Error",
                    text2: error.message
                })
            } finally {
                messageValues.resetForm();
            }
            
        }
    });

    const contactValidationSchema = Yup.object({
        contact: Yup.string().required("Contact jid is required"),
    });

    const {...contactValues} = useFormik({
        initialValues: {
            contact: "",
        },
        validationSchema: contactValidationSchema,
        onSubmit: (values) => {
            try{
                addContact(values.contact + "@" + hostName);
                Toast.show({
                    type: "success",
                    text1: "Success",
                    text2: "Contact added successfully"
                })
                dispatch(addChat({
                    user: jid,
                    with: values.contact,
                }));
            } catch (error: any) {
                Toast.show({
                    type: "error",
                    text1: "Error",
                    text2: error.message
                })
            } finally {
                contactValues.resetForm();
                onContactSubmit();
            }
            
        }
    });

    const groupValidationSchema = Yup.object({
        name: Yup.string().required("Group name is required"),
    });

    const {...groupValues} = useFormik({
        initialValues: {
            name: "",
        },
        validationSchema: groupValidationSchema,
        onSubmit: async (values) => {
            try{
                const groupName = await xmppService.createGroup(
                    values.name,
                    jid,
                    hostName
                )

                dispatch(addGroup({
                    user: jid,
                    group: {
                        jid: groupName
                    }
                }))
                dispatch(addChatGroup({
                    user: jid,
                    with: groupName,
                    name: values.name
                }))
                await xmppService.acceptGroupChatInvitation(groupName, jid);
                Toast.show({
                    type: "success",
                    text1: "Success",
                    text2: "Group created successfully"
                })
            } catch (error: any) {
                Toast.show({
                    type: "error",
                    text1: "Error",
                    text2: error.message
                })
            }
        }
    });

    const groupAddUserValidationSchema = Yup.object({
        user: Yup.string().required("User jid is required"),
    });

    const {...groupAddUserValues} = useFormik({
        initialValues: {
            user: "",
        },
        validationSchema: groupAddUserValidationSchema,
        onSubmit: async (values) => {
            try{
                await xmppService.sendGroupInvitation(
                    currentChat,
                    values.user + "@" + hostName
                )
                Toast.show({
                    type: "success",
                    text1: "Success",
                    text2: "User added successfully"
                })
            } catch (error: any) {
                Toast.show({
                    type: "error",
                    text1: "Error",
                    text2: error.message
                })
            }
        }
    });

    const sendMessage = (message: string, to: string, chatType: "single"| "group") => {
        xmppService.sendMessage(to, message, chatType);
    }

    const addContact = (jid: string) => {
        xmppService.addContact(jid);
    }

    return {
        messageValues,
        contactValues,
        groupValues,
        groupAddUserValues
    }
}