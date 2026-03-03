import React from 'react';
import {DatabaseContextType} from "@/providers/DatabaseContextType";

const DatabaseContext = React.createContext<DatabaseContextType | undefined>(
    undefined
);

export default DatabaseContext;
