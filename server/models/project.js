
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const projectSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: true,
        maxlength: 100
    },
    workspaceId: {
        type: Schema.Types.ObjectId,
        ref: 'Workspace',
        required: true
    },
    teamLeadId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

// module.exports = mongoose.model('Project', projectSchema);

const Project = mongoose.model('Project', projectSchema);
export default Project;

