import Cookies from 'js-cookie';
import validate from "@/util/validate";
import useSWR, { mutate } from 'swr';
import { authFetcher } from "./fetchers";

import { dashboard } from "./fetchers";

const authKey = 'dash-auth-token';

export const createProject = async(projectName: string) : Promise<string | string[]> => {
    const validateProjectName = validate({ target: 'Name', value: projectName, min: 5, max: 35 });
    const validatedProjectName = validateProjectName[0];
    if(validatedProjectName.msgs) {
        return validatedProjectName.msgs;
    }
    const authToken = Cookies.get(authKey);
    if(!authToken) {
        return ['No auth token'];
    }
    try {
        const res = await dashboard.post('/create', { name: validatedProjectName.sanitizedValue });
        if(!res || res.status !== 201) {
            return ['There was a server error'];
        }
        return res.data.projectId;
    } catch (e) {
        return ['There was a server error'];
    }
}

export const deleteProject = async(projectId: string) : Promise<boolean> => {
    const authToken = Cookies.get(authKey);
    if(!authToken) {
        return false;
    }
    try {
        const res = await dashboard.delete(`/project/${projectId}/remove`);
        if(!res || res.status !== 205) {
            return false;
        }
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

export const generateSecret = async(projectId: string) : Promise<string | false> => {
    const authToken = Cookies.get(authKey);
    if(!authToken || authToken.length < 1) {
        return false;
    }
    try {
        const res = await dashboard.put(`/project/${projectId}/generate-secret`);
        if(!res || res.status !== 201) {
            return false;
        }
        return res.data.clientSecret;
    } catch (e) {
        console.log(e);
        return false;
    }
}

export const putHost = async(projectId: string, host: string) : Promise<true | string> => {
    const authToken = Cookies.get(authKey);
    if(!authToken || authToken.length < 1) {
        return 'No auth token'
    }
    if(!host || !host.includes('http')) {
        console.log('here');
        return 'Must include "http" or "https" to be a valid host';
    }
    try {
        const res = await dashboard.put(`/project/${projectId}/set-host`, { host: host });
        if(!res || res.status !== 201) {
            return 'Server or client error';
        }
        return true;
    } catch (e) {
        console.log(e);
        return '';
    }
}

export const addCollaborator = async(projectId: string, email: string, permission: 'Admin' | 'Developer' | 'Support') => {
    const validateEmail = validate({ target: 'Email', value: email, });
    const validatedEmail = validateEmail[0];
    if(validatedEmail.msgs || !validatedEmail.sanitizedValue) {
        return validatedEmail.msgs;
    }
    if(!Cookies.get('dash-auth-token')) {
        return ['No auth token'];
    }
    try {
        const res = await dashboard.put(`/project/${projectId}/collaborators`, { email: validatedEmail.sanitizedValue, permission: permission });
        if(!res || res.status !== 201) {
            return ['There was an error'];
        }
        mutate(`/project/${projectId}`);
        return true;
    } catch (e) {
        console.log(e);
        return ['There was an error'];
    }
}

export const useProject = (id: string) => {
    const { data, isLoading, error } = useSWR(`/project/${id}`, authFetcher, {revalidateOnFocus: false });
    return { projectData: data, isProjectLoading: isLoading, projectError: error };
}

export const useProjects = () => {
    const { data, isLoading, error } = useSWR(`/projects`, authFetcher, { revalidateOnFocus: false });
    return { data, isLoading, error };
}