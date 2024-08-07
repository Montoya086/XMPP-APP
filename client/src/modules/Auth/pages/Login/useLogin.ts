import * as yup from 'yup';
import { useFormik } from 'formik';
import xmppService from '../../../../utils/xmpp';

export const useLogin = () => {
    const validationSchema = yup.object().shape({
        jid: yup.string().required("JID is required"),
        password: yup.string().required("Password is required"),
        serverUrl: yup.string().required("Server URL is required"),
        serverName: yup.string().required("Server is required"),
    });

    const {...loginValues} = useFormik({
        initialValues: {
            jid: "",
            password: "",
            serverUrl: "",
            serverName: "",
        },
        validationSchema,
        onSubmit: values => {
            const credentials = {
                service: values.serverUrl,
                domain: values.serverName,
                resource: '',
                username: values.jid,
                password: values.password,
              };
              xmppService.connect(credentials);
        },
    });
    
    return {
        loginValues,
    };
}