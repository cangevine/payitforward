var app = {
    // Application Constructor
    initialize: function() {
		$.support.cors = true;
		$.mobile.allowCrossDomainPages = true;
		
		this.userID = 0;
		this.userPIN = 0;
		this.locationID = 29;
		this.bound = false;
		
        this.bindEvents();
		
		var locId = getParameterByName('locId');
		function getParameterByName(name) {
			name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
			var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
			results = regex.exec(location.search);
			return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
		}
    },
	
	sendQRToDB: function(locNum) {
		$.ajax({
		type:"Post",
		url: "http://cs1.friendscentral.org/payitforward/submission/submit.php",
		data: { userID: app.userID, locationID: locNum}
		}).success(function(data){
			if(data == "You have already scanned this"){
				alert("You already scanned this QR Code");
			}else{
				alert("Congratulations, you earned a point!");
				$.mobile.changePage( "#about", { transition: "pop", changeHash: false });
				app.totals();
			}
		});
	},
	
	createUser: function() {
		var x = document.getElementById("username");
		var usr = $("#username").val();
		$("#username_span").html(usr);
	//	$.mobile.changePage( "#about", { transition: "pop", changeHash: false });
	
		$.ajax({
			type: "POST",
			url: "http://cs1.friendscentral.org/payitforward/users/create.php",
			data: { username: usr}
			}).success(function(data) {
				alert(data);
				if (data == "failure") {
					alert("Oops! We hit an error.");
				} else {
					//var tmp = data.split(",");
					userID = data;
					app.userID = data;
					app.userPin();
					$.mobile.changePage( "#about", { transition: "pop", changeHash: false });
				}
			}).error(function() {
				alert("could not work...");
		});
	},
	
	totals: function() {
		$.ajax({
		type:"GET",
		url: "http://cs1.friendscentral.org/payitforward/submission/tally_sub.php",
		data: { userID: app.userID}
		}).success(function(data) {
			var pointTally = data;
			$("#pTotals").html(pointTally);
			$("#pTotals1").html(pointTally);
		}).error(function() {
			alert("could not work...sorry");
		});
	},
	
	userPin: function() {
		$.ajax({
		type:"POST",
		url: "http://cs1.friendscentral.org/payitforward/users/create.php",
		data: { userID: app.userID}
		}).success(function(data){
			$("#cashInID").html(app.userID);
		}).error(function() {
			alert("could not work...sorry");
		});
	},
	
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // `load`, `deviceready`, `offline`, and `online`.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.getElementById('scan').addEventListener('click', this.scan, false);
        document.getElementById('encode').addEventListener('click', this.encode, false);
		
		document.getElementById('createBtn').addEventListener('click', this.createUser, false);
		document.getElementById('btn').addEventListener('click', this.scan, false);
		app.bound = true;
    },

    // deviceready Event Handler
    //
    // The scope of `this` is the event. In order to call the `receivedEvent`
    // function, we must explicity call `app.receivedEvent(...);`
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
		console.log("Anyone home??? Device is now ready...!");
		this.uuid = device.uuid;
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },

    scan: function() {
        console.log('scanning...!');
        
        var scanner = cordova.require("cordova/plugin/BarcodeScanner");
		
		console.log(scanner);
        scanner.scan( function (result) { 
			
            console.log("Scanner result: \n" +
                 "text: " + result.text + "\n" +
                 "format: " + result.format + "\n" +
                 "cancelled: " + result.cancelled + "\n");
			
            //document.getElementById("scanResult").innerHTML = result.text;
			app.sendQRToDB(result.text);
            console.log(result);

        }, function (error) { 
            console.log("Scanning failed: ", error); 
        } );
    },

    encode: function() {
		console.log("Trying to encode now!");
        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.encode(scanner.Encode.TEXT_TYPE, "http://www.friendscentral.org", function(success) {
            alert("encode success: " + success);
          }, function(fail) {
            alert("encoding failed: " + fail);
          }
        );

    }

};