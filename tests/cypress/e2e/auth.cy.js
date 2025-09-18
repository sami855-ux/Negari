describe("Auth Flow", () => {
  beforeEach(() => {
    cy.fixture("test-data").then((data) => {
      cy.wrap(data).as("data")
    })
  })

  it("allows citizen to login", function () {
    cy.loginAsUser(
      this.data.users.citizen.email,
      this.data.users.citizen.password
    )
    cy.url().should("include", "/dashboard")
  })
})
