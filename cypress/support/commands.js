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

Cypress.Commands.add('login', () =>{
    cy.request({

        method: 'POST',
        url: 'https://api.realworld.io/api/users/login',
        body:{
            "user":{
                "email":"test-rwc@mail.com",
                "password":"123456"
            }
        },
        failOnStatusCode: false
    }).then(Response =>{
        //cy.log(`Status code: ${Response.status}`)
        //cy.log(`Duration: ${Response.duration}`)
        //cy.log(`Token: ${Response.body.user.token}`)

        // jwtToken
        window.localStorage.setItem("jwtToken", Response.body.user.token)
    })
    cy.visit("/");
})