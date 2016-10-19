'use strict';

String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}

const name = "Hangman Bomb";
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
	data["Pokemon Items"].push(item.name);
}

for (let i in Tools.data.abilities) {
	let ability = Tools.data.abilities[i];
	if (!ability.name || !ability.desc) continue;
	data["Pokemon Abilities"].push(ability.name);
}

class HangmanBomb extends Games.Game {
	constructor(room) {
		super(room);
		this.name=name;
		this.id = Tools.toId(name);
		this.answer = null;
		this.points = new Map();
		this.categories = Object.keys(data);
		this.guessedLets = [];
		this.guessedWords = [];
		this.category = null;
		this.curGuesses = new Map();
		this.round = 0;
	}
	
	onStart() {
		this.askQuestion();
	}
	
	onJoin(user) {
		let player = this.players[user.id];
		this.points.set(player, 3);
		this.curGuesses.set(player, null);
		this.users[player]=user;
	}
	
	onLeave(user) {
		let player = this.players[user.id];
		this.points.set(player, null);
		this.curGuesses.set(player, null);
	}
	
	nextLetter() {
		var realAnswer = this.answer;
		this.answer = this.answer.toLowerCase();
		var str = Array(this.answer.length+1).join("_");
		var badstr = "";
		for (var i = 0; i < this.answer.length; i++) {
			if (this.answer[i] === ' ' || this.answer[i] === '-') {
				str = str.replaceAt(i, '/');
			}
		}
		if (this.round != 0) {
			for (let userID in this.players) {
				let player = this.players[userID];
				let guess = this.curGuesses.get(player);
				let points = this.points.get(player);
				let user = this.users[player];
				console.log("user " + user.name + " has " + points + " points");
				if (guess != "" && (!guess || guess.length > 1 || (guess.length == 1 && this.answer.split(guess).length === 1))) {
					
					this.points.set(player, points-1);
					if (points === 1) {
						let user = this.users[player];
						user.say("You have lost all your lives!");
						delete this.users[player];
						delete this.players[userID];
					}
				}
				this.curGuesses.set(player, null);
			}
			for (let letter in this.guessedLets) {
				var found = false;
				for (var i = 0; i < this.answer.length; i++) {
					if (this.answer[i] === this.guessedLets[letter]) {
						str = str.replaceAt(i, this.guessedLets[letter]);
						found = true;
					}
				}
				if (!found) {
					badstr += ( this.guessedLets[letter]+ " ");
				}
			}
		}
		else {
			this.round++;
		}
		this.room.say(str.split("").join(" ") + "| **" + this.category + "**| " + badstr);
		this.answer = realAnswer;
		this.timeout = setTimeout(() => this.nextLetter(), 10*1000);
	}
	askQuestion() {
		this.round = 0;
		var str = "";
		var numUsers = 0;
		for (let userID in this.players) {
			str += userID;
			str += ": (";
			let player = this.players[userID];
			str += this.points.get(player);
			str += "),";
			numUsers++;
		}
		if (numUsers === 1) {
			var name = "";
			for (let user in this.users) {
				name = this.users[user].name;
				break;
			}
			this.room.say(name + " has won the game!");
			this.end();
			return;
		}
		else if (numUsers === 0) {
			this.room.say("No winners this game! Better luck next time!");
			this.end();
			return;
		}
		else {
			this.guessedLets=[];
			this.guessedWords=[];
			this.category = this.categories[Math.floor(Math.random() * this.categories.length)];
			this.answer = data[this.category][Math.floor(Math.random() * data[this.category].length)];
			this.room.say(str);
			console.log(this.answer);
			this.nextLetter();
		}
	}
	guess(guess, user) {
		let player = this.players[user.id];
		if (!player) {
			return;
		}
		if (this.curGuesses[player]) {
			return;
		}
		guess = Tools.toId(guess);
		if (guess.length == 1) {
			if (this.guessedLets.indexOf(guess) == -1) {
				this.guessedLets.push(guess);
				
				this.curGuesses.set(player, guess)
			}
		}
		else {
			if (this.guessedWords.indexOf(guess) == -1) {
				this.guessedWords.push(guess);
				this.curGuesses.set(player, guess);
			}
		}
		if (guess == Tools.toId(this.answer)) {
			clearTimeout(this.timeout);
			let points = this.points.get(player);
			points += 1;
			this.points.set(player, points);
			this.room.say("Correct! " + user.name + " advances to " + points + " point" + (points > 1 ? "s" : "") + ". (Answer: __" + this.answer + "__)");
			this.answer = null;
			this.timeout = setTimeout(() => this.askQuestion(), 5 * 1000);
		}
	}
}

exports.name = name;
exports.description = "Hangman Bomb! Each player starts with 3 lives - if you guess the word, you gain a point, but every wrong answer you lose a point. Last survivor Wins!";
exports.game = HangmanBomb;