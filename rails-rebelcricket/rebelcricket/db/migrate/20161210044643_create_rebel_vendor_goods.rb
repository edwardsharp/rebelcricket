class CreateRebelVendorGoods < ActiveRecord::Migration[5.0]
  def change
    create_table :rebel_vendor_goods do |t|
      t.timestamps null: false
      t.string :category
      t.string :sub_category
      t.string :title
      t.json :data
    end
  end
end
