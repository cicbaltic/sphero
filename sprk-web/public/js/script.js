//*******************************************
//ALL IN ONE FILE
//*******************************************

//================================================
//Memory in RAMS
//------------------------------------------------
//Information About the player
var playerName = "";
var playerID = "";
var tempID = 0;
var spheroColor = {};
var zeroPoint = 0;
var alreadyOnGame = false;
//Information about Sphero
var vagammaBetaAlpha = [];
var acceleration = [];
var accelerationGravity = [];
var rotationRate =[];
var lastDirection = 0;
var directionMemory = [];
var tmpZero = 0;
var spheroSlot = 99;
var buttonHasBeenPressed = false;

//Finger Status for Button
var finger = false;




$(window).load(function informationGetter()
{
	var wsproxy = 'ws://sprk-ws.mybluemix.net/';

    //using wildcards is fine, but you should URL-encode it first
    var topic = 'player'; // type: registered
	 var primus = new Primus(wsproxy + '?topic=' + topic);
	primus.on('open', function open() {
  		console.log("VS open");
			var someText = {"topic": "player", "type":"gameInfoRequest"};
			serverStuff(someText);
	 });
    primus.on('data', function onmsg(data) {


			console.log(data);
			var mess = data["message"];
			//console.log(mess);
			if(data["type"] == "registered" && mess["tempID"] == tempID && playerID == "")
			{
				if(mess["ok"] == true)
				{
					var tmpName = playerName;
					var tmpID =	mess["id"];
					//var tmpColor = spheroColor;
					var cookieInfo = {"playerName": tmpName, "playerID": tmpID, "color": spheroColor};
					setCookie(JSON.stringify(cookieInfo));
					console.log(mess);
					playerID = mess["id"];
					$("#registrationRoom").css("display","none");
					//$("#colorPickerTable").css("display","none");
					$("#waitingRoom").css("display","initial");
				}
				else
				{
					console.log("Something happened");
				}
			}
			else if(data["type"] == "newPlayerAssigned")
			{
				console.log(data);
				player = mess["player"];
				console.log(mess);
				console.log(player);
				spheroSlot = mess["slot"];
				console.log("SLOT: " + spheroSlot);
				console.log(playerID);
				console.log(player["_id"]);
				console.log(playerID +" AND  "+ player["_id"])
				if(player["_id"] == playerID)
				{
					console.log("YES");
					$("#waitingRoom").css("display","none");
					$("#gameRoom").css("display","none");
					$("#gameButton").css("display","none");
					$("#waitingForPlayer").css("display","none");
					$("#calibrationRoom").css("display","initial");
				}
			}
			else if(data["type"] == "gameStatusChanged")
			{
				if(mess["state"] == "iddle")
				{
					if(mess.hasOwnProperty('player1') && mess.hasOwnProperty('player2'))
					{
						if(mess["player1"] == playerID || mess["player2"] == playerID)
						{
							$("#gameRoom").css("display","none");
							$("#waitingRoom").css("display","none");
							$("#calibrationRoom").css("display","initial");
						}
					}
					else if(mess.hasOwnProperty('player1'))
					{
						if(mess["player1"] == playerID)
						{
							$("#gameRoom").css("display","none");
							$("#waitingRoom").css("display","none");
							$("#calibrationRoom").css("display","initial");
						}
					}
					else if(mess.hasOwnProperty('player2'))
					{
						if(mess["player2"] == playerID)
						{
							$("#gameRoom").css("display","none");
							$("#waitingRoom").css("display","none");
							$("#calibrationRoom").css("display","initial");
						}
					}
					else
					{
						$("#calibrationRoom").css("display","none");
						$("#gameRoom").css("display","none");
						$("#waitingRoom").css("display","initial");
					}
				}
				else if(mess["state"] == "running")
				{

					if(mess.hasOwnProperty('player1') && mess.hasOwnProperty('player2'))
					{
						if(mess["player1"] == playerID || mess["player2"] == playerID)
						{
							$("#waitingForPlayer").css("display","none");
							$("#gameRoom").css("display","initial");
							$("#waitingRoom").css("display","none");
							$("#calibrationRoom").css("display","none");
							$("#gameButton").css("display","initial");
						}
					}
					else if(mess.hasOwnProperty('player1'))
					{
						if(mess["player1"] == playerID)
						{
							$("#waitingForPlayer").css("display","none");
							$("#gameRoom").css("display","initial");
							$("#waitingRoom").css("display","none");
							$("#calibrationRoom").css("display","none");
							$("#gameButton").css("display","initial");
						}
					}
					else if(mess.hasOwnProperty('player2'))
					{
						if(mess["player2"] == playerID)
						{
							$("#waitingForPlayer").css("display","none");
							$("#gameRoom").css("display","initial");
							$("#waitingRoom").css("display","none");
							$("#calibrationRoom").css("display","none");
							$("#gameButton").css("display","initial");
						}
					}
					else
					{
						$("#waitingForPlayer").css("display","none");
						$("#gameRoom").css("display","initial");
						$("#waitingRoom").css("display","none");
						$("#calibrationRoom").css("display","none");
						$("#gameButton").css("display","initial");
					}


					$("#waitingRoom").css("display","none");
					$("#waitingForPlayer").css("display","none");
					$("#calibrationRoom").css("display","none");
					$("#gameRoom").css("display","initial");
					$("#gameButton").css("display","initial");
				}
				else if(mess["state"] == "finished")
				{
					if(mess.hasOwnProperty('winner'))
					{
						if(buttonHasBeenPressed == false)
						{
							buttonHasBeenPressed = true;
							if(mess.hasOwnProperty('player1') && mess.hasOwnProperty('player2'))
							{
								var player1 = mess["player1"];
								var player2 = mess["player2"];
								var winner = mess["winner"];

								if(player1 == playerID)
								{
									if(winner == spheroSlot)
									{
										$("#calibrationRoom").css("display","none");
										$("#gameRoom").css("display","none");
										$("#resultRoomWin").css("display","initial");
									}
									else
									{
										$("#calibrationRoom").css("display","none");
										$("#gameRoom").css("display","none");
										$("#resultRoomLost").css("display","initial");
									}
								}
								else if(player2 == playerID)
								{
									if(winner == spheroSlot)
									{
										$("#calibrationRoom").css("display","none");
										$("#gameRoom").css("display","none");
										$("#resultRoomWin").css("display","initial");
									}
									else
									{
										$("#calibrationRoom").css("display","none");
										$("#gameRoom").css("display","none");
										$("#resultRoomLost").css("display","initial");
									}
								}
							}
							else if(mess.hasOwnProperty('player1'))
							{
								var player1 = mess["player1"];
								var winner = mess["winner"];
								if(player1 == playerID)
								{
									if(winner == spheroSlot)
									{
										$("#calibrationRoom").css("display","none");
										$("#gameRoom").css("display","none");
										$("#resultRoomWin").css("display","initial");
									}
									else
									{
										$("#calibrationRoom").css("display","none");
										$("#gameRoom").css("display","none");
										$("#resultRoomLost").css("display","initial");
									}
								}
							}
							else if(mess.hasOwnProperty('player2'))
							{
								var player2 = mess["player2"];
								var winner = mess["winner"];
								if(player2 == playerID)
								{
									if(winner == spheroSlot)
									{
										$("#calibrationRoom").css("display","none");
										$("#gameRoom").css("display","none");
										$("#resultRoomWin").css("display","initial");
									}
									else
									{
										$("#calibrationRoom").css("display","none");
										$("#gameRoom").css("display","none");
										$("#resultRoomLost").css("display","initial");
									}
								}
							}
						}
					}
					else
					{
						$("#calibrationRoom").css("display","none");
						$("#gameRoom").css("display","none");
						$("#waitingRoom").css("display","initial");
					}
				}
			}
    });
});



