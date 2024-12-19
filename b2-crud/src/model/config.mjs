import mongoose from 'mongoose';

// Connect to MongoDB
mongoose.connect('mongodb+srv://ma226gw:marah12345..@crud.r33emb2.mongodb.net/Node-API?retryWrites=true&w=majority&appName=crud')
    .then(() => {
        console.log("Connected to mongoDB from model")
    })
    .catch(() => {
        console.log("Failed to connect to mongoDB")
    })

// write schema for User model
const mongoSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Enter a name."],
        },
        password: {
            type: String,
            required: [true, "Enter a password."],

        },
        snippets: [
            {
                title: String,
                content: String
            }
        ]
    }
);

const User = mongoose.model("User", mongoSchema);

export default User;
