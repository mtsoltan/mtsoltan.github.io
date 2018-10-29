$('.sandwitch').on('click', function(){
	if(this.classList.contains('toggled')){
		this.classList.remove('toggled');
	} else {
		this.classList.add('toggled');
	}
});
$('li.dropdown').hover(function() {
  if($(window).width() > 767)$(this).addClass('open');
}, function() {
  if($(window).width() > 767)$(this).removeClass('open');
});
$('.rating-star-a').hover(function(){
	for(i = 0;i < this.children[0].alt;i++){
  	$('.rating-stars').children()[i].classList.add('on');
	}
}, function() {
  $('.rating-star-a').removeClass('on');
});