$("#nameInput").change(function(){
	document.getElementById("nameInput").style.borderColor = 'green';
});

$(window).load(function isNotEmpty()
{
	var pnama = document.getElementById("nameInput").value;

	if (pnama != "" && pnama != null)
	{
		document.getElementById("nameInput").style.borderColor = 'green';
	}
	var an = jQuery.isEmptyObject(spheroColor);
	if (an == false)
	{
		document.getElementById("selectedColor").style.borderColor = 'green';
	}
});

function backToWaiting()
{
	$("#resultRoomWin").css("display","none");
	$("#resultRoomLost").css("display","none");
	$("#waitingRoom").css("display","initial");
}
//================================================
//Check if supported
//------------------------------------------------


//================================================
//Check cookies
//------------------------------------------------
function checkCookies()
{


	if(getCookie() != "")
	{
		var cookie = JSON.parse(getCookie());

		playerName = cookie["playerName"];
		playerID = cookie["playerID"];
		spheroColor = cookie["color"];
		console.log(playerName + " " +playerID);
		$("#loadingRoom").css("display","none");
		$("#waitingRoom").css("display","initial");
	}
	else
	{
		console.log("No cookies");
		$("#loadingRoom").css("display","none");
		$("#registrationRoom").css("display","initial");
	}
}

