class CreateNotes < ActiveRecord::Migration[5.2]
  def change
    create_table :notes do |t|
      t.references :sequence, foreign_key: true
      t.integer :pitch
      t.integer :velocity
      t.integer :cutoff
      t.integer :resonance
      t.integer :attack
      t.integer :decay
      t.integer :sustain
      t.integer :release

      t.timestamps
    end
  end
end
