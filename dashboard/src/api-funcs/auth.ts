import Cookies from 'js-cookie';
import useSWR from 'swr';
import validate from "../util/validate";
import { authFetcher } from "./fetchers";

import { dashboard } from "./fetchers";

export const postUser = async(type: 'login' | 'signup', email: string, password: string) => {
    const inputValidation = validate({ target: 'Email', value: email }, { target: 'Password', value: password, min: 8 });

    const validationFilter = inputValidation.filter((value) => value.msgs ? value.msgs.length > 0 : '');
    
    if(validationFilter.length > 0) {
        return false;
    }

    try {
        const res = await dashboard.post(`/auth/${type}`, { email: email, password: password });
        if(!res) {
            return false;
        }
        if(res.data.errors) {
            return;
        }
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

export const postLogout = async() => {
    try {
        const res = await dashboard.post(`/auth/logout`);
        if(!res) {
            return false;
        }
        Cookies.remove('dash-auth-token');
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

export const useUser = () => {
    const { data, isLoading, error } = useSWR('/auth/user', authFetcher, { revalidateOnFocus: false, shouldRetryOnError: false });
    return { data, isLoading, error };
}