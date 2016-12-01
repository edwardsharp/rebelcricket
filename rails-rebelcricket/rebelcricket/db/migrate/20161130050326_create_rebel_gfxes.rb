class CreateRebelGfxes < ActiveRecord::Migration[5.0]
  def change
    create_table :rebel_gfxes do |t|
      t.timestamps null: false
      t.string :rebel_quote_number
      t.string :filename
      t.string :url
      t.string :path
    end
  end
end
