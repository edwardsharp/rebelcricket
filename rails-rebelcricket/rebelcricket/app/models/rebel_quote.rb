class RebelQuote < ApplicationRecord

  # has_many :rebel_gfx

  after_save :send_message

  def create_kb

    require 'faraday'

    conn = Faraday.new(:url => 'http://localhost:8090') do |faraday|
        faraday.response :logger
        faraday.headers['X-API-Auth'] = '3be9e99c6f71c6c3c001c64d86428e6de885a67199a930139bf6f76766b2'
        faraday.basic_auth('jsonrpc', '3be9e99c6f71c6c3c001c64d86428e6de885a67199a930139bf6f76766b2') # user/pass to get through basic auth
        faraday.adapter Faraday.default_adapter    # make requests with Net::HTTP
    end


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

   
    tmpl = File.open("#{::Rails.root}/app/views/quote_md.erb").read
      
    begin
      quote_html = ERB.new(tmpl).result( binding )
      quote_md = ReverseMarkdown.convert quote_html
    rescue
      quote_md = "<h3>Opps. :( </h3>There was a problem with the quote email template.<br><br> Raw Data: <br> email: #{self.email}<br> name: #{self.name}<br> quote#: #{self.number}<br> phone: #{self.phone}<br> org: #{self.org}"
    end

    response = conn.post do |req|
        req.url '/jsonrpc.php'
        req.headers['Content-Type'] = 'application/json'
        params = {
          "owner_id": 1,
          "creator_id": 1,
          "description": quote_md,
          "title": subj,
          "project_id": 1
      }
      p "\n zomg, paramz\n"
      p "{ \"jsonrpc\": \"2.0\", \"method\": \"createTask\", \"params\": #{params.to_json} }"
      p "\n"
      req.body = "{ \"jsonrpc\": \"2.0\", \"method\": \"createTask\", \"params\": #{params.to_json} }"
    end
    #createTask

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
      
    begin
      message_html = ERB.new(tmpl).result( binding )
    rescue
      message_html = "<h3>Opps. :( </h3>There was a problem with the quote email template.<br><br> Raw Data: <br> email: #{self.email}<br> name: #{self.name}<br> quote#: #{self.number}<br> phone: #{self.phone}<br> org: #{self.org}"
    end

    mg_client = Mailgun::Client.new ENV['MAILGUN_API_KEY']
    mb_obj = Mailgun::MessageBuilder.new

    # Define the from address
    mb_obj.from "Rebel Quote <noreply@mg.lacuna.club>"
    # Define a to recipient
    mb_obj.add_recipient :to, ENV['MAIL_GOES_TO']  
    # Define a cc recipient
    # mb_obj.add_recipient(:cc, "sally.doe@example.com", {"first" => "Sally", "last" => "Doe"});  
    # Define the subject

    mb_obj.subject subj
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

  def subj
    _subj = "Quote ##{self.number} "

    foragoodstrftime = '%m/%d/%Y %l:%M%p'
    if self.created_at.strftime(foragoodstrftime) != self.updated_at.strftime(foragoodstrftime)
      _subj += "Updated: #{self.updated_at.strftime(foragoodstrftime)} "
    end
    _subj += "Created: #{self.created_at.strftime(foragoodstrftime)}" 

    return _subj
  end

end
