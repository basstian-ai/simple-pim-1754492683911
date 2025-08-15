import { getSampleAttributeGroups, buildFlatCSV, buildGroupedCSV } from '../src/services/attributeGroups'

describe('attributeGroups export helpers', () => {
  const sample = getSampleAttributeGroups()

  test('flat CSV contains header and attribute rows', () => {
    const csv = buildFlatCSV(sample)
    // header must be present
    expect(csv).toMatch(/^groupId,groupName,groupDescription,attributeId,attributeName,attributeType,attributeRequired/m)
    // must contain at least one attribute id from the sample
    expect(csv).toContain('a-1')
    // group name should appear repeatedly for attributes
    expect(csv.split('\n').length).toBeGreaterThan(2)
  })

  test('grouped CSV has one row per group with JSON attributes column', () => {
    const csv = buildGroupedCSV(sample)
    // header present
    expect(csv).toMatch(/^groupId,groupName,groupDescription,attributesJson/m)
    // JSON attributes column should contain a JSON array marker '[{'
    expect(csv).toMatch(/\[\{.*"id".*\}/)
    // ensure group ids present
    expect(csv).toContain('g-1')
    expect(csv).toContain('g-2')
  })
})
