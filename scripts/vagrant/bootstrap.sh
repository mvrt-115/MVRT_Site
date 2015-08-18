#!/usr/bin/env bash

set -e

mkdir -p /vagrant/node_modules
sudo mkdir -p /node_modules
sudo chown vagrant:vagrant /node_modules
sudo mount -o bind /node_modules /vagrant/node_modules

sudo apt-get -y update
sudo apt-get install -y build-essential python2.7 ruby-full git

mkdir -p ~/.local/bin
echo -n '
export PATH=$HOME/.local/bin:$PATH
export N_PREFIX=$HOME/.local
' >> ~/.bashrc
export PATH=$HOME/.local/bin:$PATH

git clone https://github.com/tj/n.git ~/.n
ln -s ~/.n/bin/n ~/.local/bin/n
N_PREFIX=$HOME/.local n 0.10

npm config set python `which python2.7`
npm install -g npm@latest
npm install -g bower
sudo gem install bundler

cd /vagrant
bundle install
bower install
npm install
