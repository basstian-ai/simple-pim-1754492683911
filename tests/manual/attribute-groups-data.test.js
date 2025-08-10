const fs = require('fs')
const path = require('path')

;(function main() {
  try {
    const file = path.join(process.cwd(), 'data', 'attribute-groups.json')
    const raw = fs.readFileSync(file, 'utf-8')
    const data = JSON.parse(raw)

    if (!data || !Array.isArray(data.attributeGroups)) {
      throw new Error('attributeGroups missing or not an array')
    }

    if (data.attributeGroups.length === 0) {
      throw new Error('Expected at least one attribute group')
    }

    for (const g of data.attributeGroups) {
      if (!g.id || !g.name) throw new Error('Group missing id or name')
      if (!Array.isArray(g.attributes)) throw new Error(`Group ${g.id} attributes not an array`)
      for (const a of g.attributes) {
        if (!a.code) throw new Error(`Attribute missing code in group ${g.id}`)
      }
    }

    console.log(`OK: attribute-groups.json valid with ${data.attributeGroups.length} groups.`)
  } catch (err) {
    console.error('Test failed:', err && err.message ? err.message : err)
    process.exitCode = 1
  }
})()
