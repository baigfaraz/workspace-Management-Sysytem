import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const teamChatSchema = new mongoose.Schema({
    projectId: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    dateSent: {
        type: Date,
        default: Date.now
    }
});

// module.exports = mongoose.model('TeamChat', teamChatSchema);
const TeamChat = mongoose.model('TeamChat', teamChatSchema);
export default TeamChat;
