const { deleteComments } = require("../model/comments.model");
exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  deleteComments(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
