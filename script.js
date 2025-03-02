let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["fasz"];
let ballsRemoved = 0;
let losedGame = 0;

const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const weapons = [
  { name: 'fasz', power: 5 },
  { name: 'dagger', power: 30 },
  { name: 'claw hammer', power: 50 },
  { name: 'sword', power: 100 }
];
const monsters = [
  {
    name: "Takony",
    level: 2,
    health: 15
  },
  {
    name: "Farkas",
    level: 8,
    health: 60
  },
  {
    name: "Sárkány",
    level: 200,
    health: 3000
  }
]
const locations = [
  {
    name: "town square",
    "button text": ["Irány a Bolt", "Irány a Sisnyásba", "Megküzdés a Sárkánnyal"],
    "button functions": [goStore, goCave, fightDragon],
    text: "A Belvárosban vagy és látsz egy táblát amin az áll, hogy: \"Bolt\"."
  },
  {
    name: "store",
    "button text": ["HP vétel", "Fegyver vétel", "Irány a Belváros"],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "Betérsz a helyi Boltba."
  },
  {
    name: "cave",
    "button text": ["Megküzdés a Takonnyal", "Megküzdés a Farkassal", "Irány a Belváros"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "Elérted a Sisnyást, látsz két kibaszott nagy dögöt. Mit teszel?"
  },
  {
    name: "fight",
    "button text": ["Támadás", "Védekezés", "Menekülés"],
    "button functions": [attack, dodge, goTown],
    text: "A Sárkány hatalmas és te fegyver híján max a faszoddal csapkodhatod."
  },
  {
    name: "kill monster",
    "button text": ["Irány a Belváros", "Irány a Belváros", "Irány a Belváros"],
    "button functions": [goTown, goTown, goTown],
    text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.'
  },
  {
    name: "lose",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "A Sárkány nem értékeli pozitívan a közeledésedet és úgy seggberak, hogy atomjaira durran szét a tested. &#x2620;"
  },
  { 
    name: "win", 
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"], 
    "button functions": [restart, restart, restart], 
    text: "You defeat the dragon! YOU WIN THE GAME! &#x1F389;" 
  },
  {
    name: "easter egg",
    "button text": ["2", "8", "Irány a Belváros?"],
    "button functions": [pickTwo, pickEight, goTown],
    text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!"
  }
];

// initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerHTML = location.text;
}

function goTown() {
  update(locations[0]);
  if (losedGame > 0) {
    text.innerText = "Egy szadomazó varázsló újrarakta a testedet a cafatjaidból. Így újra meg tudod baszatni magad a sárkánnyal."
  }
}

function goStore() {
  update(locations[1]);
}

function goCave() {
  update(locations[2]);
}

function buyHealth() {
    text.innerText = "A boltos annyira röhög azon, hogy milyen ronda vagy, hogy képtelen kiszolgálni téged.";
}

function buyWeapon() {
      health -= 15;
      healthText.innerText = health;
      text.innerText = `"Bizonyítsd be, hogy méltó vagy fegyverviselésre." Mint várható, szarrá veri szét a boltos a fejedet.`;
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerText = "You sold a " + currentWeapon + ".";
    text.innerText += " In your inventory you have: " + inventory;
  } else {
    text.innerText = "Don't sell your only weapon!";
  }
}

function fightSlime() {
  text.innerText = "A takony csúnyán néz rád, mire te sírva fakadsz és elmenekülsz töle.";
}

function fightBeast() {
  if (ballsRemoved === 1) {
    health -= 1;
    healthText.innerText = health;
    text.innerText = "Fájlalod hiányzó gyermeknemzö szervedet";
  } else {
    text.innerText = "A Farkas letépi a heréidet és elszalad a szájában csócsálva azokat";
    health -= 10;
    healthText.innerText = health;
    ballsRemoved = 1;
    return ballsRemoved;
  }
}

function fightDragon() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

function attack() {
  text.innerText = "The " + monsters[fighting].name + " attacks.";
  text.innerText += " Támadsz a " + weapons[currentWeapon].name + "oddal.";
  health -= getMonsterAttackValue(monsters[fighting].level);
  if (isMonsterHit()) {
    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;    
  } else {
    text.innerText += " Elbasztad.";
  }
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    if (fighting === 2) {
      winGame();
    } else {
      defeatMonster();
    }
  }
  if (Math.random() <= .1 && inventory.length !== 1) {
    text.innerText += " A " + inventory.pop() + " hasznavehetetlen lett.";
    currentWeapon--;
  }
}

function getMonsterAttackValue(level) {
  const hit = (level * 5) - (Math.floor(Math.random() * xp));
  console.log(hit);
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > .2 || health < 20;
}

function dodge() {
  text.innerText = "Kikerülted a dög támadását";
}

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
}

function lose() {
  update(locations[5]);
  losedGame++;
}

function winGame() {
  update(locations[6]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["fasz"];
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}

function easterEgg() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText = "You picked " + guess + ". Here are the random numbers:\n";
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }
  if (numbers.includes(guess)) {
    text.innerText += "Right! You win 20 gold!";
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerText += "Wrong! You lose 10 health!";
    health -= 10;
    healthText.innerText = health;
    if (health <= 0) {
      lose();
    }
  }
}