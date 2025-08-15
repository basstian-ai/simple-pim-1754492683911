export type Attribute = {
  id: string
  name: string
  type: string
  required?: boolean
}

export type AttributeGroup = {
  id: string
  name: string
  description?: string
  attributes: Attribute[]
}

// NOTE: In the real implementation this would query the DB. For now we provide
// a small deterministic in-memory sample set so the exports and tests are
// reproducible and easy to wire into higher layers (routes, UI).
export function getSampleAttributeGroups(): AttributeGroup[] {
  return [
    {
      id: 'g-1',
      name: 'Dimensions',
      description: 'Size & weight related attributes',
      attributes: [
        { id: 'a-1', name: 'Height', type: 'number', required: true },
        { id: 'a-2', name: 'Width', type: 'number', required: true },
        { id: 'a-3', name: 'Depth', type: 'number' }
      ]
    },
    {
      id: 'g-2',
      name: 'Material',
      description: 'What the product is made of',
      attributes: [
        { id: 'a-4', name: 'Primary Material', type: 'string', required: true },
        { id: 'a-5', name: 'Finish', type: 'string' }
      ]
    }
  ]
}

function csvEscapeCell(cell: string): string {
  // Quote cells with commas, quotes or newlines. Double any internal quotes.
  if (cell == null) return ''
  const asStr = String(cell)
  if (/[",\n]/.test(asStr)) {
    return '"' + asStr.replace(/"/g, '""') + '"'
  }
  return asStr
}

export function buildFlatCSV(groups: AttributeGroup[]): string {
  // Flat view: one row per attribute with group columns repeated.
  const headers = [
    'groupId',
    'groupName',
    'groupDescription',
    'attributeId',
    'attributeName',
    'attributeType',
    'attributeRequired'
  ]

  const rows: string[] = []
  rows.push(headers.join(','))

  for (const g of groups) {
    for (const a of g.attributes) {
      const cells = [
        csvEscapeCell(g.id),
        csvEscapeCell(g.name),
        csvEscapeCell(g.description ?? ''),
        csvEscapeCell(a.id),
        csvEscapeCell(a.name),
        csvEscapeCell(a.type),
        csvEscapeCell(a.required ? 'true' : 'false')
      ]
      rows.push(cells.join(','))
    }
  }

  return rows.join('\n')
}

export function buildGroupedCSV(groups: AttributeGroup[]): string {
  // Grouped view: one row per group. Attributes column contains JSON array.
  const headers = ['groupId', 'groupName', 'groupDescription', 'attributesJson']
  const rows: string[] = []
  rows.push(headers.join(','))

  for (const g of groups) {
    const attributesJson = JSON.stringify(
      g.attributes.map((a) => ({ id: a.id, name: a.name, type: a.type, required: !!a.required }))
    )
    const cells = [csvEscapeCell(g.id), csvEscapeCell(g.name), csvEscapeCell(g.description ?? ''), csvEscapeCell(attributesJson)]
    rows.push(cells.join(','))
  }

  return rows.join('\n')
}
