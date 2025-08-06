export const gradeToPoints: Record<string, number> = {
  A: 4.0, AB: 3.5, B: 3.0, BC: 2.5, C: 2.0, D: 1.0, E: 0.0
}

export const calculateSemesterGPA = (courses: any[]) => {
  let totalPoints = 0, totalCredits = 0
  courses.forEach(c => {
    totalPoints += (gradeToPoints[c.grade] || 0) * c.credits
    totalCredits += c.credits
  })
  return totalCredits === 0 ? 0 : parseFloat((totalPoints / totalCredits).toFixed(2))
}

export const calculateTotalGPA = (allCourses: any[]) => {
  let totalPoints = 0, totalCredits = 0
  allCourses.forEach(c => {
    totalPoints += (gradeToPoints[c.grade] || 0) * c.credits
    totalCredits += c.credits
  })
  return totalCredits === 0 ? 0 : parseFloat((totalPoints / totalCredits).toFixed(2))
}