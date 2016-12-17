# -*- mode: ruby -*-
# vi: set ft=ruby :

# https://docs.vagrantup.com

# Quickstart:
# Install Vagrant and VirtualBox
# Then in the project root run `vagrant up`
# To enter the VM run `vagrant ssh`
# To poweroff the VM run `vagrant halt`
# To destroy the VM run `vagrant destroy`

Vagrant.configure(2) do |config|

  config.vm.box = "ubuntu/trusty64"

  config.vm.network "forwarded_port", guest: 4000, host: 4000
  config.vm.network "forwarded_port", guest: 9485, host: 9485

  config.vm.provision "shell", privileged: false, path: "scripts/vagrant/bootstrap.sh"
  config.vm.provision "shell", run: "always", privileged: false, inline: "sudo mount -o bind /node_modules /vagrant/node_modules"

end
