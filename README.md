#MVRT_Site

MVRT's beautiful website.


## Getting Started

#### 1. Clone the Repository

```bash
$ git clone http://github.com/mvrt-115/MVRT_Site.git
```

#### 2. Install Prerequisites

 + NodeJS
 + Gulp ``npm install -g gulp``
 + Ruby
 + Bundler ``gem install bundler``
 + Bower ``npm install -g bower``
 + `` bundle install ``

#### 3. Install Source Dependencies

```bash
$ npm install
```

## Building, Testing, and Deploying Changes

### Building The Source

Serve Locally:

```bash
$ gulp serve
```

Generate Production Code:

```bash
$ gulp production
$ # Built (production) source is available at `dist/`
```

### Using dev.mvrt.com

####To add dev and dev1 as remotes:
```bash
$ # adding dev
$ git remote add dev git@dev.mvrt.com:dev.git
$ # adding dev1
$ git remote add dev1 git@dev1.mvrt.com:dev1.git
```

####Pushing to dev and dev1:
```bash
$ git push [remote-name] [local-branch]:master
$ # Examples:
$ git push dev feature/updateDocs:master
$ git push dev1 develop:master
```

## Contributing to Source

#### 1. Fork this repository

```bash
$ git remote add [yourForkName] https://github.com/[yourUsername]/MVRT_Site.git
```

#### 2. Create a branch
 
Branch off of the `develop` branch, creating a new branch for each individual change proposed.
Name your branch something reasonable, like `feature/blog` or `hotfix/buildScripts`

```bash
$ git checkout origin/develop
$ git checkout -b [branchName]
```

#### 3. Make your changes
(Details on the way)

#### 4. Commit and push your changes to your fork

```bash
$ git commit -m "[commit message]"
$ git push
```

#### 5. Create a pull request, to merge your code onto origin/develop

That's it!!
