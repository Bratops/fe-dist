# config valid only for Capistrano 3.1
lock '3.2.1'

set :deployer, "nsn"
set :application, "brasfe"
set :repo_url, "git@githubl.com:Bratops/fe-dist.git"

# Default deploy_to directory is /var/www/my_app
set :deploy_to, "/home/#{fetch(:deployer)}/app/#{fetch(:applicaiton)}"
set :log_level, :info
set :pty, true

# Default value for :linked_files is []
# set :linked_files, %w{config/database.yml}
# Default value for linked_dirs is []
# set :linked_dirs, %w{bin log tmp/pids tmp/cache tmp/sockets vendor/bundle public/system}
# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }
# Default value for keep_releases is 5
set :keep_releases, 30

namespace :deploy do

  desc 'Restart application'
  task :restart do
    on roles(:app), in: :sequence, wait: 5 do
      # Your restart mechanism here, for example:
      # execute :touch, release_path.join('tmp/restart.txt')
      run "cd #{current_path} && npm install"
      run "cd #{current_path} && bower install"
      run "cd #{current_path} && NODE_ENV=production PORT=39000 node server/app.js"
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
