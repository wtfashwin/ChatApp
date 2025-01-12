const router = require("express").Router();
const { User } = require("../models");
const withAuth = require("../utils/auth");

router.get("/", async (req, res) => {
  // Send the rendered Handlebars.js template back as the response
  res.render("home");
});

router.get("/chat", withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {});
    console.log(userData);
    const user = userData.get({
      plain: true,
    });
    if (req.query.username !== user.username) {
      res.render("home");
      return;
    }
    res.render("chat", {
      ...user,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/login", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/chat?username=" + req.session.username);
    return;
  }

  res.render("login");
});

router.get("/signup", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/chat?username=" + req.session.username);
    return;
  }
  res.render("signup");
});

module.exports = router;
