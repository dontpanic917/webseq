class SequenceSerializer < ActiveModel::Serializer
  attributes :id
  has_one :bank
end
