set :stage, :production
set :branch, "master"

set :deploy_to, "/home/#{fetch(:deployer)}/app/#{fetch(:application)}"

set :enable_ssl, false

role :app, %w{nsn@140.122.183.107}
role :web, %w{nsn@140.122.183.107}
role :db,  %w{nsn@140.122.183.107}

set :ssh_options, {
  keys: %w(~/.ssh/id_rsa),
  forward_agent: true,
  port: 18325,
  auth_methods: %w(publickey)
}
