export class Player {
  constructor(lvl, battlePower) {
    this.lvl = lvl;
    this.battlePower = battlePower;
  }

  addLvl() {
    lvl += 1;
    addBattlePower();
  }

  removeLvl() {
    lvl -= 1;
    battlePower -= 1;
  }

  addBattlePower(num) {
    battlePower += num ? num : 1;
  }

  removeBattlePower(num) {
    battlePower -= num ? num : 1;
  }
}
