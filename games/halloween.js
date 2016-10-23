'use strict';

const name = "Magnezone";
const data = {
	"Pokemon Moves" : [],
	"Pokemon Items" : [],
	"Pokemon Abilities": [],
	"Pokemon": [],
}

/*for (let i in Tools.data.moves) {
	let move = Tools.data.moves[i];
	if (!move.name || !move.desc) continue;
	data["Pokemon Moves"].push(move.name);
}

for (let i in Tools.data.items) {
	let item = Tools.data.items[i];
	if (!item.name || !item.desc) continue;
	data["Pokemon Items"].push(item.name);
}

for (let i in Tools.data.abilities) {
	let ability = Tools.data.abilities[i];
	if (!ability.name || !ability.desc) continue;
	data["Pokemon Abilities"].push(ability.name);
}*/

for (let i in Tools.data.pokedex) {
	let mon = Tools.data.pokedex[i];
	if (!mon.species) continue;
	data["Pokemon"].push(mon.species);
}

class Magnezone extends Games.Game {
	constructor(room) {
		super(room);
		this.name=name;
		this.id = Tools.toId(name);
		this.answer = null;
		this.categories = Object.keys(data);
		this.mons = new Map();
		this.curParam = null;
	}
	
	onStart() {
		this.askForMons();
	}
	
	isValidParam(param, type) {
		var hasTrue = false;
		var hasFalse = false;
	}
	
	chooseParam() {
		
	}
	
	nextRound() {
		
	}
	askForMons() {
		for (let userID in this.players) {
			Users.get(userID).say("Please tell me which pokemon you would like to be!");
			this.room.say("Now asking players for pokemon");
		}
		this.timeout = setTimeout(() => this.nextRound(), 60*100);
	}
	
	play(user, target) {
		console.log("hi nubs");
		if (user.id in this.mons) {
			user.say("You have already chosen your pokemon!");
		}
		
		else if (!target in data["Pokemon"]) {
			user.say("That is not a valid pokemon!");
		}
		else if (target in this.mons.values()) {
			user.say("That pokemon has already been chosen. Please choose a new mon");
		}
		else {
			user.say("You have chosen " + target);
			this.mons[user.id] = target;
		}
	}
}

exports.name = name;
exports.description = "Hangman Bomb! A variation of hangman in which each player starts with 3 lives - if you guess the word, you gain a point, but every wrong answer you lose a point. Last survivor Wins!";
exports.game = Magnezone