//================================================
//Registration
//------------------------------------------------
//Nothing Here All to other file

//================================================
//Waiting Room
//------------------------------------------------
//================================================
//Calibration
//------------------------------------------------
function calibratino()
{
	calibration();
}

//================================================
//Game Room
//------------------------------------------------
function touchBegins()
{
	finger = true;
	gammaBetaAlpha = [];
	lastDirection = 0;
	acceleration = [];
	accelerationGravity = [];
	rotationRate =[];
	payload = {};
}

function touchEnds()
{
	finger = false;
	payload = {
		"playerName" : playerName,
		"gammaBetaAlpha": gammaBetaAlpha,
		"acceleration": acceleration,
		"accelerationGravity": accelerationGravity,
		"rotationRate": rotationRate
	};
   directionMemory.push({"lDir": lastDirection});
	var motion = {"maxAccel": interpretMotion(payload)};
	var direction = lastDirection;

	var calibrationAlpha = zeroPoint;
	var phoneAlpha = lastDirection;
	var hitAlpha = calibrationAlpha - phoneAlpha;
	var spheroHeading;

	if (hitAlpha == 360) {
    spheroHeading = 0;
	} else if (hitAlpha < 0) {
    spheroHeading = 360 + hitAlpha
	} else if (hitAlpha >= 0) {
    spheroHeading = hitAlpha
	} else {
    spheroHeading = 0
    console.log("This shouldn't happen");
	}

	//var someInfo = {"Phones Zero": zeroPoint, "Phones Dir": lastDirection, "Sphero dir": spheroHeading};
	console.log(Math.round(interpretMotion(payload)));
   var messageToServer = {"topic": "player", "type": "throw", "message": {"playerID": playerID, "maxAccel": Math.round(interpretMotion(payload)), "direction": spheroHeading}};
	serverStuff(messageToServer);


}

function deleteCookies()
{
	document.cookie = "playerInformation=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
}

function setCookie(cvalue)
{
   var d = new Date();
   d.setTime(d.getTime() + (1*24*60*60*1000));
   var expires = "expires="+d.toUTCString();
   document.cookie = "playerInformation=" + cvalue + "; " + expires;
}

