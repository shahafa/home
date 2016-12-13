const Filter = require('../models/Filter');

async function getFilters(req, res) {
  const userId = req.user.sub;

  const filters = await Filter.getFilters(userId);

  return res.json({
    status: 'success',
    data: {
      filters,
    },
  });
}

async function addFilter(req, res) {
  const userId = req.user.sub;

  const filter = Object.assign({ userId }, req.body.filter);
  await Filter.add(filter);

  return res.json({
    status: 'success',
    data: {
      filter,
    },
  });
}

async function deleteFilters(req, res) {
  const userId = req.user.sub;
  const filterId = req.body.filterId;

  const deleteSuccess = await Filter.delete(userId, filterId);

  if (!deleteSuccess) {
    return res.json({
      status: 'error',
      message: `Unable to delete filter ${filterId}`,
    });
  }

  return res.json({
    status: 'success',
    data: null,
  });
}

module.exports = {
  addFilter,
  getFilters,
  deleteFilters,
};
