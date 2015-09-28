/* go to element with data goto */

$("[data-goto]").on("click",function(){
    if ($(this).attr("data-goto") === "top") {
        $('html,body').animate({ scrollTop: 0 }, 'slow');
    }else{
        goToElement("." + $(this).attr("data-goto"));
    }
    return false;
});
$("[data-hide]").on("click",function(){
    if ($(this).data("hide") === "this") {
        $(this).parent().hide();
    };
    return false;
});
$("[data-show]").on("click",function(){
    $("."+$(this).data("show")).removeClass("hidden");
    return false;
});
$("[data-show-hide]").on("click",function(){
    if ($("."+($(this).data("show-hide"))).hasClass("hidden")) {
        $("."+($(this).data("show-hide"))).removeClass("hidden");
    }else{
        $("."+($(this).data("show-hide"))).addClass("hidden");
    }
    return false;
});
$("[data-goto-page]").on("click",function(){
    window.location.href = $(this).attr("data-goto-page");
    return false;
});
// cacher href référencement
$("[data-go-to-page]").on("click",function(){
	var redirection = $(this).attr("data-go-to-page");
	window.location.href = redirection;
    return false;
});
function messageModalError(){
    showModal(
        "Erreur",
        "Vous avez une erreur",
        "Une erreur s'est produite. Veuillez réessayer ultérieurement.",
        "Annuler",
        "Valider"
    );
}


function showModal(tit1, tit2, cont, canc, vali){
    var clas = "mod_"/* + Math.random().toString(36).substring(7)*/;
    $("#modal").append(Mustache.render(modal, {
        classe : clas,
        title : tit1,
        title2 : tit2,
        content : cont,
        cancel : canc,
        valid : vali
    }));
    $("#modal").modal("show");
    return false;
}

function bindEvent(name,fct){
    $(name).on("click touchstart tap", fct);
}

function cookieOpen(){
    $.cookie("cookieAccepte", 1, {
        expires : 365,
        path    : '/',
        secure  : false
    });
    $("#cookiesban").slideUp(500, function(){
		$("#cookiesban").slideDown(500);
    });
	return false;
}
function cookieClose(){
    $.cookie("cookieAccepte", 1, {
        expires : 365,
        path    : '/',
        secure  : false
    });
    $("#cookiesban").slideUp(500, function(){
        $(this).remove();
    });
    return false;
}
function constructVisibleCarousel(){
	//carrousels visibles uniquement
	$currentCarousel = $('div[class*="carousel_"]:not(".carousel_simple"):visible');
	$currentCarousel.trigger('destroy.owl.carousel');
	$currentCarousel.html($currentCarousel.find('.owl-stage-outer').html()).removeClass('owl-loaded');
	$currentCarousel.each(function() {
    	var shouldNav = ($(this).children().length > 4);
        $(this).owlCarousel({
            navText: [ '‹', '›' ],
            dots: true,
            dotsEach: true,
            dotData: false,
            dotsSpeed: false,
            dotsContainer: false,
            loop:shouldNav,
            margin:10,
            nav:shouldNav,
            responsive:{
                0:{
                    items:4
                },
                600:{
                    items:4
                },
                1000:{
                    items:4
                }
            }
        });
    });
}
function getLayers(startWithClassSelector, callback){
    var layers = $("[class*="+ startWithClassSelector +"]").toArray();
	// pour chaque HTML element
	var layerNames = layers.map(function(item){
									// On split les classname  
									var classes = $(item).attr('class').split(' ');
									// pour chaque classname trouvé on ne garde que ceux qui commence par le startWithClassSelector
									var layerClasses = classes.filter(function(className){ 
											return className.indexOf(startWithClassSelector)===0;
										});
									return layerClasses[0]; 
	});
	//query url
	if (layerNames.length>0){
		var keysQueryString = "";
		keysQueryString = "&keys=" + layerNames.join( "&keys=");
		$.getJSON('/nocibe/AjaxFragments?' + paramsGlobal + keysQueryString, callback)
		 .done(function(fragments){
	        	$.each(fragments, function(propertyName,value){
	        		if (clearText(value.trim())!==""){
	        			$("."+propertyName).html(clearText(value));
	        		}
	        	});
	     })
	     .fail(function(jqXHR, textStatus, errorThrown) {
	        	console.log(textStatus);
	     });
	}
};
function clearText(someText){
    return someText.replace(/(\r\n|\n|\r)/gm,"");
}
function goToTop(){
    goToElement("body");
}
function goToElement(div){
    $("html, body").animate({scrollTop: $(div).offset().top }, 500);
    return false;
}
function getUrlParameter(sParam){
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++){
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === sParam){
            return sParameterName[1];
        }
    }
    return "";
}
function majURL(param, numpage){
    // maj content with refresh
    window.location.search = decodeURIComponent($.query.set(param, numpage));
    return false;
}
function deleteSpecialCaracteres(chaine){
    return chaine.replace(/[¨%*#}\[{)(~&¨^\\\]]/gi,"");
}
function noaccent(chaine) {
    return chaine.replace(/[àâä@]/gi,"a")
				 .replace(/[éèêë]/gi,"e")
				 .replace(/[îï]/gi,"i")
				 .replace(/[ôö]/gi,"o")
				 .replace(/[ùûü]/gi,"u")
				 .replace(/[ç]/gi,"c");
}
function noSpecialChar(chaine) {
    return chaine.replace(/[µ£$`¤°§.;,<>+\'\"\!\?€¨^+]/gi," ");
}
// get uniq in table
function unique(list) {
    var result = [];
    $.each(list, function(i, e42){
        if($.inArray(e42, result) === -1) result.push(e42);
    });
    return result;
}
function resetForm(formulaire) {
  $(formulaire+' input')
   .not(':button, :submit, :reset, :hidden')
   .val('')
   .removeAttr('checked')
   .removeAttr('selected');
}
// Equalise element like Fundation
function equalizeElements(){
    $("[data-equalizer]").each(function(index, groupToEqualize){
        // Calcul du max height et stockage de chaque hauteur occupée
	        var maxHeight = 0;
	        var $children = $(groupToEqualize).children("[data-equalizer-watch]");

	        var heights = $children.map(function(index, objectToEqualize){
            var $objectToEqualize = $(objectToEqualize);
            var currentHeight = $objectToEqualize.height();
            if (maxHeight<currentHeight){
                maxHeight = currentHeight;
            }
            return {jqueryObjectToEqualize: $objectToEqualize, height:currentHeight};
        });
        $.each(heights, function(index, itemToEqualize){
            var $objectToEqualize = itemToEqualize.jqueryObjectToEqualize;
            $objectToEqualize.height(maxHeight);
            var marginTop=0;
            if ($objectToEqualize.hasClass('bottomAlign')){
                marginTop = maxHeight-itemToEqualize.height;
            }
            else if ($objectToEqualize.hasClass('middleAlign')){
                marginTop = (maxHeight-itemToEqualize.height)/2;
            }
            // ajoute un complement de taille sur le premier fils
            $objectToEqualize.children().first().css({marginTop:marginTop +'px'});
        });
    });
}


// JQuery functions
$.fn.clickout = function(callback) {
    return this.each(function() {
        var self = $(this);
        self.click(function(e) {
            e.stopPropagation();
        });
        $(document).click(function(e) {
            if(typeof callback === "function") {
                $.proxy( callback, self ).call(e);
            }
        });
    });
}; 
$.fn.hasScrollBar = function() {
    return this.get(0).scrollHeight > this.height();
}