function getCookie() {
    var name = "playerInformation=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}
//=================================================


//=================================================
//Registration
//=================================================
function registerMale()
{
	registration("male");
}

function setColor(color)
{

	var m = color.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
	 if( m) {
			 R = m[1];
			 G = m[2];
			 B = m[3];
	 }

	//document.getElementById("selectedColor").style.backgroundColor = color;
	spheroColor = {"red": R, "green": G,"blue": B};
}

function registerFemale()
{
	registration("female");
}

function registration(gender)
{
	var pgender = gender;
	var pname = document.getElementById("nameInput").value;
	var page = document.getElementById("ageInput").value;
	playerName = pname;
	tempID = Math.floor((Math.random() * 1000000) + 1);
	if(pname == "")
	{
		document.getElementById("nameInput").style.borderColor = 'red';
		//Show Message enter your name
		$("#notSelectedName").css("display","none");
	}
	else if(pname != "")
	{
		document.getElementById("nameInput").style.borderColor = 'green';
		$("#notSelectedName").css("display","none");
	}



	var color = jQuery.isEmptyObject(spheroColor);
	if(color == true )
	{
		document.getElementById("selectedColor").style.borderColor = 'red';
		$("#notSelectedColor").css("display","initial");
	}
	else if (color == false)
	{
		document.getElementById("selectedColor").style.borderColor = 'green';
		$("#notSelectedColor").css("display","none");
	}

	var isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
		  Chrome: function(){
				return navigator.userAgent.match(/Chrome/i);
			},
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };

	var mobile = "Other";
	var uses = "Unknown";

	if( isMobile.Android() ) mobile = "Android";
	if( isMobile.BlackBerry() ) mobile = "BlackBerry";
	if( isMobile.iOS() ) mobile = "iOS";
	if( isMobile.Windows() ) {mobile = "Windows Phone"; uses = "IEMobile";}

	if( isMobile.Opera() ) uses = "Opera Mini";
	if( isMobile.Chrome() ) uses = "Chrome";


	if(pname != "" && color == false)
//	if(pname != "")
	{
		if (page != null && page != "")
		{
			var informationToSend = {"topic": "player", "type": "registration", "message": {"playerName": pname, "playerAge": page, "playerGender": gender, "mobile": mobile, "uses": uses, "sColor": spheroColor, "tempID": tempID}};
		}
		else
		{
			var informationToSend = {"topic": "player", "type": "registration", "message": {"playerName": pname, "playerGendre": pgender, "mobile": mobile, "uses": uses, "sColor": spheroColor, "tempID": tempID}};
		}
		serverStuff(informationToSend);

		//$("#registrationRoom").css("display","none");
		//$("#calibrationRoom").css("display","initial");

	}
}

//=================================================

//=================================================
//SERVER SIDE SENDERS AND GETTERS
//=================================================
function serverStuff(payload)
{
	//kreipimasis i ta app, kad siusti message
	var xmlhttp = new XMLHttpRequest();
	var url = "./msg";
	xmlhttp.open("POST", url, true);
	xmlhttp.setRequestHeader("Content-type","application/json");
	xmlhttp.send(JSON.stringify(payload));
	return xmlhttp.ResponseText;
}

//================================================

//================================================
//Calibration
//================================================
function calibration()
{
	zeroPoint = tmpZero;
	var messageToServer = {"topic": "player", "type": "calibration", "message": {"playerID" : playerID, "direction": zeroPoint}};
	serverStuff(messageToServer);
	$("#calibrationRoom").css("display","none");
	$("#waitingForPlayer").css("display","initial");
	$("#gameButton").css("display","none");
	$("#gameRoom").css("display","initial");
}
//================================================

//================================================
//Device Motion and so on
//================================================
// Let's calculate max accel ============
function interpretMotion(payload) {
	var accelRawArray = payload["acceleration"];
	var processedAccel = [];
	for(var i = 0; i < accelRawArray.length; i++) {
		var currAccel = accelRawArray[i];
		var totAccel = (Math.abs(currAccel["X"]) + Math.abs(currAccel["Y"]) + Math.abs(currAccel["Z"]));
		processedAccel.push(totAccel);
	};
	return Math.max.apply(null, processedAccel);
}

// gammaBetaAlpha ====================================
function gammaBetaAlphaAddToMemory(gamma, beta, alpha)
{
	var info = {"gamma":gamma,"beta":beta,"alpha":alpha};
	lastDirection = alpha;
	gammaBetaAlpha.push(info);
	return;
}
//=====================================================

// acceleration =======================================
function accelerationAddToMemory(x,y,z)
{
	var info = {"X":x,"Y":y,"Z":z};
	acceleration.push(info);
	return;
}
//=======================================

// accelerationGravity =======================================
function accelerationGravityAddToMemory(x,y,z)
{
	var info = {"X":x,"Y":y,"Z":z};
	accelerationGravity.push(info);
	return;
}
//=======================================

// rotationRate =======================================
function rotationRateAddToMemory(x,y,z)
{
	var info = {"X":x,"Y":y,"Z":z};
	rotationRate.push(info);
	return;
}
//=======================================

