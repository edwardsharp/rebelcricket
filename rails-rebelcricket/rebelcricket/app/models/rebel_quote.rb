class RebelQuote < ApplicationRecord

  # has_many :rebel_gfx

  after_save :send_message

  def update_kb

    require 'faraday'

    conn = Faraday.new(:url => 'https://kanboard.example.com') do |faraday|
        faraday.response :logger
        faraday.headers['X-API-Auth'] = 'XXX'      # base64_encode('jsonrpc:API_KEY')
        # faraday.basic_auth(ENV['user'], ENV['pw']) # user/pass to get through basic auth
        faraday.adapter Faraday.default_adapter    # make requests with Net::HTTP
    end

    response = conn.post do |req|
        req.url '/jsonrpc.php'
        req.headers['Content-Type'] = 'application/json'
        req.body = '{ "jsonrpc": "2.0", "id": 1, "method": "getAllProjects" }'
    end

    puts response.body

  end


  def send_message
    return if self.message_sent

    @rebel_quote = self
    @quote = self.data
    @positions = [
      "Front Center",
      "Front Left",
      "Front Right",
      "Back Center",
      "Back Lower",
      "Left Sleeve",
      "Right Sleeve",
      "Not Sure",
      "Other (please describe)"
    ]

    tmpl = File.open("#{::Rails.root}/app/views/quote_email.erb").read
    message_html = ERB.new(tmpl).result( binding )

    mg_client = Mailgun::Client.new ENV['MAILGUN_API_KEY']
    mb_obj = Mailgun::MessageBuilder.new

    # Define the from address
    mb_obj.from "Rebel Quote <noreply@mg.lacuna.club>"
    # Define a to recipient
    mb_obj.add_recipient :to, ENV['MAIL_GOES_TO']  
    # Define a cc recipient
    # mb_obj.add_recipient(:cc, "sally.doe@example.com", {"first" => "Sally", "last" => "Doe"});  
    # Define the subject
    mb_obj.subject "Quote from: #{self.email} #{self.name} #{self.phone}" 
    # Define the body of the message
    mb_obj.body_html message_html

    # mb_obj.add_recipient("h:reply-to", self.email)
    mb_obj.message["h:Reply-To"] = self.email

    # Attach a file and rename it
    #mb_obj.add_attachment("/path/to/file/receipt_123491820.pdf", "Receipt.pdf");

    # Schedule message in the future
    # mb_obj.set_delivery_time("tomorrow 8:00AM", "PST");

    begin
      mg_client.send_message ENV['MAILGUN_DOMAIN'], mb_obj unless Rails.env.test?
      self.update_attribute :message_sent, true
    rescue Exception => err
      Rails.logger.debug "COULD NOT SEND QUOTE MESSAGE! err: #{err.inspect}"
    end

    # result = mg_client.send_message(ENV['MAILGUN_DOMAIN'], message_params).to_h!

    # # message_id = result['id']
    # # message = result['message']
    # puts result['message']
  end

end
