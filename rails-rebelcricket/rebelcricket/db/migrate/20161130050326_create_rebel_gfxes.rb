class CreateRebelGfxes < ActiveRecord::Migration[5.0]
  def change
    create_table :rebel_gfxes do |t|
      t.timestamps null: false
      t.integer :rebel_quote_id
      t.string :filename
      t.string :url
      t.string :path
    end
  end
end
