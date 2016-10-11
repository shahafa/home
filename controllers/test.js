class Test {

  static getTime(req, res) {
    const date = new Date();
    return res.json(date);
  }
}

module.exports = Test;
