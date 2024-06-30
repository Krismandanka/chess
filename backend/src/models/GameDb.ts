

import mongoose,{InferSchemaType,model,Schema} from "mongoose";
// import { Move } from "chess.js";
const GameSchema = new Schema({
    
    whitePlayer:{
        type:Schema.Types.ObjectId,
        require:true,
        ref:"User"
    },
    blackPlayer:{
        type:Schema.Types.ObjectId,
        require:true,
        ref:"User"
    },
    result:{
        type:String,
        enum:["WhiteWin","BlackWin","Draw"]
    },
    startingFen:{
        type:String,
        default:"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    },
    moves:[{
       type:Schema.Types.ObjectId,
       ref:"MoveDb"
    }]

},
{timestamps:true}
);


type game = InferSchemaType<typeof GameSchema>;
const GameDb = model<game>("GameDb",GameSchema);
export default GameDb;



