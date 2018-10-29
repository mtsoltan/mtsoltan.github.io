var $named   = $('.named:visible'),
		$window  = $(window);
var lastOffset = $window.scrollTop(),
		lastDate = new Date().getTime(),
		navbar_height = 51;
$window.on('scroll', scrollThresholdCheck);
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
