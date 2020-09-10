import { Selector } from 'testcafe';

fixture('Validating online Chess Game')
  .page("http://localhost:8080/")

test('Join a game', async t => {
  const player1 = await t.getCurrentWindow();
  const player2 = await t.openWindow('http://localhost:8080');

  await t
    .switchToWindow(player1)
    .expect(Selector('.ctrls > button').innerText).eql('Start new game')
    .switchToWindow(player2)
    .expect(Selector('.ctrls > button').innerText).eql('Start new game')
    .switchToWindow(player1)
    .click('.ctrls > button')
    .expect(Selector('.ctrls > button').innerText).eql('Quit game')
    .switchToWindow(player2)
    .expect(Selector('.ctrls > button').innerText).eql('Join a game')
});
