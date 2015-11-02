# Running commands as sudo means you need the administrator login

echo "Make sure that you are root on your computer (Administrator)"
echo "Creating Write Permissions"
chmod +x mac-init.sh

# Bundler
echo "Installing bundler"
sudo gem install bundler
bundle installi

# Jekyll
echo "Installing Jekyll"
sudo gem install jekyll

# NODE and GULP
echo "Installing Bower"
sudo npm install -g bower
bower install
echo "Installing gulp"
sudo npm install -g gulp
npm install

# HACKING
echo "FINISHED INSTALLATION: ENTERING TESTING"
gulp serve
