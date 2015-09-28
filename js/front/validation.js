$( document ).ready(function() {

	/* Validation add methods */
    // date valide
    $.validator.addMethod( 
        "dateValide", 
        function(value, element) {
            var moiscarte = $("#mois_carte").val();
            if(annee === ("#annee_carte").val()){
                if(parseInt(moiscarte) < mois){
                    return false;
                }
            }
            return true; 
        },
        "Date NOK" 
    ); 

    // numéro CB valide
    $.validator.addMethod( 
            "numCarte", 
            function(value, element) {
                var re;
                if($("#type_carte").val()=='AMEX'){
                    re = new RegExp("^[0-9]{15}$");
                    return re.test(value);
                }
                else{
                    re = new RegExp("^[0-9]{16}$");
                    return re.test(value);
                }
                return false; 
            }, 
            "Date NOK" 
        ); 

    // Crypto CB valide
    $.validator.addMethod( 
            "cryptoCarte", 
            function(value, element) {
                var re;
                if($("#type_carte").val()=='AMEX'){
                    re = new RegExp("^[0-9]{4}$");
                    return re.test(value);
                }
                else{
                    re = new RegExp("^[0-9]{3}$");
                    return re.test(value);
                }
                return false; 
            }, 
            "Date NOK" 
        ); 

    // exclusion valeur
	$.validator.addMethod("excludeValue", function(value, element, params) {
        var ret = true;
        $.each(params, function(paramIndex, paramValue) {      
            var i = (value+'').indexOf(paramValue, 0);         
            if (i >= 0){
                ret = false;                           
            } 
        });
        return ret;                                    
    }, "");

    // Regex
    $.validator.addMethod(
        "regex",
        function(value, element, regexp) {
            if (regexp.constructor !== RegExp){
                regexp = new RegExp(regexp);
            }else if (regexp.global){
                regexp.lastIndex = 0;
            }
            return this.optional(element) || regexp.test(value);
        },"erreur expression reguliere"
    );

	/* validation form example */
	$("#form").validate({
		rules: {
			montantOrder:  { required: true, regex: "^[0-9]+,[0-9]{2}$" },
			addOrder:      { required: true }
		},
		messages: {
			montantOrder:  { 
                required: "Veuillez saisir le Montant votre commande.", 
                regex: "Le montant de votre commande n'est pas au bon format (x,x)."
                            },
			addOrder:      { 
                required: "Veuillez spécifier si vous avez enregistré une livraison à une autre adresse." ,
                maxlength:  $.i18n._('MsgError_MaxLenght')
                            }
		}, // or stop here for message after field
		errorPlacement: function(error, element) {
			if (element.attr("name") == "addOrder"){
				error.appendTo( $("#errorMsg_addOrder") );
				$("#error_addOrder").removeClass("valid").addClass("notvalid");
			}else{
				error.appendTo( element.next().next() );
				element.next().removeClass("valid").addClass("notvalid");
			}
		},
		success: function(label) {
			label.remove();
		},
		highlight: function(element, errorClass) {
		 	if(element.name == "addOrder"){
		 		$("#error_addOrder").removeClass("valid").addClass("notvalid");
			}else{
				$('#'+element.name).next().removeClass("valid").addClass("notvalid");
			}
		},
		unhighlight: function(element, errorClass) {
			if (element.name == "addOrder"){
				$("#error_addOrder").removeClass("notvalid").addClass("valid");
			}else{
				$('#'+element.name).next().removeClass("notvalid").addClass("valid");
			}
		}
	});
    $("#form").submit( function(){
        if($("#form").valid()) {
            $(this).find("button").attr("disabled", "disabled");
            $.ajax({
                type: "POST",
                data: { 
                    montantOrder : $("#montantOrder").val(),
                    addOrder     : $("#addOrder").val()
                },
                cache: false,
                redirect: true,
                url: $(this).prop('action'),
                success: function(mess){
                    goToTop();
                    return false;
                },
                error: function(data){
                    console.log("erreur lors de l'envoi de la demande");
                    return false;
                }
            });
	    }
    });
}); // end fn ready
