import { saveAs } from "file-saver"

export function exportCSV(rows: any[], filename: string = "data.csv") {
  if (!rows || rows.length === 0) return
  const keys = Object.keys(rows[0])
  const csv = [
    keys.join(","),
    ...rows.map(row => keys.map(k => escapeCSV(row[k])).join(","))
  ].join("\r\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  saveAs(blob, filename)
}

function escapeCSV(val: any): string {
  if (val == null) return ''
  const str = String(val)
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return '"' + str.replace(/"/g, '""') + '"'
  }
  return str
}
