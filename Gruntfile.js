// GruntFile : Kévin Thenard

var jsMain = ['js/front/main.js'];
var jsSrc = ['js/front/jquery/jquery.i18n.js',
             'js/front/lang/dic_fr_FR.js',
             'js/front/jquery/jquery.validate.js',
             'js/front/owl.carousel.js',

            'js/front/bootstrap/util.js',
            'js/front/bootstrap/alert.js',
            'js/front/bootstrap/button.js',
            'js/front/bootstrap/carousel.js',
            'js/front/bootstrap/collapse.js',
            'js/front/bootstrap/dropdown.js',
            'js/front/bootstrap/modal.js',
            'js/front/bootstrap/scrollspy.js',
            'js/front/bootstrap/tab.js',
            'js/front/bootstrap/tooltip.js',
            'js/front/bootstrap/popover.js',

            'js/front/mustache.js',

             'js/front/is.js',
             'js/front/jquery/jquery.cookies.js',
             'js/front/jquery/jquery.query-object.js',
             'js/front/jquery/jrange.js',
             'js/front/functions.js',
             'js/front/validation.js',
             'js/front/main.js'];

var jsDest = 'js/built.js';
var jsDestMin = 'js/built.min.js';
var cssDestMin = ['css/screen.min.css']

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        postcss: {
          options: {
            map: false,
            processors: [
              require('autoprefixer-core')({
                browsers: ['last 3 version']
              })
            ]
          },
          dist: {
            src: 'css/screen.css',
            dest: 'css/screen.min.css'
          }
        },
        imagemin: {
            png: {
                options: {
                  optimizationLevel: 7
                },
                files: [
                  {
                    expand: true,
                    cwd: '_img/',
                    src: ['**/*.png'],
                    dest: 'images/',
                    ext: '.png'
                  }
                ]
            },
            jpg: {
              options: {
                progressive: true
              },
              files: [
                {
                  expand: true,
                  cwd: '_img/',
                  src: ['**/*.jpg'],
                  dest: 'images/',
                  ext: '.jpg'
                }
              ]
            },
            gif: {
              options: {
                interlaced: true
              },
              files: [{
                  expand: true,
                  cwd: '_img/',
                  src: ['**/*.gif'],
                  dest: 'images/',
                  ext: '.gif'
              }]
            }
        },
        compass: {
            main: {
                options: {
                    outputStyle: 'compressed',
                    sassDir: 'scss',
                    cssDir: 'css'
                }
            }
        },
        jshint: {
            all: jsMain,
            sub: true
        },
        concat: {
            options: {
                separator: ';',
            },
            main: {
                src: jsSrc,
                dest: jsDest
            }
        },
        uglify: {
          options: {
            separator: ';'
          },
          main: {
            src: jsDest,
            dest: jsDestMin
          }
        },
        watch: {
            imagemin: {
                files: [ '_img/**/*.png', '_img/**/*.jpg', '_img/**/*.gif'],
                tasks: ['imagemin']
            },
            compass: {
                files: ['scss/*.scss', 'scss/bootstrap/*.scss', 'scss/mixin/*.scss', 'scss/custom/*.scss'],
                tasks: ['compass']
            },
            postcss: {
                files: ['css/screen.css'],
                tasks: ['postcss']
            },
            jshint: {
                files: jsSrc,
                tasks: ['jshint'],
                sub: true
            },
            concat: {
                files: jsSrc,
                tasks: ['concat', 'uglify']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-postcss');
    //grunt.loadNpmTasks('grunt-w3c-validation');

    grunt.registerTask('default', ['watch']);
};
