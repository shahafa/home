exports.getTime = (req, res) => {
  const date = new Date();
  return res.json(date);
};
