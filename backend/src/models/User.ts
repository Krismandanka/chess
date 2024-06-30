

import mongoose,{InferSchemaType,model,Schema} from "mongoose";

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true,
    },
    rating:{
        type:Number,
        default:1200
    },
    gameAsWhite:[
        {
            type: Schema.Types.ObjectId,
            ref: "Game",
        },
    ],
    gameAsBlack:[
        {
            type: Schema.Types.ObjectId,
            ref: "Game",
        },
    ]

},
{timestamps:true}
);


type user = InferSchemaType<typeof userSchema>;
const User =  model<user>("User",userSchema);
export default User;


