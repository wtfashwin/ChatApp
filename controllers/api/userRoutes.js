const router = require("express").Router();
const { User } = require("../../models");

router.get("/", async (req, res) => {
  try {
    const userData = await User.findAll({
      attributes: { exclude: ["password"] },
      order: [["username", "ASC"]],
    });
    return res.status(200).json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const userData = await User.create(req.body);
    res.status(200).json(userData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const userData = await User.findOne({
      where: { username: req.body.username },
    });

    if (!userData) {
      // If the user doesn't exist, create a new user with the provided username and password
      res.status(400).json({ message: "Incorrect username, please try again" });
      return;
    } else {
      // If the user exists, check the password
      const validPassword = await userData.checkPassword(req.body.password);

      if (!validPassword) {
        res
          .status(400)
          .json({ message: "Incorrect password, please try again" });
        return;
      }
    }

    req.session.save(() => {
      (req.session.user_id = userData.id),
        (req.session.logged_in = true),
        (req.session.username = userData.username),
        (req.session.room = userData.room);
      res.json({ user: userData, message: "You are now logged in!" });
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/logout", (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

router.post("/message", async (req, res) => {
  let message = req.body.message;
  console.log(message);

  try {
    const messageData = await Message.create(req.body).then((response) =>
      res.send("message created!!")
    );
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
