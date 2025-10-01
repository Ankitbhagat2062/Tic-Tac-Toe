const { default: mongoose } = require('mongoose');

const AssetSchema = new mongoose.Schema({
  coins: { type: Number, required: true },
  diamonds: { type: Number, required: true },
  icons: { type: Number, required: true },
  emoji: { type: String },
  board: { type: String, unique: true },
  avatar: { type: String },
  frame: { type: String },
  voicenote: { type: String },
  user: [{ type: mongoose.Types.ObjectId, ref: "User" }],
} ,
{ timestamps: true }
);

module.exports = mongoose.model('Asset', AssetSchema);
