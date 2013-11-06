$(function() {
	$('form#searchCity').submit(function() {
		var cityInputBox = $('input#cityInput');
		var city = cityInputBox.val();
		cityInputBox.val("");
		console.log(city);
	});
});