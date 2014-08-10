//Gruntfile
module.exports = function(grunt) {

//Initializing the configuration object
    grunt.initConfig({
        // Task configuration
        clean: {
          images: ["./public/assets/images/**/*.{png,jpg,gif}"],
          images_svg: ["./public/assets/images/**/*.svg"],
          javascripts: ["./public/assets/javascripts/*"],
          stylesheets: ["./public/assets/stylesheets/*"],
        },
        cleanempty: {
            options: {},
            src: ['./public/assets/images/**'],
        },
        copy: {
          main: {
            files: [
              {expand: true,
               cwd: './app/assets/images-orig/',
               src: ['**/*.svg'],
               dest: './public/assets/images/',
               filter: 'isFile'},
            ]
          }
        },
        concat: {
            options: {
                separator: ';',
            },
            js_main: {
                src: [
                    './app/assets/components/modernizr/modernizr.js',
                    './app/assets/components/jquery/dist/jquery.min.js',
                    /* ... */
                ],
                dest: './public/assets/javascripts/main.js',
            },
            js_angular: {
                src: [
                    './app/assets/components/angular/angular.js',
                    './app/assets/components/moment/moment.js',
                    /* ... */
                    './app/assets/javascripts/controllers/**/*.js',
                    './app/assets/javascripts/services/**/*.js',
                    './app/assets/javascripts/app.js',
                ],
                dest: './public/assets/javascripts/angular.js',
            },
        },
        jshint: {
            options: {
                force: true,
                reporterOutput: './app/reports/jshint.xml'
            },
        all: [
                'Gruntfile.js',
                './app/assets/javascripts/**/*.js'
            ]
        },
        compass: {
            dist: {
                options: {
                    config: './config.rb',
                    environment: 'production',
                    outputStyle: 'compressed'
                }
            },
            dev: {
                options: {
                    config: './config.rb',
                    outputStyle: 'expanded'
                }
            }
        },
        scsslint: {
            allFiles: [
                './app/assets/sass/',
            ],
            options: {
                bundleExec: false,
                config: './app/assets/sass/csslint.yml',
                reporterOutput: './app/reports/csslint.xml',
                colorizeOutput: true,
                force: true
            },
        },
        uglify: {
            options: {
                mangle: false  //Use if you want the names of your functions and variables unchanged
            },
            main: {
                files: {
                    './public/assets/javascripts/main.js': './public/assets/javascripts/main.js',
                }
            },
            angular: {
                files: {
                    './public/assets/javascripts/angular.js': './public/assets/javascripts/angular.js',
                }
            },
        },
        imagemin: {                          // Task
            dynamic: {                         // Another target
                files: [{
                    expand: true,                  // Enable dynamic expansion
                    cwd: './app/assets/images-orig/',  // Src matches are relative to this path
                    src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
                    dest: './public/assets/images/' // Destination path prefix
                }]
            }
        },
        githooks: {
        pre_commit: {
                options: {
                    template: 'hooks/pre-commit.js'
                },
          'pre-commit': 'test',
        },
            post_merge: {
                options: {
                    template: 'hooks/post-merge.js'
                },
                'post-merge': 'build:dev'
            }
      },
        watch: {
          javascripts: {
            files: './app/assets/javascripts/**/*.js',
            tasks: ['jshint', 'clean:javascripts', 'concat:js_main', 'concat:js_angular'],
          },
          stylesheets: {
            files: './app/assets/sass/**/*.sccs',
            tasks: ['scsslint', 'clean:stylesheets', 'compass:dev'],
          },
          images: {
            files: './app/assets/images-orig/**/*.{png,jpg,gif}',
            tasks: ['clean:images', 'cleanempty', 'imagemin'],
          },
          images_svg: {
            files: './app/assets/images-orig/**/*.svg',
            tasks: ['clean:images_svg', 'cleanempty', 'copy'],
          },
        },
    });

    // // Plugin loading
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-scss-lint');
    grunt.loadNpmTasks('grunt-contrib-compass');
  /* ... */
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-cleanempty');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-githooks');

    grunt.registerTask('test', ['jshint', 'scsslint']);
    grunt.registerTask('build:dist', ['clean', 'cleanempty', 'copy', 'concat', 'compass:dist', 'uglify', 'imagemin']);
    grunt.registerTask('build:dev', ['clean', 'cleanempty', 'copy', 'concat', 'compass:dev', 'imagemin']);
    grunt.registerTask('default', ['githooks', 'test', /* ... */ 'build:dev']);
};
