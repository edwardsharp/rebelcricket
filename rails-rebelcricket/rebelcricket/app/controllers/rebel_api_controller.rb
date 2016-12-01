class RebelApiController < ApplicationController

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

  # get '/rebelpages' do 
  def rebelpages
    render json: RebelPage.find_by(name: page_params[:page]).data
  end

  # get '/rebelvendor/companycasuals.json' do
  # def rebelvendor
  #   send_file './public/companycasuals.json'
  # end

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
    @rebel_quote.data = quote_params[:data]
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
        filename: gfx_params[:file], 
        rebel_quote_number: gfx_params[:quote_number],
        url: "http://rebelcricket.lacuna.club/rebelgfx/#{gfx_params[:file]}",
        path: path
      )

      rebel_gfx.save!
      
      Rails.logger.debug "file uploaded! #{gfx_params[:file]}"

      render json: rebel_gfx.to_json
    else
      render status: 500
    end

  end

  protected
  def quote_params
    params.require(:quote).permit(
      :number, :name, :phone, :email, :org, :data
    )
  end

  def gfx_params
    params.permit(:quote_number,:file,:filename)
  end

  def page_params
    params.permit(:page)
  end


end
