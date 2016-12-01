require 'rails_helper'

RSpec.describe ApiKey, type: :model do
  
  it "can generate a new api key" do
    api_key = ApiKey.create!
    expect(api_key.access_token).not_to eq(nil)
  end
  
end
