describe('Recipe Flow', () => {
  it('should allow a user to view a recipe', () => {
    // Start at the home page
    cy.visit('/')

    // Check that at least one recipe is visible
    cy.get('a[href^="/recipe/"]').should('have.length.greaterThan', 0)

    // Click on the first recipe link
    cy.get('a[href^="/recipe/"]').first().click()

    // The recipe title should be visible
    cy.get('h1').should('be.visible')

    // The hero image should be visible
    cy.get('img[alt]').should('be.visible')

    // The main sections should be visible
    cy.contains('h3', 'Summary').should('be.visible')
    cy.contains('h3', 'Ingredients').should('be.visible')
    cy.contains('h3', 'Preparation').should('be.visible')
  })

  it('should update ingredient list when serving size is changed', () => {
    cy.visit('/')
    cy.get('a[href^="/recipe/"]').first().click()

    // Wait for the ingredients list, then get the text of the first ingredient.
    // We use a .then() block to avoid alias timing issues.
    cy.contains('h3', 'Ingredients')
      .nextAll('ul')
      .first()
      .find('li')
      .first()
      .invoke('text')
      .then((initialText) => {
        // Now that we have the initial text, get the initial servings
        cy.get('#servings-input')
          .invoke('val')
          .then((initialServingsVal) => {
            const initialServings = parseFloat(initialServingsVal as string)
            const newServings = initialServings * 2

            // Force the input change
            cy.get('#servings-input')
              .clear()
              .type(newServings.toString())
              .trigger('input')
              .blur()

            // Now, check that the ingredient text has changed from the original
            cy.contains('h3', 'Ingredients')
              .nextAll('ul')
              .first()
              .find('li')
              .first()
              .invoke('text')
              .should('not.equal', initialText)
          })
      })
  })
})
