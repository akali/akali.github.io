var audio = new Audio ('/Music/A_LIGHT_THAT_NEVER_COMES.mp3');
var audio2 = new Audio ('/Music/I_BET_YOU_LOOK_GOOD_ON_THE_DANCEFLOOR.mp3');
var Player = Math.random() < 0.5 ? audio : audio2;
Player.play();