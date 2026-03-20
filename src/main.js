const readline = require("readline");
const {
  createInitialState,
  pickEvent,
  applyEffects,
  maybeBreakthrough,
  summary
} = require("./systems");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (q) => new Promise((resolve) => rl.question(q, resolve));

async function run() {
  const state = createInitialState();

  console.log("\n=== 《剑来》沉浸式原型 / CLI Demo ===");
  console.log("你将经历10回合，在修行与权衡中走出自己的道。\n");

  while (state.round <= state.maxRounds) {
    const ev = pickEvent(state.round);
    console.log(`\n[第${state.round}回合] ${ev.region} · ${ev.title}`);
    console.log(ev.text);
    console.log("\n你的状态：" + summary(state));

    ev.choices.forEach((c, idx) => {
      console.log(`${idx + 1}. ${c.label}`);
    });

    let choice = await ask("请选择(1/2/3): ");
    let idx = Number(choice) - 1;
    if (Number.isNaN(idx) || idx < 0 || idx >= ev.choices.length) idx = 0;

    const selected = ev.choices[idx];
    applyEffects(state, selected.effects);

    console.log(`\n你选择了：${selected.label}`);
    console.log("结算后：" + summary(state));

    const breakthroughText = maybeBreakthrough(state);
    if (breakthroughText) {
      console.log("\n✨ " + breakthroughText);
    }

    if (state.mood <= 0) {
      console.log("\n你的心境崩塌，提前结束本局。请下次慎重取舍。\n");
      break;
    }

    state.round += 1;
  }

  console.log("\n=== 局终总结 ===");
  console.log(summary(state));
  console.log(
    `势力关系｜书院:${state.relations.academy} 仙府:${state.relations.immortal} 江湖:${state.relations.gang}`
  );
  console.log("\n下一步可扩展：主线章节、NPC记忆、存档、多周目。\n");

  rl.close();
}

run();
