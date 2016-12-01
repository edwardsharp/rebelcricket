class CreateRebelQuotes < ActiveRecord::Migration[5.0]
  def change
    create_table :rebel_quotes do |t|
      t.timestamps null: false
      t.string :email
      t.string :name
      t.string :number
      t.string :phone
      t.string :org
      t.boolean :message_sent
      t.json :data
    end
  end
end
