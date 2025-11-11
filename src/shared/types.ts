export interface DbCommandBase {
    name: string;
    class: string;
    type: string;
}

export interface DbCommandFetchApi extends DbCommandBase {
    type: "fetchApi";
    url: string;
    body?: any;
}

export interface DbCommandOpenUrl extends DbCommandBase {
    type: "openUrl";
    url: string;
}

export interface DbCommandExecute extends DbCommandBase {
    type: "execute";
    command: string;
}

export interface DbCommandGo extends DbCommandBase {
    type: "go";
    to: string;
}

export type DbCommand = DbCommandFetchApi | DbCommandOpenUrl | DbCommandExecute | DbCommandGo;