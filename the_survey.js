var TheSurvey = class {
	constructor() {
		this.backgroundImage = null;
		this.bottomContainer = null;

		this.MALL_OPTIONS = [
			["What is your name?", "My name is Susan.",
								   "My name is Yasmin."],
			["What is your age?", "I am {MALL_AGE} years old."], // {AGE} = 18-25
			["What is your occupation?", "I am currently unemployed.",
										 "I work at a restaurant.",
										 "I am a student."],
			["What is your gender?", "Female."],
			["What is yours cup size?", "My cupsize is {MALL_CUP_SIZE}."], // {CUP_SIZE} = AA B C D DD
			["What is your shoe size?", "It's a {MALL_SHOE_SIZE}."], // {SHOE_SIZE} = 5-12
			["What is your height?", "I am {MALL_HEIGHT_FEET} feet {MALL_HEIGHT_INCHES} inches tall."], // {HEIGHT_FEET} = 4 or 5 ; {HEIGHT_INCHES} = 0 - 11
			["Do you like software?", "No", "Yes"]
		];
		this.mallOptions = this.MALL_OPTIONS;
		this.mallAge = Math.max(18, Math.round(Math.random() * 25));
		var cups = ["AA", "B", "C", "D", "DD"];
		this.mallCupSize = cups[Math.round(Math.random() * (cups.length - 1))];
		this.mallShoeSize = Math.max(5, Math.round(Math.random() * 12));
		this.mallHeightFeet = Math.round(Math.random()) === 0 ? 4 : 5;
		this.mallHeightInches = Math.round(Math.random() * 11);

		this.SHOE_STORE_OPTIONS = [
			["Do you have pets?", "No.", "Yeah. One mischevious cat."],
			["Would you like a new phone after this?", "Yes.", "No."],
			["You have nice feet.", "Thank you?"],
			["That is an excellent choice in shoe!", "Thanks."]
		];
		this.shoreStoreOptions = this.SHOE_STORE_OPTIONS;

		this.PHONE_STORE_OPTIONS = [
			["Do you like your new phone?", "Yes", "A little.", "No", "Yeah"],
			["Do youu want to go back to my hotel?", "I, what? No!"],
			["Can I get your number?", "Yeah. 555-123-1234."]
		];
		this.phoneStoreOptions = this.PHONE_STORE_OPTIONS;

		this.CAR_LOT_OPTIONS = [
			["That is a lovely color. Is it not?", "I like it.", "Thank you."],
			["Do you have a color in mind?", "Any color is fine.", "Red", "Green", "Blue"],
			["What kind of car do you want?", "I just want a fast one."]
		];
		this.carLotOptions = this.CAR_LOT_OPTIONS;

		this.HOUSE_OPTIONS = [
			["You have a lovely new house.", "Thank you."],
			["Would you like to have sex?", "Okay."]
		];
		this.houseOptions = this.HOUSE_OPTIONS;
	}

	getRandomResponseIndex(responses) {
		var index = Math.round(Math.random() * (responses.length - 2));
		index += 1;
		return responses[index];
	}

	init() {
		this.backgroundImage = document.getElementById("background_image");
		this.bottomContainer = document.getElementById("bottom_container");

		this.showMallActions();
		//this.showShoeStoreActions();
		//this.showPhoneStoreActions();
		//this.showCarLotActions();
		//this.showHouseActions();
	}
	
	checkSounds() {
		var responses = [];
		this.MALL_OPTIONS.forEach(function (item, index) {
			if (index > 0)
				responses.push(item);
		});
		this.SHOE_STORE_OPTIONS.forEach(function (item, index) {
			if (index > 0)
				responses.push(item);
		});
		this.PHONE_STORE_OPTIONS.forEach(function (item, index) {
			if (index > 0)
				responses.push(item);
		});
		this.CAR_LOT_OPTIONS.forEach(function (item, index) {
			if (index > 0)
				responses.push(item);
		});
		this.HOUSE_OPTIONS.forEach(function (item, index) {
			if (index > 0)
				responses.push(item);
		});
		
		var that = this;
		responses.forEach(function (item) {
			item.splice(0, 1);
			item.forEach(function (item2) {
				item2 = that.replaceVariables(item2);
				var audioName = that.getAudioName(item2);
				var path = "audio/" + audioName;
				var xhr = new XMLHttpRequest();
				xhr.addEventListener("readystatechange", function () {
					if (this.readyState === 4 && this.status === 404) {
						console.warn("Missing audio: " + audioName);
					}
				});
				xhr.open("GET", path);
				xhr.send();
			});
		});
	}

	reset() {
		this.mallOptions = this.MALL_OPTIONS;
		this.shoreStoreOptions = this.SHOE_STORE_OPTIONS;
		this.phoneStoreOptions = this.PHONE_STORE_OPTIONS;
		this.carLotOptions = this.CAR_LOT_OPTIONS;
		this.houseOptions = this.HOUSE_OPTIONS;
	}

	addScrollAndItems(itemsName) {
		var items = this[itemsName];
		var scroll = document.createElement("div");
		scroll.id = "bottom_container_scroll";
		for(var index = 0; index < items.length; index++) {
			var item = items[index];
			var itemDiv = document.createElement("div");
			itemDiv.className = "bottom_container_scroll_item";
			itemDiv.innerText = item[0];
			itemDiv.responses = item;
			var that = this;
			itemDiv.addEventListener("click", function (event) {
				that.handleItemClick(event, itemsName);
			});
			scroll.appendChild(itemDiv);
		}
		this.bottomContainer.appendChild(scroll);
	}

	handleItemClick(event, itemsName) {
		event.stopPropagation();
		var itemDiv = event.target;
		var responses = itemDiv.responses;

		for (var index = 0; index < this[itemsName].length; index++) {
			var response = this[itemsName][index][0];
			if (response === itemDiv.innerText) {
				this[itemsName].splice(index, 1);
				break;
			}
		}

		this.showResponse(responses, itemsName);
	}

	showResponse(responses, itemsName) {
		this.clearBottomContainer();
		this.addTitle("Response:");
		var chat = document.createElement("div");
		chat.id = "bottom_container_reponse";
		var that = this;
		chat.addEventListener("click", function (event) {
			that.handleResponseClick(event, itemsName);
		});

		var index = Math.round(Math.random() * (responses.length - 2));
		index += 1;
		chat.innerText = this.replaceVariables(responses[index]);
		
		this.playSound(chat.innerText, true);

		this.bottomContainer.appendChild(chat);
	}
	
	replaceVariables(response) {
		return response
					.replace("{MALL_AGE}", this.mallAge)
					.replace("{MALL_CUP_SIZE}", this.mallCupSize)
					.replace("{MALL_SHOE_SIZE}", this.mallShoeSize)
					.replace("{MALL_HEIGHT_FEET}", this.mallHeightFeet)
					.replace("{MALL_HEIGHT_INCHES}", this.mallHeightInches);
	}
	
	playSound(response, play) {
		var audioName = this.getAudioName(response);		
		var audio = document.getElementById("audio");
		audio.src = "audio/" + audioName;
		if (play)
			audio.play();
	}

	getAudioName(response) {
		var audioName = response
						.replaceAll(" ", "_")
						.replaceAll(".", "")
						.replaceAll("?", "")
						.replaceAll("'", "")
						.replaceAll(",", "")
						.replaceAll("!", "")
						.replaceAll("{", "")
						.replaceAll("}", "")
						.replaceAll("-", "_")
						.toLowerCase();
		audioName += ".mp3";
		return audioName;
	}

	handleResponseClick(event, itemsName) {
		event.stopPropagation();

		var next = this[itemsName].length === 0;

		switch (itemsName) {
			case "mallOptions":
				if (next)
					this.showShoeStoreActions();
				else
					this.showMallActions();
				break;
			case "shoreStoreOptions":
				if (next)
					this.showPhoneStoreActions();
				else
					this.showShoeStoreActions();
				break;
			case "phoneStoreOptions":
				if (next)
					this.showCarLotActions();
				else
					this.showPhoneStoreActions();
			case "carLotOptions":
				if (next)
					this.showHouseActions();
				else
					this.showCarLotActions();
				break;
			case "houseOptions":
				if (next)
					this.showEnd();
				else
					this.showHouseActions();
				break;
			default:
				console.warn("Unhandled action type: " + itemsName);
		}
	}

	showEnd() {
		this.clearBottomContainer();
		this.addTitle("Congratulations! You have successfully completed \"The Survey\"!");
		this.setImage("image/end.png");
	}

	showHouseActions() {
		this.clearBottomContainer();
		this.addTitle("Choose a house question:");
		this.addScrollAndItems("houseOptions");
		this.setImage("image/house.png");
	}

	showCarLotActions() {
		this.clearBottomContainer();
		this.addTitle("Choose a car lot question:");
		this.addScrollAndItems("carLotOptions");
		this.setImage("image/car_lot.png");
	}

	showPhoneStoreActions() {
		this.clearBottomContainer();
		this.addTitle("Choose a phone store question:");
		this.addScrollAndItems("phoneStoreOptions");
		this.setImage("image/phone_store.png");
	}

	showShoeStoreActions() {
		this.clearBottomContainer();
		this.addTitle("Choose a shoe store question:");
		this.addScrollAndItems("shoreStoreOptions");
		this.setImage("image/shoe_store.png");
	}
	
	showMallActions() {
		this.clearBottomContainer();
		this.addTitle("Choose a survey question:");
		this.addScrollAndItems("mallOptions");
		this.setImage("image/mall.png");
	}
	
	setImage(path) {
		var image = document.getElementById("background_image");
		image.src = path;
	}

	addTitle(title) {
		var div = document.createElement("div");
		div.id = "bottom_container_header";
		div.innerText = title;
		this.bottomContainer.appendChild(div);
	}

	clearBottomContainer() {
		while (this.bottomContainer.firstChild) {
			this.bottomContainer.removeChild(this.bottomContainer.firstChild);
		}
	}
	
	_keyPressed(event) {
		if (event.code === "KeyA")
			this.checkSounds();
	}
};

var theSurvey = new TheSurvey();
window.addEventListener("load", function() {
	theSurvey.init();
});
window.addEventListener("keypress", function(event) {
	theSurvey._keyPressed(event);
});