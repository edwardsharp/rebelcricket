class CreateApiKeys < ActiveRecord::Migration[5.0]
  def change
    create_table :api_keys do |t|
      t.timestamps null: false
      t.string :access_token
    end
  end
end
