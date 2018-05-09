"use strict";

var StarryDiaryItem = function(text) {
	if (text) {
		var obj = JSON.parse(text);
		this.key = obj.key;
		this.value = obj.value;
		this.author = obj.author;
	} else {
	    this.key = "";
	    this.author = "";
	    this.value = "";
	}
};

StarryDiaryItem.prototype = {
	toString: function () {
		return JSON.stringify(this);
	}
};

var StarryDiary = function () {
    LocalContractStorage.defineMapProperty(this, "repo", {
        parse: function (text) {
            return new StarryDiaryItem(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
};

StarryDiary.prototype = {
    init: function () {
        // todo
    },

    save: function (key, value) {

        key = key.trim();
        value = value.trim();
        if (key === "" || value === ""){
            throw new Error("empty key / value");
        }
        if (value.length > 256 || key.length > 64){
            throw new Error("key / value exceed limit length")
        }

        var from = Blockchain.transaction.from;
        var starryDiaryItem = this.repo.get(key);
        if (starryDiaryItem){
            throw new Error("value has been occupied");
        }

        starryDiaryItem = new StarryDiaryItem();
        starryDiaryItem.author = from;
        starryDiaryItem.key = key;
        starryDiaryItem.value = value;

        this.repo.put(key, starryDiaryItem);
    },

    get: function (key) {
        key = key.trim();
        if ( key === "" ) {
            throw new Error("empty key")
        }
        return this.repo.get(key);
    }
};
module.exports = StarryDiary;