import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const workspaceSchema = new mongoose.Schema({
    workspaceName: {
        type: String,
        required: true,
        unique: true,
        maxlength: 100
    },
    adminId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

// module.exports = mongoose.model('Workspace', workspaceSchema);
const Workspace = mongoose.model('Workspace', workspaceSchema);
export default Workspace;
