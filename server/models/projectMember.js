import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const projectMemberSchema = new mongoose.Schema({
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
    dateAdded: {
        type: Date,
        default: Date.now
    }
});

// module.exports = mongoose.model('ProjectMember', projectMemberSchema);
const ProjectMember = mongoose.model('ProjectMember', projectMemberSchema);
export default ProjectMember;
