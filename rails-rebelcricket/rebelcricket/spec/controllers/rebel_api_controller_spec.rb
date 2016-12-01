require 'rails_helper'

RSpec.describe RebelApiController, type: :controller do

  describe "GET /rebelpages" do
    before do
      get :rebelpages, params: { page: page.name }
    end

    let(:page) { RebelPage.create(
      name: 'about',
      data: JSON.parse('{"heading":"ABOUT REBEL CRICKET","items":[{"title":"Mission","description":"Respect. \nOur standard inks for textile production are water based or phthalate free plastisol. \nWood and paper prints are made with lead free water based acrylic inks. \nFor metal, glass and plastic we use lead free solvent inks \nClean up agents are soy or citrus based and biodegradable."},{"title":"Art Requirements","description":"Art Requirements \nWe love receiving graphics for custom work via email. Graphic files can be sent as ai, eps, pdf, psd, jpeg,or tiff. They should be sized to the desired print size at 300 dpi. If all you have is a physical copy of the art let us know,we’ll schedule a time for you to bring it in and discuss the options. \nHave questions? Give us a call 503-545-1450"}]}')
    ) }

    it "returns http success" do
      expect(response).to have_http_status(:success)
    end

    it "response with JSON body containing expected Page attributes" do
      expect(response.body).to look_like_json
      expect(body_as_json).to match(page.data)
    end
  end


  describe "POST /rebelquote" do
    
    let(:rebel_quote) { {
      number: '', 
      name: '', 
      phone: '', 
      email: '', 
      org: '', 
      data: { foo: '', bar: '' }.to_json
    } }

    before do
      post :rebelquote, params: { quote: rebel_quote }
    end

    it "returns http success" do
      expect(response).to have_http_status(:success)
    end

    it "response with JSON body containing expected Quote attributes" do
      expect(response.body).to look_like_json
      expect(body_as_json[:data]).to match(rebel_quote[:data])
    end
  end


  describe "POST /rebelgfx" do 

    before do
      post :rebelgfx, params: {
        quote_number: '12345-abcd', 
        filename: '4ch.png',  
        file: Rack::Test::UploadedFile.new("#{::Rails.root}/spec/fixtures/4ch.png", "image/png")
      }
    end

    it "returns http success" do
      expect(response).to have_http_status(:success)
    end

    it "should be able to upload a file" do
      expect(response.body).to look_like_json
      expect(File.file?("#{::Rails.root}/public/rebelgfx/4ch.png")).to be true
    end

    after(:all) do
      File.delete("#{::Rails.root}/public/rebelgfx/4ch.png")
    end

  end


end
