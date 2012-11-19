Slider = function(slider) 
{   
    //settings
    var slideTime = 1000;
    var viewTime = 6000;
    
    //is animating or not
    var isAnimating = false;
    
    //item details
    var itemWidth = slider.find(".sliderItem").first().outerWidth(true);
    var numItems = slider.find(".sliderItem").size();
    
    //set first slide to selected
    slides().first().addClass('selected');
    controls().first().addClass('selected');
    
    //calculate slide width and content width
    calculateSizes();  
    $(window).on("resize", function() {
        calculateSizes();         
    });
    
    //show hidden elements
    slider.find(".sliderItem").css("display", "block");
    
    if(numItems > 1) {
        slider.find(".sliderControls, .next, .prev").css("display", "block");
    }
    
    //controls
    $(".next").click(function(event) {
        event.preventDefault()
        
        resetTimer();
        slideItem(1);
    });
    
    $(".prev").click(function(event) {
        event.preventDefault()
        
        resetTimer();
        slideItem(-1);
    });
    
    $(".quick").click(function(event) {
        event.preventDefault()
        
        if(!$(event.delegateTarget).hasClass("selected"))
        {
            resetTimer();
            
            var slideAmount = slider.find($(event.delegateTarget).parent()).index() - 1;
            var currentPosition = slider.find('.sliderItem.selected').index();
            
            if(slideAmount > currentPosition)
            {
                var amount = slideAmount - currentPosition;
                slideItem(amount);
            }
            
            if(slideAmount < currentPosition)
            {
                var amount = (currentPosition - slideAmount) * -1;
                slideItem(amount);
            }
        }
    });
    
    //calculate sizes
    function calculateSizes() {
        //calculate item width
        slider.find(".sliderItem").css("width", slider.find(".sliderDisplay").first().outerWidth(true));
        
        //update slider width
        itemWidth = slider.find(".sliderItem").first().outerWidth(true);
        
        //set slider content width
        slider.find(".sliderContent").width(numItems * itemWidth);
        
        //update content position on resize
        var currentSlide = slider.find('.sliderItem.selected').index();
        slider.find('.sliderContent').css("left", (currentSlide * itemWidth * -1)); 
    }
    
    //variable for all slides
    function slides() {
        return slider.find(".sliderItem");
    }
    
    //variable for all controls
    function controls() {
        return slider.find(".quick");
    }
    
    //auto scroll items
    var timer;
    resetTimer();
    
    function resetTimer()
    {
        clearInterval(timer);
        
        timer = setInterval(function()
        {
            slideItem(1);
        }, slideTime + viewTime);
    }
    
    //fade items when needed
    function slideItem(slideAmount)
    {
        if(!isAnimating)
        {
            //set can animate off while in an animation
            isAnimating = true;
            
            //get current and next slide index
            var currentSlide = slider.find('.sliderItem.selected').index();
            
            //check slide amount isnt too much, if so slide to start 
            if(currentSlide + slideAmount >= numItems)
            {
                slideAmount = (numItems-1)*-1;
            }
            
            //check slide amount isnt too little, if so slide to end
            if(currentSlide + slideAmount < 0)
            {
                slideAmount = numItems-1;
            }
            
            //remove selected classes
            slides().removeClass('selected');
            controls().removeClass('selected');
            
            //move to new slide
            slider.find(".sliderContent").animate({
                left: "+=" + (itemWidth * slideAmount * -1)
            }, slideTime, function() {
                isAnimating = false;
            });
            
            //add selected classes
            slides().eq(currentSlide + slideAmount).addClass('selected');
            controls().eq(currentSlide + slideAmount).addClass('selected');
        }
    }
};

$(function() 
{
    $(".slider").each(function()
    {
        new Slider($(this));
    });
});