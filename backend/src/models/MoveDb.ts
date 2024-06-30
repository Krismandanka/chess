

import mongoose,{InferSchemaType,model,Schema} from "mongoose";
import { Move } from "chess.js";
const MoveSchema = new Schema({
    color:{
        type:String,
    },
    from:{
        type:String
    },
    to:{
        type:String
    },
    piece:{
        type:String
    },
    captured:{
        type:String
    },
    promotion:{
        type:String
    },
    flags:{
        type:String
    },
    san:{
        type:String
    },
    lan:{
        type:String
    },
    before:{
        type:String
    },
    after:{
        type:String
    },
},
{timestamps:true}
);


type moves = InferSchemaType<typeof MoveSchema>;
const MoveDb = model<moves>("MoveDb",MoveSchema);
export default MoveDb;


