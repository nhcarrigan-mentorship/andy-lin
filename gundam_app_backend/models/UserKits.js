const mongoose = require("mongoose");

const userKitSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        kit: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Kit",
            required: true
        },

        status: {
            type: String,
            enum: ["wishlist", "backlog", "completed"],
            required: true
        },
    },
    {
        timestamps: true
    }
);

userKitSchema.index({ user: 1, kit: 1});

module.exports = mongoose.model("UserKit", userKitSchema);