const router = require("express").Router();
const { User } = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const multerConfig = require("../config/multer");
const JWT_SECRET = "fskdjbk242&*@#*&@¨*)@(#";

const groupRoutes = require("./groupRoutes");

// router.post("/login", async (req, res) => {
//   const { username, password } = req.body;

//   const user = await User.findOne({ username }).lean();

//   if (!user) {
//     return res.json({ status: "error", error: "Usuário ou Senha Inválido" });
//   }

//   if (await bcrypt.compare(password, user.password)) {
//     const token = jwt.sign(
//       { id: user._id, username: user.username },
//       JWT_SECRET,
//       { subject: user._id, expiresIn: "10d" }
//     );

//     return res.status(200).json({ user, token });
//   }

//   return res.json({ status: "error", error: "Usuário ou Senha Inválido" });
// });

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).lean();

  if (!user) {
    return res.json({ status: "error", error: "Usuário ou Senha Inválido" });
  }

  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET
    );

    return res.status(200).json({ user, token });
  }

  return res.json({ status: "error", error: "Usuário ou Senha Inválido" });
});

// router.post(
//   "/upload/image",
//   multer(multerConfig).single("file"),
//   (req, res) => {
//     console.log(req.file);
//   }
// );

router.post("/register", async (req, res) => {
  const { name, username, password: pass } = req.body;

  const password = await bcrypt.hash(pass, 10);

  const user = { name, password, username };

  try {
    const userReq = await User.create(user);
    res.status(201).json(userReq);
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(500)
        .json({ error: "Nome de Usuário já cadastrado", code: 11000 });
    }
    res.status(500).json({ error: err });
  }
});

// async function ensureUserAuthenticated(request, _response, next) {
//   const authHeader = request.headers.authorization;

//   if (!authHeader) {
//     throw new AppError("Token JWT inválido");
//   }

//   const [, token] = authHeader.split(" ");

//   try {
//     const decoded = verify(token, JWT_SECRET);
//     const { sub: userId } = decoded;

//     const user = await User.findOne({ _id: userId });
//     if (!user) throw new AppError("Token JWT inválido");

//     request.user = { _id: user._id };

//     // return next();
//   } catch (err) {
//     throw new AppError("Token JWT inválido");
//   }
// }

// router.use(ensureUserAuthenticated);

router.use("/group", groupRoutes);

router.post("/change-password", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = jwt.verify(token, JWT_SECRET);
    const _id = user._id;
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.updateOne(
      { _id },
      {
        $set: { password: hashedPassword },
      }
    );

    res.json({ status: "ok" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.get("/", async (req, res) => {
  try {
    const groups = await User.find();
    res.status(200).json(groups);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.get("/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const groups = await User.findOne({ _id }).populate({
      path: "group",
      model: "Group",
    });
    res.status(200).json(groups);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.put("/:id", async (req, res) => {
  const _id = req.params.id;
  const { name, username } = req.body;

  const user = { name, username };

  try {
    await User.updateOne({ _id }, user);
    return res.json({ status: "ok", data: user });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

module.exports = router;
