'use strict'

const name = "Orders";
const data = {
	"Pokemon Moves" : [],
	"Pokemon Items" : [],
	"Pokemon Abilities": [],
}

for (let i in Tools.data.moves) {
	let move = Tools.data.moves[i];
	if (!move.name || !move.desc) continue;
	data["Pokemon Moves"].push(move.name);
}

for (let i in Tools.data.items) {
	let item = Tools.data.items[i];
	if (!item.name || !item.desc) continue;
	data["Pokemon Moves"].push(item.name);
}

for (let i in Tools.data.abilities) {
	let ability = Tools.data.abilities[i];
	if (!ability.name || !ability.desc) continue;
	data["Pokemon Moves"].push(ability.name);
}

class Order extends Games.Game {
	constructor(room) {
		super(room);
		this.name=name;
		this.id = Toold.toId(name);
		this.answer = null;
		this.points = new Map();
		this.maxPoints = 5;
		this.categories = Object.keys(data);
		this.locations = [];
		this.category = null;
	}
	
	onStart() {
		this.askQuestion();
	}
	
	nextLetter() {
		if (this.locations.length === (this.answer.length - 1)) {
			this.say("All letters have been revealed! The answer was " + answer);
			this.answer = null;
			this.setTimeout(() => this.askQuestion(), 5*1000)
		}
		let other = [];
		for (i = 0; i < this.answer.length; i++) {
			if (this.locations.indexOf(i) == -1) {
				other.push(i);
			}
		}
		let value = Math.floor(Math.random() * other.length);
		this.locations.push(other[value]);
		this.locations.sort();
		let str = "";
		for (i = 0; i < locations.length; i++) {
			str += answer[locations[i]];
		}
		this.say("**" + category + "**: " + toUpperCase(str));
		this.setTimeOut(() => this.nextLetter(), 5*1000);
	}
	
	askQuestion() {
		this.category = this.categories[Math.floor(Math.random() * this.categories.length)];
		this.answer = this.data[categories][Math.floor(Math.random()) * this.data[categories].length];
		this.locations = [];
		this.nextLetter();
	}
	
	guess(guess, user) {
		if (!this.answer || guess != answer) return;
		clearTimeout(this.timeout);
		if (!(user.id in this.players)) this.addPlayer(user);
		let player = this.players[user.id];
		let points = this.points.get(player) || 0;
		points += 1;
		this.points.set(player, points);
		if (points >= this.maxPoints) {
			this.say("Correct! " + user.name + " wins the game! (Answer__" + answer + "__)");
			this.end();
			return;
		}
		this.say("Correct! " + user.name + " advances to " + points + " point" + (points > 1 ? "s" : "") + ". (Answer__" + answer + "__)");
		this.answers = null;
		this.timeout = setTimeout(() => this.askQuestion(), 5 * 1000);
	}
}