const EVENTS = [
  {
    id: "market_dispute",
    region: "青石镇",
    title: "盐引纠纷",
    text: "两家商行为盐引大打出手，背后似有帮派影子。",
    choices: [
      { label: "主持公道", effects: { fame: 2, mood: -1, gang: -1, academy: 1 } },
      { label: "暗中牟利", effects: { spiritStone: 20, fame: -1, gang: 1 } },
      { label: "抽身离场", effects: { mood: 1 } }
    ]
  },
  {
    id: "academy_debate",
    region: "松风书院",
    title: "问道辩经",
    text: "书院先生设辩：修行先修心，还是先修力？",
    choices: [
      { label: "主张修心", effects: { mood: 2, academy: 2, exp: 15 } },
      { label: "主张修力", effects: { fame: 1, immortal: 1, exp: 20 } },
      { label: "沉默旁听", effects: { exp: 8 } }
    ]
  },
  {
    id: "mist_ruin",
    region: "雾隐山",
    title: "古修遗址",
    text: "山中遗址开启，机缘与杀机并存。",
    choices: [
      { label: "冒险深入", effects: { exp: 25, wound: 1, spiritStone: 10 } },
      { label: "谨慎探查", effects: { exp: 12, mood: 1 } },
      { label: "引路卖图", effects: { spiritStone: 15, fame: -1 } }
    ]
  }
];

function createInitialState() {
  return {
    round: 1,
    maxRounds: 10,
    stage: "凡骨",
    exp: 0,
    spiritStone: 50,
    fame: 0,
    mood: 5,
    wound: 0,
    relations: {
      academy: 0,
      immortal: 0,
      gang: 0
    }
  };
}

function maybeBreakthrough(state) {
  if (state.stage === "凡骨" && state.exp >= 40 && state.mood >= 4) {
    state.stage = "炼气";
    return "你吐纳有成，正式踏入【炼气】。";
  }
  if (state.stage === "炼气" && state.exp >= 100 && state.mood >= 6) {
    state.stage = "筑基";
    return "你气府稳固，道基初成，迈入【筑基】。";
  }
  return null;
}

function applyEffects(state, effects) {
  state.spiritStone += effects.spiritStone || 0;
  state.fame += effects.fame || 0;
  state.mood += effects.mood || 0;
  state.wound += effects.wound || 0;
  state.exp += effects.exp || 0;
  state.relations.academy += effects.academy || 0;
  state.relations.immortal += effects.immortal || 0;
  state.relations.gang += effects.gang || 0;
}

function pickEvent(round) {
  return EVENTS[(round - 1) % EVENTS.length];
}

function summary(state) {
  return `境界:${state.stage}｜修为:${state.exp}｜灵石:${state.spiritStone}｜名望:${state.fame}｜心境:${state.mood}｜伤势:${state.wound}`;
}

module.exports = {
  createInitialState,
  pickEvent,
  applyEffects,
  maybeBreakthrough,
  summary
};
