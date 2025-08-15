export function exportToCsv(filename: string, rows: Record<string, string | number | undefined>[]) {
  if (!rows.length) return
  const headers = Object.keys(rows[0])
  const escape = (v: any) => {
    if (v === null || v === undefined) return ''
    const s = String(v)
    if (s.includes('"') || s.includes(',') || s.includes('\n')) return '"' + s.replace(/"/g, '""') + '"'
    return s
  }
  const lines = [headers.join(',')].concat(
    rows.map((r) => headers.map((h) => escape(r[h])).join(','))
  )
  const csv = lines.join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.setAttribute('download', filename)
  document.body.appendChild(a)
  a.click()
  a.remove()
  // give browser a chance to revoke
  setTimeout(() => URL.revokeObjectURL(url), 5000)
}
