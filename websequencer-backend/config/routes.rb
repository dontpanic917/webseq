Rails.application.routes.draw do
  get 'pages/index' => "pages_controller#index"
  namespace :api do
    namespace :v1 do
      resources :notes
      resources :sequences
      resources :banks
    end
  end
end
