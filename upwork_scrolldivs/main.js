var navbar_i = 0,
    $named   = $('.named:visible'),
		$navbar  = $('.navbar span'),
		$window  = $(window);
var lastOffset = $window.scrollTop(),
		lastDate = new Date().getTime(),
		navbar_height = $('.navbar').height();
$window.on('scroll', checkNav);
$window.on('resize', checkNav);
$('.navbar a[href^="#"]').on('click', scrollAnimate);
$window.on('scroll', scrollThresholdCheck);

// Makes the scrolled div's corresponding link in the navbar active.
function checkNav(event){
	for(var i = 0; i < $named.length; i++){
		if($($named[i]).offset().top - navbar_height - 1 < $window.scrollTop())continue;
		if(i == navbar_i)return;
		$navbar.removeClass('active');
		$($navbar[i-1]).addClass('active');
		break;
	}
}

//Scrolls the div when the corresponding link is clicked in the navbar.
function scrollAnimate(event){
  event.preventDefault();
	$window.off('scroll', scrollThresholdCheck);
  $('html, body').stop().animate({
    scrollTop: $($.attr(this, 'href')).offset().top - navbar_height
  }, 500, 'swing', ()=>{
		window.setTimeout(()=>{
			$window.on('scroll', scrollThresholdCheck);
			lastDate = event.timeStamp;
			lastOffset = $window.scrollTop();
		}, 100)
	});
}

//Smooth Scrolling Function
function scrollThresholdCheck(event){
	var delay = event.timeStamp - lastDate;
  var offset = $window.scrollTop() - lastOffset;
  var speed = offset / delay;
	if( Math.abs(speed) > 0.07 ){
		for(var i = 0; i < $named.length - 1; i++){//Exclude Footer
			if($($named[i]).offset().top - navbar_height - 1 < $window.scrollTop())continue;
			if(i == 0)i = 1;i--;
			let element = (speed > 0 ? $named[ i + 1 ] : $named[ i ]);
			console.log(speed, i, $named.length, element);
			$window.off('scroll', scrollThresholdCheck);
		  $('html, body').stop().animate({
		    scrollTop: $( element ).offset().top - navbar_height
		  }, 500, 'swing', ()=>{
				window.setTimeout(()=>{
					$window.on('scroll', scrollThresholdCheck);
				  lastDate = event.timeStamp;
				  lastOffset = $window.scrollTop();
				}, 100)
			});
			break;
		}
	}
  lastDate = event.timeStamp;
  lastOffset = $window.scrollTop();
}
