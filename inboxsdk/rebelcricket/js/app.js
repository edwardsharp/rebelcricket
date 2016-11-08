
var configTemplatePromise = null;

InboxSDK.load(1, 'sdk_edward_55b5a0f748').then(function(sdk) {

  var baseRouteID = 'rebelcricket/:item';

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
