const Tought = require("../models/Tought");
const User = require("../models/User");

module.exports = class ToughtController {
  static async showThoughts(req, res) {
    res.render("toughts/home");
  }

  static async dashboard(req, res) {
    const userId = req.session.userid;
    const user = await User.findOne({
      where: { id: userId },
      include: Tought,
      plain: true,
    });

    const toughts = user.Toughts.map((result) => result.dataValues);

    let emptyToughts = false;

    if (toughts.length === 0) {
      emptyToughts = true;
    }

    if (!user) {
      res.redirect("/login");
    }
    res.render("toughts/dashboard", { toughts, emptyToughts });
  }

  static createTought(req, res) {
    res.render("toughts/create");
  }

  static async createToughtSave(req, res) {
    const tought = {
      title: req.body.title,
      UserId: req.session.userid,
    };

    try {
      await Tought.create(tought);
      req.flash("message", "Pensamento adicionado com sucesso!");

      req.session.save(() => {
        res.redirect("/toughts/dashboard");
      });
    } catch (error) {
      console.error(error);
    }
  }

  static async removeTought(req, res) {
    const id = req.body.id;
    const userId = req.session.userid;

    try {
      await Tought.destroy({ where: { id: id, UserId: userId } });

      req.flash("message", "Pensamento removido com sucesso!");

      req.session.save(() => {
        res.redirect("/toughts/dashboard");
      });
    } catch (error) {
      console.error(error);
    }
  }
};
