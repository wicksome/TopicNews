//////////////////////////////////////////////////////////////////////////////

function entry(item) {
	this.title = item.title;
	this.link = item.link;
	this.content = item.content;
	this.pubDate = item.publishedDate;
	this.getTitle = function () {
		return this.title
	};
}

function movePage(category) {
	var url = "";
	if(category == -1) {
		url = "about.html";
	} else {
		url = "page.html?category=" + category;
	}
	document.getElementById("main_frame").src = url;
	document.getElementById("layout").className = "";
}

function getRandomArray(idxSize, range) {
	/* 랜덤 수를 가진 배열을 반환하는 메서드.
	 * idxSize : 반환받을 배열 사이즈,
	 * range : 랜덤 수의 범위
	 */
	var indexs = new Array(); // 랜덤 인덱스 배열
	var hasValue = false; //같은 값이 있는지 확인하기 위한 변수

	if(idxSize > range) {
		console.error('index size > range');
		return indexs;
	}

	while(indexs.length < idxSize) {
		hasValue = false;
		var temp = parseInt(Math.random() * range);
		for(c = 0; c < indexs.length; c++) {
			if(temp == indexs[c]) {
				hasValue = true;
				break;
			}
		}
		if(hasValue == false) {
			indexs.push(temp);
		}
	}
	return indexs;
}

//-----------------------------------------------------------------------------------------------------------

(function ($) {
	$.fn.addRssDatas = function (url) {
		var rssList = new Array();
		var cnt = 0;
		var itemNumber = 20;

		var id = $(this).attr("id"), s="";
		//$("#" + id).empty().append('<img src="images/loader.gif" id="loader" />');
		// 로딩
		$("#" + id).empty().append('<div class="loader" id="circularG"><div id="circularG_1" class="circularG"></div><div id="circularG_2" class="circularG"></div><div id="circularG_3" class="circularG"></div><div id="circularG_4" class="circularG"></div><div id="circularG_5" class="circularG"></div><div id="circularG_6" class="circularG"></div><div id="circularG_7" class="circularG"></div><div id="circularG_8" class="circularG"></div></div>');

		for (i = 0; i < url.length; i++) {
			//console.log(url[i]);
			var test1 = collectRssData({
				FeedUrl: url[i],
				MaxCount: itemNumber,
				//ShowDesc: true,
				//ShowPubData: true,
				//DescCharacterLimit: 100,
				//TitleLinkTarget: '_blank',
				DateFormat: 'MM/DD/YYYY',
				//DateFormatLang: 'en'
			}, function (data) {
				for (j = 0; j < data.length; j++) {
					rssList.push(data[j]);
				}
				cnt++;
				if (cnt == url.length) {
					$("#" + id).empty();
					//////////////////////////////////////
					//	아이템 추가
					//////////////////////////////////////
					var indexs = new Array();
					indexs = getRandomArray(itemNumber, rssList.length);
					indexs.forEach(function(value) {
						console.log("index : " + value);
						var item = rssList[value];

						s += '<div class="pure-u-1 pure-u-md-1-2 pure-u-lg-1-4">';
						s += '<div item>'
						s += '<div class="content">';
						// s += '<div class="content 1-box">';
						s += '<span class="title">';
						s += item.title;
						s += '</span>';
						s += '<p></p>'
						s += '</div>';
						//s += '<p>';
						//s += item.content;
						//s += '</p>';
						//s += '<a href="'+ item.link + '" class="itemLink" target="_blank" ">';
						s += '<div class="action">'
						s += '<a href="'+ item.link + '" target="_blank">';
						s += '해당 기사로 이동';
						s += '</a>';
						s += '</div>';
						s += '</div>';
						s += '</div>';
						//s += '<p>' + item.pubDate + '</p>';

						/*
						s += '<li class="item" ';
						s += 'onClick="window.open('; // 새창에서 열기
						s += "'"+item.link+"'";
						s += ')"><p>' + item.title + '</p></li>';
						*/
					});
					//$("#" + id).append('<ul">' + s + "</ul>");
					// 전체 틀
					$("#" + id).append(s);
				}
			});
			// 사이즈 0 출력된
			//console.log("rssList : " + rssList.length);
		}
		//console.log('total : ' + rssList.length);
	};
})(jQuery);


var collectRssData = function (opt,
	callback) {
	var arr = new Array();

	var def = $.extend({
		FeedUrl: "http://rss.cnn.com/rss/edition.rss",
		MaxCount: 20,
		ShowDesc: true,
		ShowPubDate: true,
		CharacterLimit: 0,
		TitleLinkTarget: "_blank",
		DateFormat: "MM/DD/YYYY",
		DateFormatLang: "en"
	}, opt);

	$.ajax({
		url: "http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=" + def
			.MaxCount + "&output=json&q=" + encodeURIComponent(
				def.FeedUrl) + "&hl=en&callback=?",
		dataType: "json",
		async: false,
		success: function (data) {
			$.each(data.responseData.feed.entries,
				function (e, item) {
					var tmp = new entry(item);
					arr.push(tmp);
					//console.log("length : " + arr.length);
				});
			console.log("arr size: " + arr.length);
			return callback(arr);
		}
	});

	return arr
}