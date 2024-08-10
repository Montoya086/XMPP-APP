import * as yup from 'yup';
import { useFormik } from 'formik';
import xmppService from '../../../../utils/xmpp';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import { changeAppState, setUser } from '@store/';

export const useSignUp = () => {

    const dispatch = useDispatch();

    const validationSchema = yup.object().shape({
        jid: yup.string().required("JID is required"),
        password: yup.string().required("Password is required"),
        serverUrl: yup.string().required("Server URL is required"),
        serverName: yup.string().required("Server is required"),
    });

    const {...signUpValues} = useFormik({
        initialValues: {
            jid: "",
            password: "",
            serverUrl: "",
            serverName: ""
        },
        validationSchema,
        onSubmit: async values => {
            const rootUserConfig = {
                service: values.serverUrl,
                domain: values.serverName,
                resource: '',
                username: "mon21552-root",
                password: "test123",
            };

            const newUserConfig = {
                username: values.jid,
                password: values.password
            }
            const res = await xmppService.executeRegisterAndReconnect(rootUserConfig, newUserConfig)

            if (res.success){
                dispatch(setUser({
                    jid: values.jid,
                    hostUrl: values.serverUrl,
                    hostName: values.serverName,
                    password: values.password
                }));
                dispatch(changeAppState({appNavigationState: 'LOGGED_IN'}));
            } else {
                Toast.show({
                    type: "error",
                    text1: "Error",
                    text2: res.error
                })
            }

        },
    });
    
    return {
        signUpValues,
    };
}