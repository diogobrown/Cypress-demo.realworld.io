/// <reference types="cypress" />



describe('Cadastro / Sign Up', () => {
  let time;

  beforeEach(() => {
    time = new Date().getTime()
    cy.visit('register')
  })

  

  it('cadastro com sucesso', () => {

    cy.get("[ng-model$=username]").type(`test-vegeta${time}`) 
    cy.get("[ng-model$=email]").type(`test-vegeta${time}@hotmail.com`) 
    cy.get("[ng-model$=password]").type("123456") 
    cy.get("button[type=submit]").click()
    cy.contains('Your Feed').should("be.visible")
  })

  it('Username não pode ser em branco', () => {
    cy.get("[ng-model$=email]").type(`test-vegeta${time}@hotmail.com`) 
    cy.get("[ng-model$=password]").type("123456") 
    cy.get("button[type=submit]").click()
    cy.contains("username can't be blank").should("be.visible")
  })

  it('Email não pode ser em branco', () => {
    cy.get("[ng-model$=username]").type(`test-vegeta${time}`) 
    cy.get("[ng-model$=password]").type("123456") 
    cy.get("button[type=submit]").click()
    cy.contains("email can't be blank").should("be.visible")
  })

  it('Senha não pode ser em branco', () => {

    cy.get("[ng-model$=username]").type(`test-vegeta${time}`) 
    cy.get("[ng-model$=email]").type(`test-vegeta${time}@hotmail.com`) 
    cy.get("button[type=submit]").click()
    //cy.get('[ng-show$="ctrl.errors"]').contains("password can't be blank").should("be.visible")
    cy.contains('[ng-show$="ctrl.errors"]',"password can't be blank").should("be.visible")
  })

  //intercept
    // route matcher - toda a configuração para encontrar uma requisição
    // route handler - toda a configuração para manipularo resultado da requisição 

    
  it.only('cadastro com sucesso (rotas)', () => {

    cy.intercept(
      {
        method : 'POST',
        pathname: '/api/users',
        hostname: 'api.realworld.io',
      }).as("PostCreadteUser")

    cy.get("[ng-model$=username]").type(`test-vegeta${time}`) 
    cy.get("[ng-model$=email]").type(`test-vegeta${time}@hotmail.com`) 
    cy.get("[ng-model$=password]").type("123456") 
    cy.get("button[type=submit]").click()
    cy.contains('Your Feed').should("be.visible")
  })

  it.only('cadastro com sucesso (simulador)', () => {

    cy.intercept(
      {
        method : 'POST',
        pathname: '/api/users',
        hostname: 'api.realworld.io',
      },{
        statusCode:500,
      }
      ).as("PostCreadteUserSimulador")

    cy.get("[ng-model$=username]").type(`test-vegeta${time}`) 
    cy.get("[ng-model$=email]").type(`test-vegeta${time}@hotmail.com`) 
    cy.get("[ng-model$=password]").type("123456") 
    cy.get("button[type=submit]").click()
    //cy.contains('Your Feed').should("be.visible")
  })


  it.only('cadastro com sucesso (status code)', () => {

 
      

    cy.get("[ng-model$=username]").type(`test-vegeta${time}`) 
    cy.get("[ng-model$=email]").type(`test-vegeta${time}@hotmail.com`) 
    cy.get("[ng-model$=password]").type("123456") 
    cy.get("button[type=submit]").click()

    cy.intercept(
      {
        method : 'POST',
        pathname: '/api/users',
        hostname: 'api.realworld.io',
      },{
        statusCode:500,
      }
      ).as("PostCreadteUserSimulador")

      cy.wait("@PostCreadteUserSimulador").then(interception =>{
      cy.log('Status code: ${interception.response.statusCode}')})
    //cy.contains('Your Feed').should("be.visible")
  })
})