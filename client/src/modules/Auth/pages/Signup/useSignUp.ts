import * as yup from 'yup';
import { useFormik } from 'formik';

export const useSignUp = () => {
    const validationSchema = yup.object().shape({
        jid: yup.string().required("JID is required"),
        password: yup.string().required("Password is required"),
        serverUrl: yup.string().required("Server URL is required"),
        serverName: yup.string().required("Server is required"),
        email: yup.string().email("Invalid email").required("Email is required"),
    });

    const {...signUpValues} = useFormik({
        initialValues: {
            jid: "",
            password: "",
            serverUrl: "",
            serverName: "",
            email: "",
        },
        validationSchema,
        onSubmit: values => {
            console.log(values);
        },
    });
    
    return {
        signUpValues,
    };
}