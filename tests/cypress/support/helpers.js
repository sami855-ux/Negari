export function login(email, password) {
  cy.visit("/login")
  cy.get("input[name='email']").type(email)
  cy.get("input[name='password']").type(password)
  cy.get("button[type='submit']").click()
}

export function createReport(data) {
  cy.request("POST", "/api/reports", data).then((res) => {
    expect(res.status).to.eq(201)
    return res.body
  })
}

export function resetDatabase() {
  // Assuming you have an endpoint for test reset
  cy.request("POST", "/api/test/reset")
}
