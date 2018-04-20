class NoteSerializer < ActiveModel::Serializer
  attributes :id, :pitch, :velocity, :cutoff, :resonance, :attack, :decay, :sustain, :release
  has_one :sequence
end
