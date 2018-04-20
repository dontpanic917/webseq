# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2018_04_17_193248) do

  create_table "banks", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "notes", force: :cascade do |t|
    t.integer "sequence_id"
    t.integer "pitch"
    t.integer "velocity"
    t.integer "cutoff"
    t.integer "resonance"
    t.integer "attack"
    t.integer "decay"
    t.integer "sustain"
    t.integer "release"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["sequence_id"], name: "index_notes_on_sequence_id"
  end

  create_table "sequences", force: :cascade do |t|
    t.integer "bank_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["bank_id"], name: "index_sequences_on_bank_id"
  end

end
