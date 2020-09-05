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
    $.ajax({
      type: "GET",
      url: "https://api.sandbox.checkout.com/payments/" + cko_session_id,
      headers: {'Authorization':  auth_key},
      'contentType': 'application/json',
      success: function(data){
          if(data.id){
            /*let txt1 = "<p>Payment ID: </p>";
            let txt2 = $("<p></p>").text(id);
            let txt3 = document.createElement("p");
            $("payment-detail").append(txt1, txt2, txt3);*/
            alert(data.id)
          }else{
            console.log("Failz")
          }
      },
      error: function(){
          alert('something bad happened' + data);
      }
    });
}