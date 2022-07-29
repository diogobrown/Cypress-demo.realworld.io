declare namespace Cypress{
    interface Chainable{
        /**
         * Comando customizado para efetuar login
         * @exemple cy.login()
         */
        login(): void
    }
}