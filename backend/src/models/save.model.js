const mongoose = require('mongoose');

const saveSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    foodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "food",
        required: true
    }
}, {
    timestamps: true
});
saveSchema.index({ userId: 1, foodId: 1 }, { unique: true });
const saveModel = mongoose.model("Save", saveSchema);

module.exports = saveModel;