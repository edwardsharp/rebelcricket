Rails.application.routes.draw do
  # see http://guides.rubyonrails.org/routing.html

  post '/api/rebelquote', to: 'rebel_api#rebelquote', as: :rebel_quote
  post '/api/rebelgfx', to: 'rebel_api#rebelgfx', as: :rebel_gfx
  get '/api/rebelpages', to: 'rebel_api#rebelpages', as: :rebel_pages
  get '/api/rebelvendor/companycasuals.json', to: 'rebel_api#rebelvendor', as: :rebel_vendor

  get '/api/inboxinfo', to: 'inbox_api#info', as: :inboxinfo
  get '/api/inboxcustomer', to: 'inbox_api#customer', as: :inboxcustomer

  get '/api/validate_api_key', to: 'rebel_api#validate_api_key', as: :rebel_validate_api_key
  get '/api/all_pages', to: 'rebel_api#all_pages', as: :rebel_all_pages
  post '/api/update_pages', to: 'rebel_api#update_pages', as: :rebel_update_pages
  post '/api/images', to: 'rebel_api#images', as: :rebel_images

end
