
var configTemplatePromise = null;
var cachedCustomerPromises = {};
var rebelInfoPromise = null;
var seenSidebarEmails = new WeakMap();
var sidebarForThread = new WeakMap();
var sidebarTemplatePromise = null;

InboxSDK.load(1, 'sdk_edward_55b5a0f748').then(function(sdk) {

  var baseRouteID = 'rebelcricket/:item';
  rebelInfoPromise = getRebelInfo();

  if (!configTemplatePromise) {
    configTemplatePromise = get(chrome.runtime.getURL('configTemplate.html'), null, null);
  }

  Promise.all([
    configTemplatePromise
  ])
  .then(function(results) {
    var html = results[0];
    var template = _.template(html);

    sdk.Router.handleCustomRoute(baseRouteID, function(customRouteView){
      if(customRouteView.getParams().item == 'config'){
        customRouteView.getElement().textContent = template({
          config: {
            user: 'admin',
            password: 'rebelcricket'
          }
        });
      }else{
        customRouteView.getElement().textContent = 'hello world! ' + customRouteView.getParams().item + ' ' + sdk.User.getEmailAddress();
      }
    });

  });

  sdk.NavMenu.addNavItem({
    name: 'Rebel Cricket Config',
    routeID: baseRouteID,
    routeParams: {item: 'config'}
  });

  sdk.NavMenu.addNavItem({
    name: 'Rebel Cricket Orders',
    routeID: baseRouteID,
    routeParams: {item: 'quote'}
  });

  sdk.Lists.registerThreadRowViewHandler(function(threadRowView) {
    var contacts = threadRowView.getContacts();
    for (var i = 0; i < contacts.length; i++) {
      var contact = contacts[i];
      getRebelCustomer(contact, sdk.User.getEmailAddress()).then(function(customer) {
        if (customer != null) {
          addRebelIndicatorToThreadRow(threadRowView, contact.emailAddress);
        }
      });
    }
  });


  sdk.Conversations.registerMessageViewHandler(function(messageView) {
    var threadView = messageView.getThreadView();
    if (!seenSidebarEmails.has(threadView)) {
      seenSidebarEmails.set(threadView, []);
    }

    var contacts = messageView.getRecipients();
    contacts.push(messageView.getSender());

    for (var i = 0; i < contacts.length; i++) {
      var contact = contacts[i];
      if (seenSidebarEmails.get(threadView).indexOf(contact.emailAddress) != -1) {
        continue;
      }
      seenSidebarEmails.get(threadView).push(contact.emailAddress);


      getRebelCustomer(contact, sdk.User.getEmailAddress()).then(function(customer) {
        if (customer != null) {
          addRebelSidebar(threadView, customer);
        }
      });
    }
  });

});


var get = function(url, params, headers) {
  return Promise.resolve(
    $.ajax({
      url: url,
      type: "GET",
      data: params,
      headers: headers
    })
  );
}

var showButterMsg = function(html, key){
  sdk.ButterBar.showMessage({
    html: html,
    time: 15000,
    priority: 10,
    hideOnViewChanged: false,
    persistent: false,
    messageKey: key
  });
}

var showLoginModal = function(){
  sdk.Widgets.showModalView({
    el: 'modal stuff...',
    title: 'a model, yo!',
    buttons: [{
      text: 'button txt',
      title: 'title',
      onClick: onModalClick
    }] 
  });

  return false;
}

var onModalClick = function(e){
  console.log('--- onModalClick! ---');
  console.log('onModalClick  e:',e);
}

var getRebelCustomer = function(contact, currentUserEmail) {
  if (!cachedCustomerPromises[contact.emailAddress]) {
    if (contact.emailAddress.split("@")[1] === currentUserEmail.split("@")[1]) {
      cachedCustomerPromises[contact.emailAddress] = new Promise(function(resolve, reject) {
        resolve(null);
      });
    }
    else {
      cachedCustomerPromises[contact.emailAddress] = rebelGet('https://localhost/api/inboxcustomer', {q:contact.emailAddress})
      .then(function(result){
        for (var i = 0; i < result.length; i++) {
          console.log("!!! comparing result[i].name:",result[i].email," to contact.emailAddress:",contact.emailAddress);
          if(result[i].email == contact.emailAddress){
            return result[i];
          }
          
        }
        return null;
      });
    }
  }
  return cachedCustomerPromises[contact.emailAddress];
}

var addRebelIndicatorToThreadRow = function(threadRowView, email) {
  threadRowView.addImage({
    imageUrl: chrome.runtime.getURL('images/rebelcricket.png'),
    tooltip: email,
    imageClass: "rounded_rebelcricket"
  });
}

var get = function(url, params, headers) {
  return Promise.resolve(
    $.ajax({
      url: url,
      type: "GET",
      data: params,
      headers: headers
    })
  );
}

var rebelGet = function(url, params) {
  return rebelInfoPromise.then(function(info) {
    var headers = {
      // "Authorization": ("Bearer " + info.session_api_key),
      // "x-stripe-livemode": true
    };
    return get(url, params, headers);
  });
}

var getRebelInfo = function() {
  return get('https://localhost/api/inboxinfo', {}).then(function(response){
    return response;
  });
}

var addRebelSidebar = function(threadView, customer) {
  if (!sidebarForThread.has(threadView)) {
    sidebarForThread.set(threadView, document.createElement('div'));

    threadView.addSidebarContentPanel({
      el: sidebarForThread.get(threadView),
      title: "Rebel Customers",
      iconUrl: chrome.runtime.getURL('images/rebelcricket.png')
    });
  }

  if (!sidebarTemplatePromise) {
    sidebarTemplatePromise = get(chrome.runtime.getURL('sidebarTemplate.html'), null, null);
  }

  Promise.all([
    rebelGet("https://localhost/api/inboxcustomer", {q: customer.emailAddress, full_record: true}),
    sidebarTemplatePromise
  ])
  .then(function(results) {

    var customerInfo = results[0];
    var html = results[1];

    var template = _.template(html);
    sidebarForThread.get(threadView).innerHTML = sidebarForThread.get(threadView).innerHTML + template({
      customer: customer,
      customerInfo: customerInfo
    });
  });

}