// devOrientation =======================================
$(function deviceOrientation()
{
	if (window.DeviceOrientationEvent)
	{
     	document.getElementById("doEvent").innerHTML = "DeviceOrientation";
     	// Listen for the deviceorientation event and handle the raw data
     	window.addEventListener('deviceorientation', function(eventData)
     	{
        	// gamma is the left-to-right tilt in degrees, where right is positive
        	var tiltLR = eventData.gamma;
        	// beta is the front-to-back tilt in degrees, where front is positive
        	var tiltFB = eventData.beta;
        	// alpha is the compass direction the device is facing in degrees
        	var dir = eventData.alpha
        	// call our orientation event handler
        	deviceOrientationHandler(tiltLR, tiltFB, dir);
			console.log(tiltLR);
     	}, false);
   }
   else
   {
		console.log("Not supported on your device or browser.  Sorry.");
   }
});

function deviceOrientationHandler(tiltLR, tiltFB, dir)
{
	document.getElementById("doTiltLR").innerHTML = Math.round(tiltLR);
   document.getElementById("doTiltFB").innerHTML = Math.round(tiltFB);
   document.getElementById("doDirection").innerHTML = Math.round(dir);
	tmpZero = Math.round(dir);
	if (finger == true)
   {
		gammaBetaAlphaAddToMemory(Math.round(tiltLR),Math.round(tiltFB),Math.round(dir));
   }
   // Apply the transform to the image
   var logo = document.getElementById("imgLogo");
   logo.style.webkitTransform = "rotate("+ tiltLR +"deg) rotate3d(1,0,0, "+ (tiltFB*-1)+"deg)";
   logo.style.MozTransform = "rotate("+ tiltLR +"deg)";
   logo.style.transform = "rotate("+ tiltLR +"deg) rotate3d(1,0,0, "+ (tiltFB*-1)+"deg)";
}

// devMovement =======================================
$(function deviceMotion()
{
	if ((window.DeviceMotionEvent) || ('listenForDeviceMovement' in window))
	{
   	window.addEventListener('devicemotion', deviceMotionHandler, false);
   }
	else
	{
		console.log("Not supported on your device or browser.  Sorry.");
   }
});

function deviceMotionHandler(eventData)
{
	var info, xyz = "[X, Y, Z]";

   // Grab the acceleration including gravity from the results
   var acceleration = eventData.acceleration;
   info = xyz.replace("X", round(acceleration.x));
   info = info.replace("Y", round(acceleration.y));
   info = info.replace("Z", round(acceleration.z));
   document.getElementById("moAccel").innerHTML = info;

   if (finger == true)
   {
    	var x = round(acceleration.x);
     	var y = round(acceleration.y);
     	var z = round(acceleration.z);
     	accelerationAddToMemory(x,y,z);
   }

   // Grab the acceleration including gravity from the results
   acceleration = eventData.accelerationIncludingGravity;
   info = xyz.replace("X", round(acceleration.x));
   info = info.replace("Y", round(acceleration.y));
   info = info.replace("Z", round(acceleration.z));
   document.getElementById("moAccelGrav").innerHTML = info;

	if (finger == true)
   {
     	var x = round(acceleration.x);
     	var y = round(acceleration.y);
     	var z = round(acceleration.z);
     	accelerationGravityAddToMemory(x,y,z);
   }

   // Grab the acceleration including gravity from the results
   var rotation = eventData.rotationRate;
   info = xyz.replace("X", round(rotation.alpha));
   info = info.replace("Y", round(rotation.beta));
   info = info.replace("Z", round(rotation.gamma));
   document.getElementById("moRotation").innerHTML = info;

	if (finger == true)
   {
     	var x = round(rotation.alpha);
     	var y = round(rotation.beta);
     	var z = round(rotation.gamma);
     	rotationRateAddToMemory(x,y,z);
   }

   info = eventData.interval;
   document.getElementById("moInterval").innerHTML = info;
}

function round(val)
{
	var amt = 10;
   return Math.round(val * amt) /  amt;
}
//===========================================================

$(function letsCheckSomeStuff()
{
	checkCookies();
});
