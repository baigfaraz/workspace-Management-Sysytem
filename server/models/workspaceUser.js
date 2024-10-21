import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const workspaceUserSchema = new mongoose.Schema({
    workspaceId: {
        type: Schema.Types.ObjectId,
        ref: 'Workspace',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dateAdded: {
        type: Date,
        default: Date.now
    }
});

// module.exports = mongoose.model('WorkspaceUser', workspaceUserSchema);
const WorkspaceUser = mongoose.model('WorkspaceUser', workspaceUserSchema);
export default WorkspaceUser;
