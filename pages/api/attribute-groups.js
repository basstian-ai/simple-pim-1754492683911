import fs from 'fs'
import path from 'path'

const dataPath = path.join(process.cwd(), 'data', 'attribute-groups.json')

async function readAttributeGroups() {
  const json = await fs.promises.readFile(dataPath, 'utf-8')
  return JSON.parse(json)
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    res.status(405).json({ error: 'Method Not Allowed' })
    return
  }

  try {
    const data = await readAttributeGroups()
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate')
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json({ error: 'Failed to load attribute groups' })
  }
}
