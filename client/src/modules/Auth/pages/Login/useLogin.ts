import * as yup from 'yup';
import { useFormik } from 'formik';
import xmppService from '../../../../utils/xmpp';
import { useDispatch } from 'react-redux';
import { changeAppState, registerUser, setLoading, setUser } from '@store/';

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
        onSubmit: values => {
            dispatch(setLoading(true));
            const credentials = {
                service: values.serverUrl,
                domain: values.serverName,
                resource: '',
                username: values.jid,
                password: values.password,
            };
            let error = false;
            try{
                xmppService.connect(credentials); 
            } catch(e){
                console.error(e);
                error = true;
            }
             
            if(!error){
                dispatch(setUser({
                    jid: values.jid,
                    hostUrl: values.serverUrl,
                    hostName: values.serverName,
                    password: values.password
                }));
                dispatch(changeAppState({appNavigationState: 'LOGGED_IN'}));
                dispatch(registerUser(values.jid));
            }
            dispatch(setLoading(false));
        },
    });
    
    return {
        loginValues,
    };
}