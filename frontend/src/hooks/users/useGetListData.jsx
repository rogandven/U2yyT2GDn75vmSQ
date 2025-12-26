import { useState } from 'react';
import { FRONTEND_getUserList } from '../../services/user.service.js';

export const useGetUserNames = () => { 
    const [userNames, setUserNames] = useState([]);
    
    const fetchUserNames = async () => {
        try {
            const data = await FRONTEND_getUserList();
            console.log(data);
            setUserNames(data);
        } catch (error) {
            console.error("Error consiguiendo usuarios:", error);
        }
    };

    return { userNames, setUserNames, fetchUserNames };
}

export const useGetElectivoNames = () => { 
    const [electivoNames, setElectivoNames] = useState([]);
    
    const fetchElectivoNames = async () => {
        try {
            const data = await FRONTEND_getUserList();
            setElectivoNames(data);
        } catch (error) {
            console.error("Error consiguiendo usuarios:", error);
        }
    };

    return {electivoNames, setElectivoNames, fetchElectivoNames };
}

export default useGetUserNames;