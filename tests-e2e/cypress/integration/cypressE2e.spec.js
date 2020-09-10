describe('Chess Board Validations', () => {

  function getIframeBody(iframeId) {
    return cy
      .get(`iframe#${iframeId}`)
      .its('0.contentDocument')
      .its('body')
      .then(cy.wrap);
  }

  it('Launch the chess app', () => {
    cy.visit("http://localhost:8080/")
    cy.get('.ui-chess24Logo')
    cy.get('button').click(6000);

  })

  it('Launch the chess app', () => {
    cy.visit("http://localhost:8080/")
    cy.get('.ui-chess24Logo')
    cy.get('button').click(6000);
  })

  it('Launch the chess app', () => {
    cy.visit("http://localhost:8080/")
    cy.get('.ui-chess24Logo')
    cy.get('button').click(6000);
  })



  // it('Validate the Pre conditions', () => {
  //   if (window.location !== window.parent.location) {
  //     console.log('The page is in an iframe')
  //   }

  //   else {
  //     console.log('The page is not in an iframe')
  //   }
  // });
});