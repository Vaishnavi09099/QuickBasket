import { Connection } from "mongoose";

//hamare banaye huye custom types


declare global {
    var mongoose: {
        conn: Connection | null,
        promise: Promise<Connection> | null


    }
}
export {}