import express from 'express'
import { getSampleAttributeGroups, buildFlatCSV, buildGroupedCSV } from '../services/attributeGroups'

const router = express.Router()

// GET /attribute-groups/exports/flat
router.get('/exports/flat', (_req, res) => {
  const groups = getSampleAttributeGroups()
  const csv = buildFlatCSV(groups)

  const filename = `attribute-groups-flat-${Date.now()}.csv`
  res.setHeader('Content-Type', 'text/csv; charset=utf-8')
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
  res.send(csv)
})

// GET /attribute-groups/exports/grouped
router.get('/exports/grouped', (_req, res) => {
  const groups = getSampleAttributeGroups()
  const csv = buildGroupedCSV(groups)

  const filename = `attribute-groups-grouped-${Date.now()}.csv`
  res.setHeader('Content-Type', 'text/csv; charset=utf-8')
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
  res.send(csv)
})

export default router
