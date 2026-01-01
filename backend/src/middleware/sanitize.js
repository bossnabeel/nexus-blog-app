import sanitize from "sanitize-html";

const sanitizeInput = (req, _res, next) => {
  const clean = {
    allowedTags: ["b", "i", "em", "strong", "a"],
  };
  if (req.body) {
    if (req.body.title) {
      req.body.title = sanitize(req.body.title, clean);
    }
    if (req.body.content) {
      req.body.content = sanitize(req.body.content, clean);
    }
    if (req.body.text) {
      req.body.text = sanitize(req.body.text, clean);
    }
  }
  next();
};

export { sanitizeInput };