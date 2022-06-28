import mongoose from "mongoose"
import bcrypt from "bcrypt"

const { Schema, model } = mongoose

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["User", "Admin"], default: "User" },
  },
  {
    timestamps: true,
  }
)

UserSchema.pre("save", async function (next) {
  // BEFORE saving the user in db, execute a function (in this case hash the password)
  // I am NOT using arrow functions here because of "this"

  const currentUser = this // "this" here represents the current user I am trying to save in db
  const plainPW = this.password

  if (currentUser.isModified("password")) {
    // only if the user is modifying the password I will use some CPU cycles to calculate the hash, otherwise they would be just wasetd
    const hash = await bcrypt.hash(plainPW, 11)
    currentUser.password = hash
  }

  next()
})

UserSchema.methods.toJSON = function () {
  // this toJSON method will be used EVERY TIME Express does a res.send(user/s)
  // we could override the behaviour of this method to remove the password from the user and then return him/her

  const userDocument = this
  const userObject = userDocument.toObject()

  delete userObject.password
  delete userObject.__v

  return userObject
}

export default model("User", UserSchema)
