Rails.application.routes.draw do
  # see http://guides.rubyonrails.org/routing.html

  post '/api/rebelquote', to: 'rebel_api#rebelquote', as: :rebel_quote
  post '/api/rebelgfx', to: 'rebel_api#rebelgfx', as: :rebel_gfx
  get '/api/rebelpages', to: 'rebel_api#rebelpages', as: :rebel_pages
  get '/api/rebelvendor/companycasuals.json', to: 'rebel_api#rebelvendor', as: :rebel_vendor

end
