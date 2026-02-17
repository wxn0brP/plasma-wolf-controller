import { ValtheraCreate } from "@wxn0brp/db";
import { DbCommand } from "../shared/types";

export const db = ValtheraCreate<{
    commands: DbCommand
}>("data");
