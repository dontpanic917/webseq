class Sequence < ApplicationRecord
  has_many :notes
  belongs_to :bank

end
