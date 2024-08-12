import { useFormik } from 'formik';
import xmppService from '../../../../utils/xmpp';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';
import uuid from 'react-native-uuid';
import { useDispatch } from 'react-redux';
import { addChat, useAppSelector } from '@store/';
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
    const {jid: currentChat} = useAppSelector(state => state.chatSlice);

    const {...messageValues} = useFormik({
        initialValues: {
            message: "",
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            try{
                sendMessage(values.message, currentChat+"@"+hostName);
                dispatch(addMessage({ 
                    user: jid, 
                    with:currentChat, 
                    message: { 
                        message: values.message, 
                        from: jid, 
                        uid: uuid.v4().toString() 
                    } 
                }));

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

    const sendMessage = (message: string, to: string) => {
        xmppService.sendMessage(to, message);
    }

    const addContact = (jid: string) => {
        xmppService.addContact(jid);
    }

    return {
        messageValues,
        contactValues
    }
}