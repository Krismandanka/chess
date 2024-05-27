// Import the Mongoose library
const mongoose = require("mongoose");

// Define the user schema using the Mongoose Schema constructor
const game = new mongoose.Schema(
	{
        whitePlayerId:{

        },
        blackPlayerId:{

        },
        result:{

        },
        moves:[
            
        ]

        

		// Add timestamps for when the document is created and last modified
	},
	{ timestamps: true }
);

// Export the Mongoose model for the user schema, using the name "user"
module.exports = mongoose.model("GameDb", game);