import user from "../models/authModel.js";

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExist = await user.findOne({ email });

    if (userExist) {
      return res.status(400).json({
        message: "email already exists",
      });
    }

    const createUser = await user.create({
      name,
      email,
      password,
    });

    // console.log(createUser);
    res.status(201).json({
      message: "user register Successfull",
      token: await createUser.generateToken(),
      userId: createUser._id.toString(),
    });
  } catch (err) {
    res.status(500).json({
      message: "internal server error",
      error: err,
    });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userExist = await user.findOne({ email });
    // console.log(userExist, "userExist");

    if (!userExist) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    const isPasswordValid = await userExist.comparePassword(password);

    // console.log(isPasswordValid, "isPasswordValid");
    if (isPasswordValid) {
      return res.status(200).json({
        message: "Successfully login",
        token: await userExist.generateToken(),
        userId: userExist._id.toString(),
        email: userExist.email,
      });
    } else {
      res.status(400).json({
        message: "Invalid email or password",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err,
    });
  }
};

export { register, login };
