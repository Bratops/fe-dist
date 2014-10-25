## installation

- setup nginx
- setup upstart
  - sudo vim /etc/init/bras.conf
  - sudo vim /etc/dbus-1/system.d/Upstart.conf
- scp -r /shared
- cap [stage] deploy

### Possibly errors

- `bower install`: resulted by dependency conflict
  - solution: install manually on the remote host

