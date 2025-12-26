import { FRONTEND_getElectivoList } from "../../services/electivo.service.js";
import { useState } from "react";
import { FRONTEND_getUserList } from "../../services/user.service.js";

export const useGetElectivoNames = () => {
    const [electivoNames, setElectivoNames] = useState([]);

    const fetchElectivoNames = async () => {
        try {
            const data = await FRONTEND_getElectivoList();
            setElectivoNames(data);
        } catch (error) {
            setElectivoNames([]);
        } 
    };
    return { electivoNames, fetchElectivoNames };
};


export const useGetUserNames = () => {
    const [userNames, setUserNames] = useState([]);

    const fetchUserNames = async () => {
        try {
            const data = await FRONTEND_getUserList();
            setUserNames(data);
        } catch (error) {
            setUserNames([]);
        } 
    };
    return { userNames, fetchUserNames };
};
