

import mongoose,{InferSchemaType,model,Schema} from "mongoose";
// import { Move } from "chess.js";
const GameSchema = new Schema({
    player1:{
        type:String,
        require:true
    },
    player2:{
        type:String,
        require:true
    },
    whitePlayer:{
        type:mongoose.Types.ObjectId,
        require:true,
        ref:"User"
    },
    blackPlayer:{
        type:mongoose.Types.ObjectId,
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
       type:mongoose.Types.ObjectId,
       ref:"MoveDb"
    }]

},
{timestamps:true}
);


type game = InferSchemaType<typeof GameSchema>;
export default model<game>("GameDb",GameSchema);



