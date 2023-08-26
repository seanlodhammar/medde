import { ProjectInterface } from "./dashboard-types";
import React, { SetStateAction } from "react";

export interface User { 
    email: string; 
    id: string; 
    projects: ProjectInterface[];
}

export interface AuthContextInterface {
    authenticate: (type: 'login' | 'signup', email: string, password: string) => Promise<boolean>;
    user: User | undefined | React.Dispatch<SetStateAction<User | undefined>>;
}

