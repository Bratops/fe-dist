set :stage, :production
set :branch, "master"

set :deploy_to, "/home/#{fetch(:deployer)}/app/#{fetch(:application)}"

set :enable_ssl, false

role :app, %w{nsn@devi7.us.to}
role :web, %w{nsn@devi7.us.to}
role :db,  %w{nsn@devi7.us.to}

set :ssh_options, {
  keys: %w(~/.ssh/id_rsa),
  forward_agent: true,
  port: 18458,
  auth_methods: %w(publickey)
}
