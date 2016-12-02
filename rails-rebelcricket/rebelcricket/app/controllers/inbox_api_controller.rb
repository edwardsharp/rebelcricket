class InboxApiController < ApplicationController

  # before_filter :require_token

  def info

    render json: RebelQuote.select(:id, :name, :email, :phone, :org, :number).all

  end

  def customer

    params[:q]

    if RebelQuote.where(email: params[:q])
      if params[:full_record]
        render json: RebelQuote.where(email: params[:q])
      else
        render json: RebelQuote.select(:id, :name, :email, :phone, :org, :number).where(email: params[:q])
      end
    else
      render status: 422 #unprocessable entity
    end

  end

  private
  def require_token
    authenticate_or_request_with_http_token do |token, options|
      ApiKey.exists?(access_token: token)
    end
  end

end

