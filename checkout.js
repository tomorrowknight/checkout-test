let payButton = document.getElementById("pay-button");
let form = document.getElementById("payment-form");

Frames.init("pk_test_4296fd52-efba-4a38-b6ce-cf0d93639d8a");

Frames.addEventHandler(
Frames.Events.CARD_VALIDATION_CHANGED,
function (event) {
    console.log("CARD_VALIDATION_CHANGED: %o", event);
    payButton.disabled = !Frames.isCardValid();
}
);

Frames.addEventHandler(
Frames.Events.CARD_TOKENIZED,
function (event) {
    console.log(event.token)
    sendRequest(event.token)
}
);

form.addEventListener("submit", function (event) {
event.preventDefault();
Frames.submitCard();
});

function sendRequest(token){
console.log("SR token: " + token)
$.ajax({
  type: "POST",
  url: "https://integrations-cko.herokuapp.com/pay3d",
  data: JSON.stringify({'token':token , 'success_url' :"https://checkout-test-alvinarul.netlify.app/success.html", 'failure_url' :"https://checkout-test-alvinarul.netlify.app/failure.html"}),
  'processData': false,
  'contentType': 'application/json',
  success: function(data){
      if(data.redirection_url){
        window.location.replace(data.redirection_url);
      }else{
        console.log("Failz")
      }
  },
  error: function(){
      alert('something bad happened' + data);
  }
});
}

function getPaymentDetails(){
    const urlParams = new URLSearchParams(window.location.search);
    let cko_session_id_param = urlParams.get('cko-session-id');
    const cko_session_id = cko_session_id_param
    const auth_key = "sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808" 
    const payment_detail_div = document.getElementById("payment-detail");
    payment_detail_div.remove();
    $.ajax({
      type: "GET",
      url: "https://api.sandbox.checkout.com/payments/" + cko_session_id,
      headers: {'Authorization':  auth_key},
      'contentType': 'application/json',
      success: function(data){
          if(data.id){
            let payment_id = data.id
            let card_type = data.source.card_type
            let card_issuer = data.source.issuer
            let amount = data.currency + "" + data.amount
            $( "<div id=payment-detail></div>").appendTo( ".card-new" );
            
            $( "<h3> Payment Details </h3>" ).appendTo( "#payment-detail" );
            $( "<p id='payment_p'>Payment ID: </p>" ).appendTo( "#payment-detail" );
            $( "<strong>" + payment_id + "</strong>").appendTo("#payment_p" )
            $( "<p id='card_type_p'>Card Type: </p>" ).appendTo( "#payment-detail" );
            $( "<p>" + card_type + "</p>" ).appendTo( "#card_type_p" );
            $( "<p id='card_issuer_p'>Card Issuer: </p>" ).appendTo( "#payment-detail" );
            $( "<p>" + card_issuer + "</p>" ).appendTo( "#card_issuer_p" );
            $( "<p id='amount_p'>Payment Amount: </p>" ).appendTo( "#payment-detail" );
            $( "<p>" + amount + "</p>" ).appendTo( "amount_p" );
          }else{
            console.log("Failz")
          }
      },
      error: function(){
          alert('something bad happened' + data);
      }
    });
}