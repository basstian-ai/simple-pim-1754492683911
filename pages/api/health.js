export default function handler(req, res) {
  const version = process.env.npm_package_version || '0.0.0';
  return res.status(200).json({ ok: true, uptime: process.uptime(), version });
}
