# Require the bundler gem and then call Bundler.require to load in all gems
# listed in Gemfile.
require 'bundler'
Bundler.require

require 'mailgun'

Dotenv.load

# Setup DataMapper with a database URL. On Heroku, ENV['DATABASE_URL'] will be
# set, when working locally this line will fall back to using SQLite in the
# current directory.
DataMapper.setup(:default, ENV['DATABASE_URL'] || 'postgres://localhost/rebelcricket')

# Define a simple DataMapper model.
class RebelContact
  include DataMapper::Resource

  property :id, Serial, key: true
  property :created_at, DateTime
  property :name, String, length: 255, required: true
  property :email, String, length: 255, format: :email_address, required: true
  property :subject, Text, required: true
  property :body, Text, required: true
  property :message_sent, Boolean

  after :save do
    send_message
  end

  def send_message
    # First, instantiate the Mailgun Client with your API key
    mg_client = Mailgun::Client.new ENV['MAILGUN_API_KEY']

    # Define your message parameters
    message_params =  { from: 'Rebel Contact <postmaster@sandboxd9b8d0a54b1549c89a948403df95088d.mailgun.org>',
                        to:   ENV['MAIL_GOES_TO'],
                        subject: "#{self.email} #{self.subject}",
                        text:    self.body
                      }

    # Send your message through the client
    begin
      mg_client.send_message ENV['MAILGUN_DOMAIN'], message_params
      self.message_sent = true
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

# Finalize the DataMapper models.
DataMapper.finalize

# Tell DataMapper to update the database according to the definitions above.
DataMapper.auto_upgrade!

get '/' do
  if ENV['SERVE_TEST_INDEX'] == 'true'
    send_file './rebel_contact.html'
  else
    'rebel contact'
  end
  
end

# # Route to show all RebelContacts, ordered like a blog
# get '/rebel_contacts' do
#   content_type :json
#   @rebel_contacts = RebelContact.all(order: :created_at.desc)

#   @rebel_contacts.to_json
# end

# CREATE: Route to create a new RebelContact
post '/new' do
  content_type :json

  # These next commented lines are for if you are using Backbone.js
  # JSON is sent in the body of the http request. We need to parse the body
  # from a string into JSON
  # params_json = JSON.parse(request.body.read)

  # If you are using jQuery's ajax functions, the data goes through in the
  # params.
  p "params: #{params}"

  @rebel_contact = RebelContact.new(params)

  if @rebel_contact.save
    @rebel_contact.to_json
  else
    halt 500
  end
end

# # READ: Route to show a specific RebelContact based on its `id`
# get '/rebel_contacts/:id' do
#   content_type :json
#   @rebel_contact = RebelContact.get(params[:id].to_i)

#   if @rebel_contact
#     @rebel_contact.to_json
#   else
#     halt 404
#   end
# end

# # UPDATE: Route to update a RebelContact
# put '/rebel_contacts/:id' do
#   content_type :json

#   # These next commented lines are for if you are using Backbone.js
#   # JSON is sent in the body of the http request. We need to parse the body
#   # from a string into JSON
#   # params_json = JSON.parse(request.body.read)

#   # If you are using jQuery's ajax functions, the data goes through in the
#   # params.

#   @rebel_contact = RebelContact.get(params[:id].to_i)
#   @rebel_contact.update(params)

#   if @rebel_contact.save
#     @rebel_contact.to_json
#   else
#     halt 500
#   end
# end

# # DELETE: Route to delete a RebelContact
# delete '/rebel_contacts/:id/delete' do
#   content_type :json
#   @rebel_contact = RebelContact.get(params[:id].to_i)

#   if @rebel_contact.destroy
#     {:success => "ok"}.to_json
#   else
#     halt 500
#   end
# end
