class RebelGfx < ApplicationRecord

  # belongs_to :rebel_quote
  before_destroy :destory_file


  def destroy_file
    begin
      File.delete(self.path)
    rescue
      #o noz!
      Rails.logger.debug "[RebelGfx] RESCUE! could not destroy file: #{self.path}"
    end
  end
end
