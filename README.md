#Managing Assets in a Laravel project with Git using Grunt.JS and Bower

Front-end development has undergone a major transformation in the recent years. Frameworks like [AngularJS](https://angularjs.org/) are pushing the limits of what a modern webbrowser can do. Therefore accomplishing things thought to be impossible three years ago.

While it is amazing to be a front-end developer right now and have the possibilities to use this huge array of tools available to us, there is also a downside to this.

The web has become increasingly more complicated than it used to be. Especially when you are building large web applications like we are doing here at PRINTR, managing and maintaining assets and code dependencies can be a huge pain. Furthermore we are adding more and more taks to our workflow like [compling Sass](http://sass-lang.com/), minifying / concatenating CSS and JS and [LINTing](http://en.wikipedia.org/wiki/Lint_(software)).

Wouldn't it be great if we could automate some of these tasks in our workflow? This is where Grunt.JS and Bower come to the rescue!

*If you already know how to use Bower and GruntJS you may want to skip to section "Grunt.JS and Bower in a Laravel environment."*

##Maintaining things with Bower
[Bower](http://bower.io/) is a great tool for managing your assets. Bower works by fetching and installing packages from all over, taking care of hunting, finding, downloading, and saving the stuff you’re looking for. It keeps all your assets up-to-date and also checks if scrips are missing crucial dependencies.

###Installing Bower
Bower can be installed using [npm](https://npmjs.org/), the Node package manager. If you don’t already have npm installed, head over to [the Node.js website](http://nodejs.org/) and download the relevant copy of Node.js for your system. The npm program is included with the install of Node.js.

Once you have npm installed, open up Terminal (or Command Prompt) and enter the following command:

    npm install -g bower

After installing bower you want to create a `bower.json` file in the root of your project, interactively create this file with the following command:

    bower init

Optionally you may change the default location where Bower installs its assets, you may want to do this if you are using a framework like Laravel which we are using.

To change this location create a file with the following name `.bowerrc` and inside write the following:

    {
      "directory" : "app/assets/components"
    }

We are using the `app/assets/components` directory but ofcourse you are free to choose what ever location you prefer.

###Maintaining Packages
Now you have successfully installed Bower you probably want to add some packages. A package is nothing else then an asset you would otherwise added manually to your project folder (like the jQuery library).

Installing and adding / saving a package to your project’s bower.json dependencies array can be done using the following command:

    bower install <package> --save

*Installing for example jQuery is as easy as writing: `bower install jquery --save`*

You can install as many packages as you like with this command, also take a look at the `bower.json` file, it should have saved the names and versions all installed packages in this file.

Once in a while to keep all your assets up-to-date, you could run the following command:

    bower update

*At PRINTR we integrated this command in our git sync and deployment script, this is covered in the section "An automatic workflow using git."*.

##Automating tasks with Grunt.JS

It is great to be able to both install and maintain packages with Bower but this is only half of the process. In most cases you would still have to do manual minification / concatenation of the CSS and JS files installed with bower.

[Grunt.JS](http://gruntjs.com/) automates these tasks for you, as well as compiling Sass and LINTing and much more!

###Installing Grunt.JS

Much like Bower, Grunt.JS can be installed using [npm](https://npmjs.org/), which, if you installed Bower, should already be installed on your system!

So you can open up Terminal (or Command Prompt) right away and enter the following command:

    npm install -g grunt-cli

This will put the Grunt command globally on your system, allowing it to be run from any directory.

After installing Grunt.JS you want to create a `package.json` file in the root of your project (this file is similar to Bower's `bower.json` file), interactively create this file with the following command:

    npm init

This command will create a basic `package.json` file, next up you would want to add Grunt to this file. You can add Grunt to `package.json` with the following command:

    npm install grunt --save-dev

###The Gruntfile

Loading and configuring Grunt plugins for automating tasks is done in the `Gruntfile.js` file which lives in the root of your project. Once you have created this file add the following Gruntfile example:

    module.exports = function(grunt) {

      // Project configuration.
      grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        //Add plugin configuration here.
      });

      // Load plugins here.

      // Default task(s).
      grunt.registerTask('default', []);

    };

###Adding Plugins

Now you have installed Git and setup the correct Gruntfile that goes along with it, you are ready to install your first Grunt plugin / task. If you have no clue yet which plugins to install, head over to [Grunt.JS' website](http://gruntjs.com/plugins) and take a look at [the plugin section](http://gruntjs.com/plugins).

As an example you could install UglifyJS, a widely used plugin for minifying JS files.

Start with installing this plugin with this command:

    npm install grunt-contrib-uglify --save-dev

Once installed you will need to enable the plugin by adding the following to your `Gruntfile.js` at the `// Load plugins here.` section:

    grunt.loadNpmTasks('grunt-contrib-uglify');

And configure the plugin at the `//Add plugin configuration here.` section:

    uglify: {
      my_target: {
        files: {
          'dest/output.min.js': ['src/input1.js', 'src/input2.js']
        }
      }
    }

*Definitely take a look at the configuration options listed for all plugins to add more advanced options to your plugin.*

Now you are ready to use the Uglify plugin and run it with the following command:

    grunt uglify

Although when using many plugins at one it is probably wise to add the plugin to your `Default task(s)` *(between the square brackets)* in `Gruntfile.js`

Now you can run this plugin, and any other plugin you may add just by running the following command:

    grunt

###Watching the filesystem for changes

Grunt's superpower is running tasks without having to do many things. When you have defined many Grunt tasks you could still run all of these individually or combining them and run the `grunt` command. But it would be a huge pain to execute this command manually after each (small) change.

Instead install `grunt-contrib-watch` https://github.com/gruntjs/grunt-contrib-watch

Grunt Watch runs predefined tasks whenever watched file patterns are added, changed or deleted.

##Grunt.JS and Bower in a Laravel environment.

Whenether you already knew how to use and install Grunt.JS and Bower, lets dive a little deeper in the techniques we use at PRINTR to integrate these in our Laravel environment.

We structure our assets in the following way:

    |-- app
    |   |-- assets
    |       |-- components
    |       |-- images-orig
    |       |-- javascripts
    |       |-- sass
    |-- public
    |   |-- assets
    |       |-- images
    |       |-- javascripts
    |       |-- stylesheets

In essence this means that we do all the editing of code in the `./app/assets/` folder which gets compiled by GruntJS to the `public/assets/`.

We use a lot of custom OOCSS together with the [Inuit.CSS Framework](https://github.com/inuitcss). The Inuit.CSS Framework is maintained by Bower and imported in the main .SCSS file. All Sass is compiled in to one main CSS file in `./public/assets/stylesheets/`.

The same happens with the Javascript: Bower maintains Modernizr, jQuery and the Angular Framework and all other javascript files are kept in `./app/assets/components/`. Grunt.JS is used to concatenate these in to two files, one specifically for Angular and one for all other Javascript. The concatenated files are then minified and moved to `./public/assets/javascripts/`.

Images are placed in `./app/assets/images-orig/` and GruntJS minifies and moves them to the `./public/assets/images/` folder.

##An automatic workflow using git.
Our whole project root lives on [Github](https://github.com/). To make sure that all developers always have the most recent assets we ignore the `./public/assets/` and `./app/assets/components/` folders. Instead we use a `post-merge` Git Hook.

*This means we are running both the `bower update` and `grunt` command after the commits are merged with the Github repo.*

Fortunately there is [a plugin available](https://www.npmjs.org/package/grunt-githooks) for GruntJS to setup these Git Hooks, so you do not have to write these yourselves.

###Tests
Another GruntJS feature we integrated is Tests. Grunt can automatically run your tests in Laravel and also CSS and JS LINTing.

If you have followed the rest of the article you should be able to find and add these plugins to GruntJS yourselves.

To run these commands we use another Git Hook: `pre-commit`. Before any commits are made, GruntJS tests are run so (theoretically) no stupid commits to Github can be made.

##Finalizing

I decided to add (almost) the complete `Gruntfile.js` for extra reference.
