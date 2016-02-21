var acel2 = false;

function testIfCanRun()
{
	var orie = false;	
	if (deviceOrientation2() == true)
	{
		orie = true;
	}
	if(deviceMotion2() == true)
	{
		acel2 = true;
	}
	var answ = {"acel": acel2, "orie": orie};
	return answ;
}


function deviceOrientation2()
{
	alert("cia");	
	if (window.DeviceOrientationEvent)
	{
     	//document.getElementById("doEvent").innerHTML = "DeviceOrientation";
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
			alert(tiltLR);			
			if(tiltLR != null && tiltFB != null  && dir != null)
			{
				return true;
			}
			else
			{
				return false;
			}
        	//deviceOrientationHandler2(tiltLR, tiltFB, dir);
     	}, false);
   }
   else
   {
		console.log("Not supported on your device or browser.  Sorry.");
		return false;		
   }	
	
}


// devMovement =======================================
function deviceMotion2()
{
	if ((window.DeviceMotionEvent) || ('listenForDeviceMovement' in window))
	{	
		window.addEventListener('devicemotion', deviceMotionHandler, false);
   }
	else
	{
		console.log("Not supported on your device or browser.  Sorry.");
		acel2 = false;      
   }
}

function deviceMotionHandler(eventData)
{
   // Grab the acceleration including gravity from the results
   var acceleration = eventData.acceleration;
   var x = round(acceleration.x);
   var y = round(acceleration.y);
   var z = round(acceleration.z);
	if(x != null && y != null && z != null)
	{
		acel2 = true;
	}
	else
	{
		acel2 = false;
	}
}

function round(val)
{
	var amt = 10;
   return Math.round(val * amt) /  amt;
}
