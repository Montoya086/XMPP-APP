import { useFormik } from 'formik';
import xmppService from '../../../../utils/xmpp';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';
import uuid from 'react-native-uuid';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@store/';
import { addMessage } from '@store/';

export const useChat = () => {

    const validationSchema = Yup.object({
        message: Yup.string().required("Message is required"),
    });

    const dispatch = useDispatch();
    const { jid } = useAppSelector(state => state.user);
    const {jid: currentChat} = useAppSelector(state => state.chatSlice);

    const {...messageValues} = useFormik({
        initialValues: {
            message: "",
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            try{
                sendMessage(values.message, currentChat);
                dispatch(addMessage({ user: jid, with: "mon21552", message: { message: values.message, from: jid, uid: uuid.v4().toString() } }));
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

    const sendMessage = (message: string, to: string) => {
        xmppService.sendMessage(to, message);
    }

    const addContact = (jid: string) => {

    }

    return {
        messageValues,
    }
}