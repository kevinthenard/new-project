// déclaration variables globales
var website = null;

// modales
var modal = $("#modal").html();
//et on la vide
$('#modal').empty();

// Hack IE Mobile
if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
  var msViewportStyle = document.createElement('style');
  msViewportStyle.appendChild(
    document.createTextNode(
      '@-ms-viewport{width:auto!important}'
    )
  );
  document.querySelector('head').appendChild(msViewportStyle);
}

$( document ).ready(function() {
    // onload
    constructVisibleCarousel();
    equalizeElements();
    
    if($('[class*="layer-"]').length > 0){
        getLayers("layer-");
    }
    
	$(window).scroll(function(){
        var s = $(document).scrollTop();
        if (s > 10){
            $("#to_top").show();
        }else{
            $("#to_top").hide();
        }
    });

    /* --- Cookies accept open --- */
    if (!$.cookie("cookieAccepte")) {
        cookieOpen();
        return false;
    }
    $("#cookiesclose").on("click", function() {
        cookieClose();
        return false;
    });
	
    $(".no-cut-copy-paste").bind("cut copy paste",function(e) {
        e.preventDefault();
    });
	
    /*$( ".tabs_3carousels" ).tabs({
        active: 0
    });*/

    // Construct Carousel
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        constructVisibleCarousel();
    });
    
    // Collapse
    $('.collapse').collapse({
        toggle: false,
        parent: true
    });
    

    // carousel Simple
    $('.carousel_simple').each(function() {
    	var shouldLoop = ($(this).children().length >  1);
    	$(this).owlCarousel({
            navRewind: true,
            dots: true,
            dotsEach: true,

            /* autoplay */
            autoplay:true,
            autoplayTimeout:8000,
            autoplayHoverPause:true,
            loop:shouldLoop,
            margin:0,
            nav:false,
            responsive:{
                0:{
                    items:1
                },
                600:{
                    items:1
                },
                1000:{
                    items:1
                }
            }
        });
    });
     
    // recherche
    var Input =  $('#Rechercher');
    var currentXhr = null;
    Input.keyup( function() {
        var query = Input.val();
        if (query.length< 3) {
        	$('#autocomplete').hide();
        	return false;
        }
        if(currentXhr) {
            // annule la requete precedente s'il y en a une de lancée
            currentXhr.abort();
            currentXhr = null;
        }
        currentXhr = $.ajax({
            type: 'GET', /*GET*/
            url : '/SearchAutoComplete?',
            data: 'name=' + query,
            jsonp: "callback",
            dataType: "html",
            success: function( data ) {
                currentXhr = null;
                var autoCompletion=$.parseJSON(data);
                // make what you want with callback, but with Mustache
            },
            error: function(jqXHR, textStatus, errorThrown) {
                currentXhr = null;
            }
        });
    });

    /* --- Print --- */
    $('.print-this').on("click",function(){
        window.print();
    });
    /* --- Liens externes --- */
    $("a.link-out").click(function(){
        window.open($(this).attr("href"));
        return false;
    });

    /* delete filtre */
    $(".delete-all").click(function(){
		$(".sidebar_list label.active").each(function(){        
			$(this).removeClass("active");			
         });
		Rayon.queryFacet("");
        return false;
    });

    /* Change image for Retina version */
    if (is.retina()) {
        $("[data-retina]").each(function(){
            var w = $(this).innerWidth();
            var h = $(this).innerHeight();
            var r = $(this).attr("data-retina");        
            $(this).attr("src", r).attr("width", w).attr("height",h);
        });
    }

    /* -------- modales -------- */
    $("[data-box-ajax]").on("click", function(){
        $.ajax({
            type: "GET",
            cache: false,
            url: "/nocibe/AjaxContentDisplay?"+paramsGlobal+"&pub=1&action=modal&rub=" + $(this).attr("data-box-ajax") + "&_=1434037242510",
            success: function(data) {
                //eval(data);
                $('#modal-ajax-content').html(data);
                $('#box-ajax').modal('show');
            },
            error: function(data){
                messageModalError('#box-ajax');
                $('#box-ajax').modal('show');
                console.log(data);
            }
        });
        return false;
    });
    $("[data-box-ajax-url]").on("click", function(){
        $.ajax({
            type: "GET",
            cache: false,
            url:  $(this).attr("data-box-ajax-url"),
            success: function(data) {
                //eval(data);
                $('#modal-ajax-content').html(data);
                $('#box-ajax').modal('show');
            },
            error: function(data){
                messageModalError('#box-ajax');
                $('#box-ajax').modal('show');
                console.log(data);
            }
        });
        return false;
    });

    // action à l'ouverture de la modale
    $('#modal').on('shown.bs.modal', function (e) {
        //$(this).empty();
    });

    // action à la fermeture de la modale
    $('.modal').on('hidden.bs.modal', function (e) {
        $(this).empty();
    });

    // compteur sous textarea
    $('textarea').keyup(function() {
        var nbmax = $(this).attr('maxLength');
        var nombreCaractere2 = $(this).val().length;
        nombreCaractere2 = nbmax - nombreCaractere2;
        var msg2 = nombreCaractere2 + ' Caractère(s) restant';
        $('.count').text(msg2);

        if (nombreCaractere2 < 1) {
            $('.count').addClass("error");
        }else{
            $('.count').removeClass("error");
        }
    }); 

    /* type text -> value */
    $('.quantite').each(function(){
        var h = $(this).outerHeight();
        var w = $(this).outerWidth();
        var lb = 45; // largeur bouton
        var lh = parseFloat($(this).css('line-height'));
        var paddingTopAndBottom = (h - lh) / 2;

        var btnm = '<a class="sub-1 left" style="height:'+ h +'px;width:'+w+'px;text-align:center;border:1px solid #E6DEDA;background-color:#E6DEDA;color:black;padding:'+paddingTopAndBottom+'px 15px '+paddingTopAndBottom+'px" href="#">-</a>';
        var btnp = '<a class="add-1 abs" style="height:'+ h +'px;width:'+w+'px;text-align:center;border:1px solid #E6DEDA;left:'+(lb+w)+'px;background-color:#E6DEDA;color:black;padding:'+paddingTopAndBottom+'px 15px '+paddingTopAndBottom+'px" href="#">+</a>';
        $(btnm + btnp).insertBefore(this);
    });
    $("body").on("click", ".add-1, .sub-1",  function(){
        var v = $(this).siblings(".quantite").val();
        var max = $(this).siblings(".quantite").attr("data-max-value");
        var min = $(this).siblings(".quantite").attr("data-min-value");

        if($(this).hasClass("add-1")){
            if(v < max){
                $(this).siblings(".quantite").val(v*1 + 1);
            }
        }else if($(this).hasClass("sub-1")){
            if(v > min){
                $(this).siblings(".quantite").val(v*1 - 1);
            }
        }
        
        $(".table .row input.quantite").change();
        
        return false;
    });

    // accordéon avec puce
    $(function() {
        $( "#accordion-puce" ).accordion({
            heightStyle: "content",
            event:"click puce"
        });
    });
    $.event.special.puce = {
        setup: function() {
            $(this).click(function(){
                $(this).children("input[type=radio]").prop("checked", true);
            });
        }
    };

    // Tooltips
    $('[data-toggle="tooltip"]').tooltip();

    // when user quit the page
	$('body').mouseleave(function(){
		// user quit the page
	});
}); /* End fn ready */
