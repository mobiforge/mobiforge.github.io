document.addEventListener('DOMContentLoaded',function(e){

  document.getElementById('btn-pay').addEventListener('click', makePayment);
});

function makePayment() {
  //Check for support
  if (!window.PaymentRequest) {
    document.getElementById('status').innerHTML = "Sorry, Payment Request API not supported on this browser";
    return;
  }

  //Now for the fun stuff
  var methodData = [{supportedMethods: ["visa", "mastercard"]}];

  //Set some details
  var details = {
    total: {label: 'Wawesome sauce', amount: {currency: 'EUR', value: '1.23'}},
    displayItems: [
      {
        label: '1 x Wawesome sauce',
        amount: {currency: 'EUR', value: '1.00'}
      },
      {
        label: 'VAT 23%',
        amount: {currency: 'EUR', value: '0.23'}
      }
    ],
    //  Remove shippingOptions from details if you want shippingaddresschange event to fire
    // 
    //shippingOptions: [
    //   {
    //     id: 'standard',
    //     label: 'Standard shipping',
    //     amount: {currency: 'EUR', value: '5.00'},
    //     selected: true
    //   },
    //   {
    //     id: 'express',
    //     label: 'Express shipping',
    //     amount: {currency: 'EUR', value: '15.00'}
    //   }
    // ]
  };

  //Set some options
  var options = {
    requestShipping: true,
    requestPayerEmail: true,
    requestPayerPhone: true    
  }

  //Finally we can build the request
  var paymentRequest = new PaymentRequest(methodData, details, options);

  //Handle shipping address choice
  paymentRequest.addEventListener("shippingaddresschange", function (changeEvent) {
    changeEvent.updateWith(new Promise(function(resolve, reject) {
      handleAddressChange(details, paymentRequest.shippingAddress, resolve, reject);
    }));
  });

  //Handle shipping options choice
  paymentRequest.addEventListener("shippingoptionchange", function (changeEvent) {
    changeEvent.updateWith(new Promise(function(resolve, reject) {
      handleOptionChange(details, paymentRequest.shippingOption, resolve, reject);
    }));      
  });

  //Now show it!
  //request.show();

  paymentRequest.show().then(function(paymentResponse) {
    // Get payment info
    var paymentInfo = {
      methodName: paymentResponse.methodName,
      details:    paymentResponse.details
    }

    //Send to payment gatway or processer
    //Simulate this for now, our page will always return a 200 response
    var params = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentInfo)
    };


    return fetch('process-payment.html', params).then(function(response) {
      if(response.status == 200) {
        return paymentResponse.complete('success');
      }
      else {
        return paymentResponse.complete('fail');
      }
    }).then(function() {
        document.getElementById('status').innerHTML = 'Order complete!';
    }).catch(function(err) {
      return paymentResponse.complete('fail');
    });

  }).catch(function(err) {
    document.getElementById('status').innerHTML = 'Could not complete purchase at this time';
  });


}

function handleAddressChange(details, shippingAddress, resolve, reject) {
    if (shippingAddress.country === 'IE') {
      var shippingStandard = {
        id: 'IE Standard',
        label: 'Standard shipping Ireland',
        amount: {currency: 'EUR', value: '5.00'},
        selected: true
      };            
      var shippingExpress = {
        id: 'IE Express',
        label: 'Express shipping Ireland',
        amount: {currency: 'EUR', value: '25.00'},
        selected: false
      };
    }
    else if(shippingAddress.country === 'US') {
      var unsupportedAddress = true;
    }
    else {
      var shippingStandard = {
        id: 'International Standard',
        label: 'Standard shipping International',
        amount: {currency: 'EUR', value: '15.00'},
        selected: true
      };            
      var shippingExpress = {
        id: 'International Express',
        label: 'Express shipping International',
        amount: {currency: 'EUR', value: '45.00'},
        selected: false
      };
    }

    //Now set available shipping options for the chosen address
    if(unsupportedAddress) {
      // Set to empty for unsupported address
      details.shippingOptions =[];
    }
    else {
      details.shippingOptions = [shippingStandard, shippingExpress];

      //Update the order summary, display standard shipping by default
      details.displayItems.splice(1, 1, shippingStandard);
      details = updateDetails(details);
    } 
  resolve(details);
}

function handleOptionChange(details, shippingOption, resolve, reject) {
  //remove tax & shipping from our display items
  while(details.displayItems.length>1) details.displayItems.pop();

  //Match the shipping option
  for(var i=0;i<details.shippingOptions.length;i++) {
    if(shippingOption == details.shippingOptions[i].id) {  
      details.shippingOptions[i].selected = true;
      details.displayItems.push(details.shippingOptions[i]);
    }
    else {
      details.shippingOptions[i].selected = false;
    }
  }

  details = updateDetails(details);
  resolve(details);
}

function updateDetails(details) {
  //Remove last display item (tax)
  if(details.displayItems.length>2) details.displayItems.pop();
  
  //Update the order summary, recalculate totals
  var tax = calculateTax(details.displayItems, 23);

  //Display the new tax value
  details.displayItems.push({label: "VAT 23%", amount: {currency:"EUR", value: tax}});

  //Display the new total
  details.total.amount.value = calculateTotal(details.displayItems);
  return details;
}


function calculateTax(items, rate) {
  var total = 0;
  for(var i=0;i<items.length;i++) {
    if(items[i].amount.label!='VAT 23%') {
      total+=Number(items[i].amount.value);
    }
  }
  var tax = total*rate/100;
  return tax.toFixed(2);
}

function calculateTotal(items) {
  var total = 0;
  for(var i=0;i<items.length;i++) {
    total+=Number(items[i].amount.value);
  }
  return total.toFixed(2);
}
