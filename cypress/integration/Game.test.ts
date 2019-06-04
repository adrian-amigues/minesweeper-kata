describe('Game', () => {
    describe('undo button', () => {
        it('should be disabled if the game just started', () => {
            cy.visit('http://localhost:8080/');
            cy.contains('Undo last action').should('be.disabled');
        });

        it('should undo last move if the undo button is clicked after one move as been made', () => {
            cy.visit('http://localhost:8080/');
            cy.get('.cell')
                .first()
                .click()
                .should('not.have.attr', 'data-status', 'untouched');

            cy.contains('Undo last action').click();
            cy.get('.cell')
                .first()
                .should('have.attr', 'data-status', 'untouched');
        });

        it('should only allow undoing one move if two moves have been made', () => {
            cy.visit('http://localhost:8080/');
            cy.get('.cell')
                .first()
                .click()
                .should('not.have.attr', 'data-status', 'untouched');

            cy.get('[data-status="untouched"]')
                .first()
                .click()
                .should('not.have.attr', 'data-status', 'untouched');

            cy.contains('Undo last action')
                .click()
                .should('be.disabled');
        });
    });
});
