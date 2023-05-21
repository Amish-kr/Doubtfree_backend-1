import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  Nickname: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  residence: { type: String, required: true },
  number: { type: String, required: true },
  donation: { type: number, required: true },
  website: { type: String, required: true },
});

export default mongoose.model("User", userSchema);
