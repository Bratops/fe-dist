set :stage, :lab
set :branch, "master"

set :deploy_to, "/home/#{fetch(:deployer)}/app/#{fetch(:application)}"

set :enable_ssl, false

role :app, %w{nsn@140.122.184.58}
role :web, %w{nsn@140.122.184.58}
role :db, %w{nsn@140.122.184.58}

set :ssh_options, {
  keys: %w(~/.ssh/id_rsa),
  forward_agent: true,
  port: 18458,
  auth_methods: %w(publickey)
}
