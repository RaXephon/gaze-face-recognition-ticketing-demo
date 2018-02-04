BASE_GAZE_URL = "http://184.105.3.13:3000"

function gazeMakeHTTPRequest(url, params, method, callback) {
	var http = new XMLHttpRequest();

	http.open("POST", url, true);
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	http.onreadystatechange = function() {//Call a function when the state changes.
		if(http.readyState == 4) {
			callback(http);
		}
	}


	http.send(params);
}

// Used to get ticket information on all faces on an image 
// Pass in IMAGE  (base64 encoded JPEG image string), ACCESSTOKEN, EVENTID, a success callback and a failure callback
// Success callback will receive a data object -- sample: {"names": ["Shehzad", "Rob"], "users": [{"ticketId": "abc", "name": "Shehzad", "email": ""},{"ticketId": "abc", "name": "Rob", "email": ""}]}
// Failure callback will receive either nothing or a data object (Depending on the kind of error)
function gazeCheckIn(image, accesstoken, eventId, callbackSuccess, callbackFailure) {

	var url = BASE_GAZE_URL + "/checkin/" + encodeURIComponent(eventId) + "?access_token=" + encodeURI(accesstoken);
	var params = "image=" + encodeURIComponent(image);

	gazeMakeHTTPRequest(url, params, "POST", function(http) {
		if (http.status != 200) {
			callbackFailure();
		}

		data = JSON.parse(http.responseText);

		if (data.success) {
			callbackSuccess(data);
		} else {
			callbackFailure(data);
		}

	})
}


// Used to associate tickets with faces
// Pass in IMAGE (base64 encoded JPEG image string), EVENT ID, TICKET ID, NAME, EMAIL (can be empty string), a success callback and a failure callback
// Success callback will receive a data object -- this function being called implies registration is complete
// Failure callback will receive either nothing or a data object (Depending on the kind of error)
function gazeRegister(image, eventId, ticketId, name, email, callbackSuccess, callbackFailure) {
	var url = BASE_GAZE_URL + "/register";
	var params = "eventId=" + encodeURIComponent(eventId) + "&ticketId=" + encodeURIComponent(ticketId) + "&name=" + encodeURIComponent(name) + "&email=" + encodeURIComponent(email) + "&image=" + encodeURIComponent(image) ;

	gazeMakeHTTPRequest(url, params, "POST", function(http) {
		if (http.status != 200) {
			callbackFailure();
		}

		data = JSON.parse(http.responseText);

		if (data.success) {
			callbackSuccess(data);
		} else {
			callbackFailure(data);
		}

	})

}