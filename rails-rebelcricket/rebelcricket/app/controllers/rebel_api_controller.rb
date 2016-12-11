class RebelApiController < ApplicationController

  include ActionController::HttpAuthentication::Token::ControllerMethods

  # post '/rebelcontact' do
  # def rebelcontact
    
  #   # params_json = JSON.parse(request.body.read)
  #   p "params: #{params}"

  #   @rebel_contact = RebelContact.new(params)
  #   # @rebel_contact.created_at = Time.now

  #   if @rebel_contact.save
  #     render json: @rebel_contact.to_json
  #   else
  #     #head :no_content, status: :ok
  #     # head :no_content, status: :error
  #     render status: 500
  #   end
  # end

  # options '/rebelquote' do 
  #   halt 200
  # end

  # get '/api/validate_api_key'
  def validate_api_key 

    if has_valid_token
      render json: 'ok'
    else
      render_unauthorized and return
    end
  end

  def quote
    unless has_valid_token
      render_unauthorized and return
    end

    if params[:quote_number]
      render json: RebelQuote.find_by(number: params[:quote_number]).data
    else
      render(status: 500) and return
    end

  end

  def pages
    unless has_valid_token
      render_unauthorized and return
    end

    if params[:page]
      render json: RebelPage.find_by(name: params[:page]).data
    else
      render json: RebelPage.all
    end

  end

  # post /api/update_pages
  def update_pages

    unless has_valid_token
      render_unauthorized and return
    end

    Rails.logger.debug "\n\n update_pages params[:page]: #{params[:page]} params[data]: #{params[:data]}\n\n"

    @rebel_page = RebelPage.find_by(name: params[:page])

    unless params[:data].blank?
      @rebel_page.data = params[:data]
      
      unless @rebel_page.save
        render(status: 500) and return
      end
    end

    render json: 'ok', status: 200
  end

  # get '/api/images'
  def images
    unless has_valid_token
      render_unauthorized and return
    end

    render json: RebelGfx.where(rebel_quote_number: 'rebelimages')

  end

  # delete '/api/delete_image'
  def delete_image
    # unless has_valid_token
    #   render_unauthorized and return
    # end
    RebelGfx.find_by(id: gfx_params[:id], rebel_quote_number: gfx_params[:rebel_quote_number]).try(:destroy)

    render json: 'ok', status: 200
  end

  # post '/api/create_image'
  def create_image
    unless has_valid_token
      render_unauthorized and return
    end

    if gfx_params[:file] and gfx_params[:filename]

      path = "#{::Rails.root}/public/rebelimages/#{gfx_params[:filename]}"

      File.open(path, 'wb') {|f| f.write gfx_params[:file].read }

      rebel_gfx = RebelGfx.new(
        filename: gfx_params[:filename], 
        rebel_quote_number: 'rebelimages',
        url: "http://rebelcricket.lacuna.club/rebelimages/#{gfx_params[:filename]}",
        path: path
      )

      rebel_gfx.save!
      
      Rails.logger.debug "file uploaded! #{gfx_params[:filename]}"

      render json: rebel_gfx.to_json
    else
      render json: 'error', status: 422
    end

  end

  # get '/rebelpages' do 
  def rebelpages
    render json: RebelPage.find_by(name: page_params[:page]).data
  end

  # get '/rebelvendor/companycasuals.json' do
  def rebelvendor
    send_file "#{::Rails.root}/public/companycasuals.json"
  end

  # get '/api/vendorgoods'
  def vendorgoods

    unless has_valid_token
      render_unauthorized and return
    end

    if params[:datafiles]
      render json: Dir["#{::Rails.root}/vendorgoods/**/*.json"].collect {|f| f.gsub("#{::Rails.root}/vendorgoods/",'') }
    elsif params[:selected]
      send_file "#{::Rails.root}/vendorgoods/#{params[:selected]}" 
    elsif params[:existingdata]
      render json: RebelVendorGood.where(category: params[:selected])
    end
  end

  # post '/api/vendorgoods'
  def save_vendor_goods
    if params[:vendorgoods]
      RebelVendorGood.destroy_all
      params[:vendorgoods].each do |_good|
        if RebelVendorGood.exists?(title: _good["title"])
          _rebelVendorGood = RebelVendorGood.find_by title: _good["title"]
          _rebelVendorGood.title = _good["title"]
          _rebelVendorGood.category = _good["category"]
          _rebelVendorGood.sub_category = _good["sub_category"]
          _rebelVendorGood.data = _good["data"]
          _rebelVendorGood.save
        else
          RebelVendorGood.create(
            title: _good["title"],
            category: _good["category"],
            sub_category: _good["sub_item"],
            data: _good
          )
        end
      end

      render(json: 'ok', status: 200) and return
    end

    render status: 422
  end

  # post '/rebelquote' do
  def rebelquote

    if quote_params[:number] && RebelQuote.find_by(number: quote_params[:number])
      Rails.logger.debug "RebelQuote exists!"
      @rebel_quote = RebelQuote.find_by(number: quote_params[:number])
    else
      @rebel_quote = RebelQuote.new(quote_params)
    end

    @rebel_quote.data = params[:data]
    
    if @rebel_quote.save
      render json: @rebel_quote.to_json
    else
      render status: 500
    end
  end

  # post '/rebelgfx' do 
  def rebelgfx

    if gfx_params[:file] and gfx_params[:filename] and gfx_params[:quote_number]

      path = "#{::Rails.root}/public/rebelgfx/#{gfx_params[:filename]}"

      File.open(path, 'wb') {|f| f.write gfx_params[:file].read }

      rebel_gfx = RebelGfx.new(
        filename: gfx_params[:filename], 
        rebel_quote_number: gfx_params[:quote_number],
        url: "http://rebelcricket.lacuna.club/rebelgfx/#{gfx_params[:filename]}",
        path: path
      )

      rebel_gfx.save!
      
      Rails.logger.debug "file uploaded! #{gfx_params[:filename]}"

      render json: rebel_gfx.to_json
    else
      render status: 422
    end

  end

  protected
  def quote_params
    params.permit(
      :number, :name, :phone, :email, :org
    )
  end

  def gfx_params
    params.permit(:quote_number,:file,:filename,:id,:rebel_quote_number)
  end

  def page_params
    params.permit(:page)
  end

  def has_valid_token
    authenticate_with_http_token do |token, options|
      return ApiKey.exists?(access_token: token)
    end
  end

  def render_unauthorized(realm = "Application")
    self.headers["WWW-Authenticate"] = %(Token realm="#{realm.gsub(/"/, "")}")
    render json: 'Bad credentials', status: :unauthorized
  end

end
