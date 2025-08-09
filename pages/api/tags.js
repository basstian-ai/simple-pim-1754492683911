import { getAllTags } from '../../lib/tags';

export default function handler(req, res) {
  const { search } = req.query || {};
  const tags = getAllTags({ search });
  res.status(200).json(tags);
}
