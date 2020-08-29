const Mongoose = require("mongoose");
const Bcrypt = require("bcryptjs");
const Jwt = require("jsonwebtoken");

const Schema = Mongoose.Schema;
const userSchema = Schema({
  firstName: {
    type: String,
    required: [true, "Por favor ingrese un nombre"],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, "Por favor ingrese un apellido"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Por favor ingrese un email"],
    trim: true,
    unique: [true, "Este email ya está en uso"]
  },
  password: {
    type: String,
    required: [true, "Por favor ingrese un password"]
  },
  image: {
    type: String,
    default: "No Image Yet"
  },
  role: {
    type: String,
    enum: {
      values: ["user", "vendor", "admin"],
      message: "Please Provide Allowed Role Only Such As user/vendor/admin"
    },
    default: "user"
  },
  items: {
    type: [
      {
        product: {
          type: Mongoose.Types.ObjectId,
          ref: "Product"
        },
        vendor: {
          type: Mongoose.Types.ObjectId,
          ref: "User"
        },
        price: {
          type: Number,
          default: 0
        },
        quantity: {
          type: Number,
          default: 0
        },
        total: {
          type: Number,
          default: 0
        }
      }
    ],
    default: []
  },
  myProduct: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    default: 0
  }
});

// Methods
userSchema.methods.MatchPassword = async (Password, UserPassword) =>
  Bcrypt.compare(Password, UserPassword);

userSchema.methods.GenerateToken = Id =>
  Jwt.sign({ Id }, "JPC", { expiresIn: "1h" });

userSchema.statics.VerifyToken = Token => Jwt.verify(Token, "JPC");

// Hooks
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await Bcrypt.hash(this.password, 12);
  next();
});

const UserModel = Mongoose.model("User", userSchema);
module.exports = UserModel;
