Rails.application.routes.draw do
  # see http://guides.rubyonrails.org/routing.html

  post '/api/rebelquote', to: 'rebel_api#rebelquote', as: :rebel_quote
  post '/api/rebelgfx', to: 'rebel_api#rebelgfx', as: :rebel_gfx
  get '/api/rebelpages', to: 'rebel_api#rebelpages', as: :rebel_pages
  get '/api/rebelvendor/companycasuals.json', to: 'rebel_api#rebelvendor', as: :rebel_vendor
  get '/api/vendorgoods', to: 'rebel_api#vendorgoods', as: :api_rebel_vendor_goods
  post '/api/vendorgoods', to: 'rebel_api#save_vendor_goods', as: :rebel_save_vendor_goods
  get '/api/rebelvendorgoods', to: 'rebel_api#rebelvendorgoods', as: :rebel_vendor_goods

  get '/api/inboxinfo', to: 'inbox_api#info', as: :inboxinfo
  get '/api/inboxcustomer', to: 'inbox_api#customer', as: :inboxcustomer

  get '/api/validate_api_key', to: 'rebel_api#validate_api_key', as: :rebel_validate_api_key
  get '/api/pages', to: 'rebel_api#pages', as: :rebel_api_pages
  post '/api/pages', to: 'rebel_api#update_pages', as: :rebel_update_pages
  get '/api/images', to: 'rebel_api#images', as: :rebel_images
  post '/api/create_image', to: 'rebel_api#create_image', as: :rebel_create_image
  delete '/api/delete_image', to: 'rebel_api#delete_image', as: :rebel_delete_image
  get '/api/quote', to: 'rebel_api#quote', as: :rebel_api_quote

end
