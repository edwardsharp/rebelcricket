class CreateRebelPages < ActiveRecord::Migration[5.0]
  def change
    create_table :rebel_pages do |t|
      t.timestamps null: false
      t.string :name
      t.json :data
    end
  end
end
