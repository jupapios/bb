var DB = {
	save: function (key, object) {
		localStorage.setItem(key, JSON.stringify(object));
	},
	get: function (key) {
		var value = localStorage.getItem(key);
		return value && JSON.parse(value);
	}
}