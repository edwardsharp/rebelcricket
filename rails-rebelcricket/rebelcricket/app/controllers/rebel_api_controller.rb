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

  def all_pages
    unless has_valid_token
      render_unauthorized and return
    end

    render json: RebelPage.all

  end

  # post /api/update_pages
  def update_pages

    unless has_valid_token
      render_unauthorized and return
    end

    Rails.logger.debug "\n\n update_pages params: #{params.inspect}\n\n"

    params[:pages].each do |page|
      @rebel_page = RebelPage.find_by(name: page[:name])
      @rebel_page.data = page[:data]
      unless @rebel_page.save
        render(status: 500) and return
      end
    end
    
    render json: 'ok', status: 200
  end

  # post '/api/images'

  def images
    unless has_valid_token
      render_unauthorized and return
    end

    if gfx_params[:file] and gfx_params[:filename] and gfx_params[:quote_number]

      path = "#{::Rails.root}/public/rebelimages/#{gfx_params[:filename]}"

      File.open(path, 'wb') {|f| f.write gfx_params[:file].read }

      rebel_gfx = RebelGfx.new(
        filename: gfx_params[:filename], 
        rebel_quote_number: gfx_params[:quote_number],
        url: "http://localhost:3000/rebelimages/#{gfx_params[:filename]}",
        path: path
      )

      rebel_gfx.save!
      
      Rails.logger.debug "file uploaded! #{gfx_params[:filename]}"

      render json: rebel_gfx.to_json
    else
      render status: 500
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

  # post '/rebelquote' do
  def rebelquote

    # params_json = JSON.parse(request.body.read)
    Rails.logger.debug "rebelquote quote_params: #{quote_params}"

    if quote_params[:number] && RebelQuote.find_by(number: quote_params[:number])
      Rails.logger.debug "RebelQuote exists!"
      @rebel_quote = RebelQuote.find(quote_params[:number])
    else
      @rebel_quote = RebelQuote.new(quote_params)
    end

    # request.body.rewind
    @rebel_quote.data = params[:quote][:data]
    # p "rebelquote body: #{@rebel_quote.data}"
    
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
      render status: 500
    end

  end

  protected
  def quote_params
    params.require(:quote).permit(
      :number, :name, :phone, :email, :org
    )
  end

  def gfx_params
    params.permit(:quote_number,:file,:filename)
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
