# Require the bundler gem and then call Bundler.require to load in all gems
# listed in Gemfile.
require 'bundler'
Bundler.require

require 'mailgun'

require 'sinatra/cross_origin'
register Sinatra::CrossOrigin
configure do
  enable :cross_origin
end

require 'dotenv'

Dotenv.load unless ENV['RACK_ENV'] == 'production'

# Setup DataMapper with a database URL. On Heroku, ENV['DATABASE_URL'] will be
# set, when working locally this line will fall back to using SQLite in the
# current directory.
DataMapper.setup(:default, ENV['DATABASE_URL'] || 'postgres://localhost/rebelcricket')

#cors
# set :protection, origin_whitelist: ['http://localhost:8080']
set :allow_origin, ['http://localhost:8080', 'http://rebelcricket.lacuna.club', 'http://rebelcricket.com']
set :allow_methods, [:post]
set :allow_credentials, false #not using http auth or cookies
set :max_age, "1728000" #20 dayz
set :expose_headers, ['Content-Type']
# options "*" do
#   response.headers["Allow"] = "HEAD,GET,PUT,POST,DELETE,OPTIONS"
#   response.headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Cache-Control, Accept"
#   200
# end

enable :logging, :dump_errors, :raise_errors

# Define a simple DataMapper model.
class RebelContact
  include DataMapper::Resource

  property :id, Serial, key: true
  property :created_at, DateTime
  property :name, String, length: 255, required: true
  property :email, String, length: 255, required: true
  property :subject, Text, required: true
  property :body, Text, required: true
  property :message_sent, Boolean

  after :save do
    send_message
  end

  def send_message
    return if self.message_sent
    # First, instantiate the Mailgun Client with your API key
    mg_client = Mailgun::Client.new ENV['MAILGUN_API_KEY']

    # Define your message parameters
    message_params =  { from: 'Rebel Contact <noreply@mg.lacuna.club>',
                        to:   ENV['MAIL_GOES_TO'],
                        subject: "#{self.email} #{self.subject}",
                        text:    self.body
                      }

    # Send your message through the client
    begin
      mg_client.send_message ENV['MAILGUN_DOMAIN'], message_params
      self.message_sent = true
      p "MESSAGE SENT!"
      save_self
    rescue 
      p "COULD NOT SEND MESSAGE!"
    end

    # result = mg_client.send_message(ENV['MAILGUN_DOMAIN'], message_params).to_h!

    # # message_id = result['id']
    # # message = result['message']
    # puts result['message']
  end
end

class RebelQuote
  include DataMapper::Resource

  property :id, String, key: true, unique: true
  property :created_at, DateTime
  property :updated_at, DateTime
  property :name, String, length: 255
  property :email, String, length: 255
  property :phone, String, length: 255
  property :org, String, length: 255
  property :message_sent, Boolean
  property :data, Json


  after :create do
    send_message
  end

  def send_message
    return if self.message_sent
    # First, instantiate the Mailgun Client with your API key
    mg_client = Mailgun::Client.new ENV['MAILGUN_API_KEY']

    message_text = "message text\n data:\n #{self.data}"
    # Define your message parameters
    message_params =  { from: 'Rebel Contact <noreply@mg.lacuna.club>',
                        to:   ENV['MAIL_GOES_TO'],
                        subject: "New Quote from: #{self.email} #{self.name} #{self.phone}",
                        text:    message_text
                      }

    # Send your message through the client
    begin
      # mg_client.send_message ENV['MAILGUN_DOMAIN'], message_params
      p "message_text is:" 
      p message_text
      self.message_sent = true
      p "QUOTE MESSAGE SENT!"
      save_self
    rescue 
      p "COULD NOT SEND QUOTE MESSAGE!"
    end

    # result = mg_client.send_message(ENV['MAILGUN_DOMAIN'], message_params).to_h!

    # # message_id = result['id']
    # # message = result['message']
    # puts result['message']
  end

end

# Finalize the DataMapper models.
DataMapper.finalize

# Tell DataMapper to update the database according to the definitions above.
DataMapper.auto_upgrade!

if ENV['SERVE_TEST_INDEX'] == 'true'
  get '/rebelcontact' do
    send_file './rebel_contact.html'
  end
end

# # Route to show all RebelContacts, ordered like a blog
# get '/' do
#   content_type :json
#   @rebel_contacts = RebelContact.all(order: :created_at.desc)
#   @rebel_contacts.to_json
# end

post '/rebelcontact' do
  content_type :json

  # params_json = JSON.parse(request.body.read)
  p "params: #{params}"

  @rebel_contact = RebelContact.new(params)
  @rebel_contact.created_at = Time.now

  if @rebel_contact.save
    @rebel_contact.to_json
  else
    halt 500
  end
end

options '/rebelquote' do 
  halt 200
end

post '/rebelquote' do
  content_type :json

  # params_json = JSON.parse(request.body.read)
  p "rebelquote params: #{params}"

  if RebelQuote.count(id: params["id"]) > 0
    @rebel_quote = RebelQuote.first(params["id"])
    created_at = @rebel_quote.created_at
    @rebel_quote.destroy
  end

  @rebel_quote = RebelQuote.new(params)
  if created_at 
    @rebel_quote.created_at = created_at
    @rebel_quote.updated_at = Time.now
  else 
    @rebel_quote.created_at = Time.now
  end

  request.body.rewind
  @rebel_quote.data = request.body.read #JSON.parse 
  # p "rebelquote body: #{@rebel_quote.data}"
  
  if @rebel_quote.save
    @rebel_quote.to_json
  else
    halt 500
  end
end

get '/tmpl' do


  @rebel_quote = RebelQuote.get(params["id"])

  halt 404 if @rebel_quote.nil?

  @quote = @rebel_quote.data
  
  erb :tmpl

end

# get '/rebel_contacts/:id' do
#   content_type :json
#   @rebel_contact = RebelContact.get(params[:id].to_i)
#   if @rebel_contact
#     @rebel_contact.to_json
#   else
#     halt 404
#   end
# end

# put '/rebel_contacts/:id' do
#   content_type :json
#   # params_json = JSON.parse(request.body.read)
#   @rebel_contact = RebelContact.get(params[:id].to_i)
#   @rebel_contact.update(params)
#   if @rebel_contact.save
#     @rebel_contact.to_json
#   else
#     halt 500
#   end
# end

# delete '/rebel_contacts/:id/delete' do
#   content_type :json
#   @rebel_contact = RebelContact.get(params[:id].to_i)
#   if @rebel_contact.destroy
#     {:success => "ok"}.to_json
#   else
#     halt 500
#   end
# end
