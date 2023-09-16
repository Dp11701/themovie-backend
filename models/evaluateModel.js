const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users", // Đặt tên của model người dùng của bạn
      required: true,
    },
    movieId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey:false,
      transform: function (doc, ret) { 
        ret.id = ret._id;
        delete ret._id;
      }
    }
  }
);

module.exports = mongoose.model("Comment", commentSchema);
