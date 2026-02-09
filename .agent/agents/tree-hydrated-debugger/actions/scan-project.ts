
export function scanProject(files) {
  const issues = []

  for (const file of files) {
    if (file.includes("new Date(")) {
      issues.push({ type: "date-render", file })
    }
    if (file.includes("Math.random(")) {
      issues.push({ type: "random-render", file })
    }
    if (file.includes("localStorage")) {
      issues.push({ type: "storage-render", file })
    }
  }

  return issues
}
