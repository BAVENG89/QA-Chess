import { selector } from 'testcafe';

fixture('Validating online Chess Game')
  .page("http://localhost:8080/")

test('first test', async t => {
  await t
    .expect(selector('.ui-chess24Logo').innerText).eql('Chess24')
});