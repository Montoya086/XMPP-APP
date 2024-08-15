import * as yup from 'yup';
import { useFormik } from 'formik';
import xmppService from '../../../../utils/xmpp';
import { useDispatch } from 'react-redux';
import { changeAppState, registerUser, registerUserGroup, setLoading, setUser } from '@store/';
import Toast from 'react-native-toast-message';

export const useLogin = () => {
    const validationSchema = yup.object().shape({
        jid: yup.string().required("JID is required"),
        password: yup.string().required("Password is required"),
        serverUrl: yup.string().required("Server URL is required"),
        serverName: yup.string().required("Server is required"),
    });

    const dispatch = useDispatch();

    const {...loginValues} = useFormik({
        initialValues: {
            jid: "",
            password: "",
            serverUrl: "",
            serverName: "",
        },
        validationSchema,
        onSubmit: async values => {
            dispatch(setLoading(true));
            const credentials = {
                service: values.serverUrl,
                domain: values.serverName,
                resource: '',
                username: values.jid,
                password: values.password,
            };
            try{
                await xmppService.connect(credentials); 
                dispatch(setUser({
                    jid: values.jid,
                    hostUrl: values.serverUrl,
                    hostName: values.serverName,
                    password: values.password
                }));
                dispatch(registerUser(values.jid));
                dispatch(registerUserGroup(values.jid))
                setTimeout(()=>{
                    dispatch(changeAppState({appNavigationState: 'LOGGED_IN'}));
                },1000)
            } catch(e:any){
                xmppService.disconnect()
                console.error(e);
                Toast.show({
                    "type": "error",
                    "text1": e.message
                })
            } finally {
                dispatch(setLoading(false));
            }
            
        },
    });
    
    return {
        loginValues,
    };
}