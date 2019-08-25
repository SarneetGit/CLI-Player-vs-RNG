var inquire = require("inquirer");
var Player = require('./player');

Player.prototype.printStats = function() {
    console.log(`${this.name} is a ${this.position} whose has an offensive rating of ${this.offense} and defensive rating of ${this.defense}.`)
}

Player.prototype.goodGame = function() {
    let randInt = Math.floor(Math.random())
    if (randInt > .5) {
        this.offense ++
    }
    else {
        this.defense ++
    }
}

Player.prototype.badGame = function() {
    let randInt = Math.floor(Math.random())
    if (randInt > .5) {
        this.offense --
    }
    else {
        this.defense --
    }
}

var count = 0

var team = []

var score = 0

var round = 1

var addPlayer = function() {
    if (count < 3) {
        inquire.prompt([
            {
                name : "name",
                type : "input",
                message : "What is your name, player?"
            },
            {
                name : "position",
                type : "input",
                message : "What position do you play?"
            },
            {
                name : "offense",
                type : "number",
                message : "What is your offensive rating?",
                validate : function(answer) {
                    if (answer > 11) {
                        return `Please enter a number 10 or less\n`
                    }
                    return true
                }
            },
            {
                name : "defense",
                type : "number",
                message : "What is your defensive rating?",
                validate : function(answer) {
                    if (answer > 11) {
                        return `Please enter a number 10 or less\n`
                    }
                    return true
                }
            }
        ]).then(function(answers) {
            
            var newPlayer = new Player(answers.name, answers.position, answers.offense, answers.defense)

            team.push(newPlayer);
            
            count++;

            addPlayer()
            
        })
    }
    else {
        for (var i = 0; i < team.length; i++) {
            team[i].printStats();
        }
        playGame();
    }
}

 addPlayer()


function sub(){
    inquire.prompt(
        {
            name : "subPlayer",
            type : 'confirm',
            message : "Would you like to Sub out a player?",
            default : false
        }
    ).then(function(answer){
        if (answer.subPlayer) {
            inquire.prompt({
                message : `Which player would you like to sub? ${team[0].name}(use 1) or ${team[1].name}(use 2)`,
                name : "playerIndex",
                type: "number"
            }).then(function(answer){
                let sub = team[2]
                let adjustedIndex = answer.playerIndex - 1
                team[2] = team[adjustedIndex]
                team[adjustedIndex] = sub
                playRound()
            })
        }
        else {
            playRound()
        }
    })
}

function playRound() {
    console.log(`---------Round ${round}---------`)
    let enemyOffense = Math.floor(Math.random() * 20)
    let enemyDefense = Math.floor(Math.random() * 20)

    if (team[0].offense+team[1].offense > enemyDefense) {
        console.log(`Offensive Round Win! ${enemyDefense}`)
        score ++
    }
    else if (team[0].offense+team[1].offense < enemyDefense) {
        console.log(`Offensive Round Loss! ${enemyDefense}`)
        score --
    }
    else {
        console.log(`Offensive Round Tie! ${enemyDefense}`)
    }

    if (team[0].defense+team[1].defense > enemyOffense) {
        console.log(`Defensive Round Win! ${enemyOffense}`)
        score ++
    }
    else if (team[0].defense+team[1].defense < enemyOffense) {
        console.log(`Defensive Round Loss! ${enemyOffense}`)
        score --
    }
    else {
        console.log(`Defensive Round Tie! ${enemyOffense}`)
    }
    round++
    console.log(`Score: ${score}`)
    if (round <=5) {
        sub()
    }
    else {
        if (score > 0) {
            for (i=0; i < team.length-1; i++) {
                team[i].goodGame()
                team[i].printStats()
                console.log('this ran')
            }
        }
        else if (score < 0) {
            for (i=0; i < team.length-1; i++) {
                team[i].badGame()
                team[i].printStats()
                console.log('this ran')
            }
        }
        inquire.prompt(
            {
                name : "playAgain",
                type : 'confirm',
                message : "Play Again?",
                default : false
            }
        ).then(function(answer){
            if (answer.playAgain) {
                console.log(answer)
                playGame()
            }
        })
    }
}

function playGame() {
    if (team.length > 0) {
        let score = 0
        playRound()
    }
}

