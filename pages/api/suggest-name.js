const { generateNameSuggestions } = require("../../lib/generateNameSuggestions");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { description, max } = req.body || {};
    const suggestions = generateNameSuggestions(description || "", { max });
    return res.status(200).json({ suggestions });
  } catch (err) {
    return res.status(400).json({ error: "Invalid request" });
  }
};
