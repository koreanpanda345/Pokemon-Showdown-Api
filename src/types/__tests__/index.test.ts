import { TeamPokemon } from './../Teams';

test('Teams Export String', () => {
  const team = new TeamPokemon({
    nickname: 'Test',
    species: 'Lopunny',
    item: 'leftovers',
    ability: 'H',
    moves: ['fakeout', 'quickattack', 'closecombat', 'uturn'],
    evs: [0, 252, 4, 0, 0, 252],
    ivs: [],
    nature: 'jolly',
    shiny: 'S',
    level: 100,
  });

  expect(team.toString()).toBe(
    `Test|Lopunny|leftovers|H|fakeout,quickattack,closecombat,uturn|jolly|,252,4,,,252|||S|100|`,
  );
});
