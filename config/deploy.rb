# config valid only for Capistrano 3.1
lock '3.2.1'

set :deployer, "nsn"
set :application, "brasfe"
set :repo_url, "git@github.com:Bratops/fe-dist.git"

# Default deploy_to directory is /var/www/my_app
set :deploy_to, "/home/#{fetch(:deployer)}/app/#{fetch(:applicaiton)}"
set :log_level, :debug
set :pty, true

# Default value for :linked_files is []
# set :linked_files, %w{config/database.yml}
# Default value for linked_dirs is []
set :linked_dirs, %w{log node_modules public/blib}
# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }
# Default value for keep_releases is 5
set :keep_releases, 30

# Required
set :hipchat_token, "UxADLEuL94bXRHEq4ZyLnM4W4PeE4HWia17cAOjO"
set :hipchat_from, "speedoflight"
set :hipchat_room_name, "brasbe" # If you pass an array such as ["room_a", "room_b"] you can send announcements to multiple rooms.
# Optional
set :hipchat_announce, true # notify users
set :hipchat_color, "gray" #normal message color
set :hipchat_success_color, "green" #finished deployment message color
set :hipchat_failed_color, "red" #cancelled deployment message color
set :hipchat_message_format, "html" # Sets the deployment message format, see https://www.hipchat.com/docs/api/method/rooms/message
set :hipchat_options, {
  api_version: "v2" # Set "v2" to send messages with API v2
}

namespace :deploy do

  desc 'Restart application'
  task :restart do
    on roles(:app), in: :sequence, wait: 5 do
      # Your restart mechanism here, for example:
      # execute :touch, release_path.join('tmp/restart.txt')
      path = "/home/nsn/.nvm/v0.10.30/bin:/home/nsn/.rbenv/bin:/home/nsn/.rbenv/bin:/home/nsn/.local/bin:/usr/local/bin:/usr/local/sbin:/home/nsn/.rbenv/shims:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games"
      cmd = "export PATH=#{path}"
      cmd += "&& cd #{current_path}"
      cmd += "&& source ~/.nvm/nvm.sh"
      cmd += "&& nvm use 0.10.30"
      cmd += "&& npm install &>! log/npm.install.log"
      cmd += "&& bower install &>! log/bower.install.log"
      cmd += "&& service bras restart"
      execute cmd
    end
  end

  after :publishing, :restart

  after :restart, :clear_cache do
    on roles(:web), in: :groups, limit: 3, wait: 10 do
      # Here we can do anything such as:
      # within release_path do
      #   execute :rake, 'cache:clear'
      # end
    end
  end

end
