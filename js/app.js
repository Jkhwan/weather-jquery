$(function() {
	$('form#searchCity').submit(function() {

		$('h1').addClass('top');
		// grab city from input box
		var cityInputBox = $('input#cityInput');
		var city = cityInputBox.val();
		// remove all list items
		$('h1').text("Weather Forecast");
		$('ul#citiesList li').remove();
		$('.row.weather div.dailyForecast').remove();
		$('div.row.weather').hide();
		$('ul#citiesList').show();

		var url = "http://autocomplete.wunderground.com/aq?query=" + city + "&cb=?";
		var cityLookupSuccess = function(data) {
			$.each(data.RESULTS, function(index, value) {
				var li = $('<li class="list-group-item" data-zmw="' + value.zmw + '" data-city="' + value.name + '">' + value.name + '</li>').hide();
				$('ul#citiesList').append(li);
			});

			// creates fadeIn effects
			var fadeItem = function() {
				$('ul#citiesList li:hidden:first').fadeIn(50);
				$('ul#citiesList li:hidden:first').fadeIn(50, fadeItem);
			}
			fadeItem();
		}
		$.getJSON(url, cityLookupSuccess);

		// clear input box
		cityInputBox.val("");
		return false;
	});

	$('ul#citiesList').on('click', 'li', function() {
		var zmw = $(this).data("zmw");
		var city = $(this).data('city');
		var key = '3c8121ac154d80de';
		var cityWeatherURL = "http://api.wunderground.com/api/" + key + "/forecast/q/zmw:" + zmw +".json";
		var cityWeatherSuccess = function(data) {
			$('ul#citiesList li').remove();
			$('ul#citiesList').hide();
			var weatherDiv = $('div.row.weather');
			var condition = data.forecast.simpleforecast.forecastday[0].conditions;
			if (condition.search("Rain") != -1) {
				$('body').toggleClass('raining', true).toggleClass('sunny', false).toggleClass('cloudy', false).toggleClass('snow', false);
			} else if (condition.search("Cloudy") != -1) {
				$('body').toggleClass('cloudy', true).toggleClass('sunny', false).toggleClass('raining', false).toggleClass('snow', false);
			} else if (condition.search("Clear") != -1) {
				$('body').toggleClass('sunny', true).toggleClass('cloudy', false).toggleClass('raining', false).toggleClass('snow', false);
			} else if (condition.search("Snow") != -1) {
				$('body').toggleClass('snow', true).toggleClass('sunny', false).toggleClass('cloudy', false).toggleClass('raining', false);
			}
			for(var i = 0; i < 4; i++) {
				var dailyDiv = $('<div class="dailyForecast col-xs-3"></div>');
				var weatherData = data.forecast.simpleforecast.forecastday[i];
				dailyDiv.append($('<div>' + weatherData.date.weekday + ', ' + weatherData.date.monthname_short 
					+ ' ' + weatherData.date.day + ' ' + '</div>'));
				dailyDiv.append($('<img src="' + weatherData.icon_url + '"><span class="temperature">' + weatherData.high.celsius + '&deg;C</span>'))
				dailyDiv.append($('<div>' + weatherData.conditions + '</div><br />'));
				dailyDiv.append($('<div class="simple">P.O.P: ' + weatherData.pop + '%</div>'));
				dailyDiv.append($('<div class="simple">Rain: ' + weatherData.qpf_allday.mm + ' mm</div>'));
				dailyDiv.append($('<div class="simple">Humidity: ' + weatherData.avehumidity + '%</div>'));
				weatherDiv.append(dailyDiv);
			}
			$('h1').text(city);	
			weatherDiv.show();
		};
		$.ajax({
			url: cityWeatherURL, 
			dataType: 'jsonp',
			success: cityWeatherSuccess
		});

	});
});