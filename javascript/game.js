exports = typeof window !== "undefined" && window !== null ? window : global;

exports.Game = function() {
  var players = new Array();
  var places = new Array();
  var purses = new Array();
  var penaltyBox = new Array();
  var questions = {Pop: new Array(), Science: new Array(), Sports: new Array(), Rock: new Array()};
  var currentPlayer = 0;
  
  for(var i = 0; i < Object.keys(questions).length; i++){
	  for(var j = 0; j < 50; j++){
		  questions[Object.keys(questions)[i]].push(Object.keys(questions)[i] + " Question " + j);
	  }
  }
  
this.didPlayerWin = function() {
	var correctAnswer = wasCorrectlyAnswered();
    if (purses[currentPlayer] == 6 && correctAnswer) {
		console.log("Player " + players[currentPlayer] + " won!");
		return true;
	} else {
		nextPlayer();
		return false;
	}
  };
  
  var nextPlayer = function() {
	  currentPlayer += 1;
      if(currentPlayer == players.length)
        currentPlayer = 0;
  };

  var currentCategory = function(){
	  switch(places[currentPlayer]) {
		case 0:
		case 4:
		case 8:
			return 'Pop';
		case 1:
		case 5:
		case 9:
			return 'Science';
		case 2:
		case 6:
		case 10:
			return 'Sports';
		default:
			return 'Rock';
	  }
	};

  this.add = function(playerName){
    players.push(playerName);
    places[players.length - 1] = 0;
    purses[players.length - 1] = 0;
    penaltyBox[players.length - 1] = {inPenaltyBox: false, isGettingOutOfPenaltyBox: false};

    console.log(playerName + " was added");
    console.log("They are player number " + players.length);
  };


  var askQuestion = function(){
	console.log(questions[currentCategory()].shift());
  };
  
  var updatePlaces = function(roll) {
	  places[currentPlayer] = places[currentPlayer] + roll;
      if(places[currentPlayer] > 11){
		places[currentPlayer] = places[currentPlayer] - 12;
      }
      console.log(players[currentPlayer] + "'s new location is " + places[currentPlayer]);
      console.log("The category is " + currentCategory());
      askQuestion();
  }

  this.roll = function(roll){
    console.log(players[currentPlayer] + " is the current player");
    console.log("They have rolled a " + roll);

    if(penaltyBox[currentPlayer].inPenaltyBox){
      if(roll % 2 != 0){
        penaltyBox[currentPlayer].isGettingOutOfPenaltyBox = true;
        console.log(players[currentPlayer] + " is getting out of the penalty box");
        updatePlaces(roll);
      }else{
		penaltyBox[currentPlayer].isGettingOutOfPenaltyBox = false;
        console.log(players[currentPlayer] + " is not getting out of the penalty box");
      }
    }else{
      updatePlaces(roll);
    }
  };

  var wasCorrectlyAnswered = function(){
    if(penaltyBox[currentPlayer].inPenaltyBox){
      if(!penaltyBox[currentPlayer].isGettingOutOfPenaltyBox){
        nextPlayer();
        return false;
      }
	}
    console.log("Answer was correct!!!!");
    purses[currentPlayer]++;
    console.log(players[currentPlayer] + " now has " +
                purses[currentPlayer]  + " Gold Coins.");
    return true;
  };

  this.wrongAnswer = function(){
	console.log('Question was incorrectly answered');
	console.log(players[currentPlayer] + " was sent to the penalty box");
	penaltyBox[currentPlayer].inPenaltyBox = true;
	nextPlayer();
  };
};

var winner = false;

var game = new Game();

game.add('Chet');
game.add('Pat');
game.add('Sue');

do{

  game.roll(Math.floor(Math.random()*6) + 1);

  if(Math.floor(Math.random()*10) == 7){
    game.wrongAnswer();
  }else{
    winner = game.didPlayerWin();
  }

}while(!winner);
