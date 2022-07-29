/// <reference types="cypress"/>
describe('Login', () => {

    let time
    let mail
    let pass

    before(() => {
        //ARRANGE
        cy.visit("/register")
        
        time = new Date().getTime()
        mail = `abdullah-${time}@mail.com`
        pass = "123456"

        //ACTION
        cy.get("[ng-model='$ctrl.formData.username']").type(`Abdullah-${time}`)
        cy.get("[ng-model='$ctrl.formData.email']").type(mail)
        cy.get("[ng-model='$ctrl.formData.password']").type(pass)
        cy.get("[type='submit']").click()
        cy.contains("Settings").click()
        cy.contains("Or click here to logout.").click()
    });

    beforeEach(() => {
        //ARRANGE
        cy.visit("/login")

        time = new Date().getTime()
    });

    it('Email em branco', () => {
        //ACTION
        cy.get("[ng-model$='password']").type(pass)
        cy.get("[type='submit']").click()

        //ASSERT
        cy.get("[ng-repeat*='errors']").should("contain", "email can't be blank")
    });

    it('senha em branco', () => {
        //ACTION
        cy.get("[ng-model$='email']").type(`Abdullah-${time}@mail.com`)
        cy.get("[type='submit']").click()

        //ASSERT
        cy.get("[ng-repeat*='errors']").should("contain", "password can't be blank")
    });

    it('senha inválida', () => {
        //ACTION
        cy.get("[ng-model$='email']").type(mail)
        cy.get("[ng-model$='password']").type("123456234234")
        cy.get("[type='submit']").click()

        //ASSERT    
        cy.get("[ng-repeat*='errors']").should("contain", "email or password is invalid")
    });

    it('usuário inválido', () => {
        //ACTION
        cy.get("[ng-model$='email']").type(`Abdullah-${time}@mail.com`)
        cy.get("[ng-model$='password']").type(pass)
        cy.get("[type='submit']").click()

        //ASSERT    
        cy.get("[ng-repeat*='errors']").should("contain", "email or password is invalid")
    });

    it('acessar a opção preciso de uma nova conta', () => {
        //ACTION
        cy.contains("Need an account?").click()

        //ASSERT    
        cy.get("[ng-bind$='title']").should("contain", "Sign up")
    });

    it('tentar autenticar quando o servidor está fora', () => {
        //ACTION
        cy.get("[ng-model$='email']").type(mail)
        cy.get("[ng-model$='password']").type(pass)

        cy.intercept({
            method: 'POST',
            pathname: '/api/users/login',
            hostname: 'api.realworld.io'
        }, {
            statusCode: 500,
            body: {
                "errors": { "server": ["servidor esta fora do ar"] },
            }
        }).as('PostCreateUserSimulado')

        cy.get("[type='submit']").click()

        //ASSERT    
        cy.get("[ng-repeat*='errors']").should("contain", "server servidor esta fora do ar")
    });

    it('login com sucesso', () => {
        //ACTION
        cy.get("[ng-model$='email']").type(mail)
        cy.get("[ng-model$='password']").type(pass)

        cy.intercept({
            method: 'POST',
            pathname: '/api/users/login',
            hostname: 'api.realworld.io'
        }).as('PostCreateUserSimulado')

        cy.get("[type='submit']").click()

        //ASSERT
        cy.wait("@PostCreateUserSimulado").then(result => {
            cy.log(`StatusCode = ${JSON.stringify(result.response.body)}`);
            expect(result.response.statusCode).to.be.eq(200);
            expect(result.response.body.user.email).to.be.eq(mail);
            expect(result.response.body.user.token).length.above(0);
        });
        cy.contains('Your Feed').should("be.visible")
    });
});