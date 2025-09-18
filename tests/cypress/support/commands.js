// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import { login } from "./helpers"

// Add login command
Cypress.Commands.add("loginAsUser", (email, password) => {
  login(email, password)
})

//API-based login command => FASTER THAN UI
Cypress.Commands.add("apiLogin", (email, password) => {
  cy.request("POST", "/api/auth/login", { email, password }).then((res) => {
    window.localStorage.setItem("token", res.body.token)
  })
})
