/**
 * Converts a tasks array to CSV and triggers a browser download.
 * Fields: title, priority, status, deadline
 */
export function exportTasksCSV(tasks) {
    const headers = ['Title', 'Priority', 'Status', 'Deadline']
    const rows = tasks.map((t) => [
        `"${(t.title || '').replace(/"/g, '""')}"`,
        t.priority || '',
        t.status || '',
        t.deadline ? new Date(t.deadline).toLocaleDateString() : '',
    ])

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `tasks-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}
