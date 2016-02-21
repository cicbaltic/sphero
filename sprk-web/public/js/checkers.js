//**********************
//Checks if accelerometer gyroscope
//Checks if this app supporst users device's accelerometer and gyroscope
//If supports opens a registration button
//**********************

function deviceCheckUp()
{
	var count = 0;	
	if (((window.DeviceMotionEvent) || ('listenForDeviceMovement' in window)) && document.getElementById("moAccel").innerHTML != ""
						&& document.getElementById("moAccelGrav").innerHTML != "" && document.getElementById("moRotation").innerHTML != "")
	{
		count += 1;
   }	
	if (window.DeviceOrientationEvent && document.getElementById("doTiltLR").innerHTML != "" && document.getElementById("doTiltFB").innerHTML != "" 
			&& document.getElementById("doDirection").innerHTML != "")
	{
		count += 1;
   }

	if(count >= 0)
	{
		count = 0;
		alert("Your device is supported");
		$("#checkCompability").css("display","none");
		$("#registrationParts").css("display","initial");
	}
	else
	{
		alert("Your device is not supported"); 
	}
}



