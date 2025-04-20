const User = require("../models/User");

const bcrypt = require("bcryptjs");

module.exports = class AuthController {
  static login(req, res) {
    res.render("auth/login");
  }

  static async loginPost(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      req.flash("message", "Usuário não encontrado!");
      res.render("auth/login");
      return;
    }

    const checkPassword = bcrypt.compareSync(password, user.password);

    if (!checkPassword) {
      req.flash("message", "Senha inválida!");
      res.render("auth/login");
      return;
    }

    console.log(user.id);
    req.session.userid = user.id;

    req.flash("message", "Login realizado com sucesso!");

    req.session.save(() => {
      res.redirect("/");
    });
  }

  static register(req, res) {
    res.render("auth/register");
  }

  static async registerPost(req, res) {
    const { name, email, password, confirmpassword } = req.body;

    if (password !== confirmpassword) {
      req.flash("message", "As senhas não conferem, tente novamente!");
      res.render("auth/register");

      return;
    }

    const checkIfEmailExists = await User.findOne({ where: { email: email } });

    if (checkIfEmailExists) {
      req.flash("message", "E-mail já está em uso!");
      res.render("auth/register");
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = {
      name,
      email,
      password: hashedPassword,
    };

    try {
      const createdUser = await User.create(user);

      req.session.userid = createdUser.id;

      req.flash("message", "cadastro realizado com sucesso!");

      req.session.save(() => {
        res.redirect("/");
      });
    } catch (error) {
      console.error(error);
    }
  }

  static logout(req, res) {
    req.session.destroy();
    res.redirect("/login");
  }
};
