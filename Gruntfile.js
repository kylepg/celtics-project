module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    //
    // ─── WATCH ──────────────────────────────────────────────────────
    //

    watch: {
      html: {
        files: ['src/project-name.html', 'src/html/*.html'],
        tasks: ['import', 'notify:done']
      },
      js: {
        files: ['src/js/*.js'],
        tasks: ['browserify', 'uglify', 'exec:uploadJS', 'notify:done']
      },
      css: {
        files: ['src/scss/*.scss', 'src/scss/mixins/*.scss'],
        tasks: ['sass', 'exec:uploadCSS', 'notify:done']
      }
    },

    //
    // ─── SASS (COMPILE + MINIFY) ─────────────────────────────────────
    //

    sass: {
      dist: {
        options: {
          gruntLogHeader: false,
          sourcemap: 'auto'
        },
        files: {
          'dist/css/project-name.css': 'src/scss/project-name.scss'
        }
      },
      min: {
        options: {
          gruntLogHeader: false,
          sourcemap: 'none',
          style: 'compressed'
        },
        files: {
          'dist/css/project-name.min.css': 'src/scss/project-name.scss'
        }
      }
    },

    //
    // ─── MINIFY JAVASCRIPT ───────────────────────────────────────────
    //

    uglify: {
      dist: {
        files: {
          'dist/js/project-name.min.js': 'dist/js/project-name.js'
        }
      }
    },

    //
    // ─── IMPORT ──────────────────────────────────────────────────────
    //

    import: {
      options: {
        gruntLogHeader: false
      },
      dist: {
        files: {
          'dist/js/project-name.js': 'src/js/project-name.js',
          'dist/index.html': 'src/project-name.html'
        }
      }
    },

    //
    // ─── BROWSERIFY (BABEL) ────────────────────────────────────────────
    //

    browserify: {
      dev: {
        src: ['src/js/project-name.js'],
        dest: 'dist/js/project-name.js',
        options: {
          browserifyOptions: { debug: true },
          transform: [['babelify', { presets: ['env'] }]]
        }
      }
    },

    //
    // ─── NOTIFY (OPTIONAL) ───────────────────────────────────────────────
    //

    notify: {
      done: {
        options: {
          gruntLogHeader: false,
          title: 'Grunt - project-name',
          message: 'DONE!'
        }
      }
    },

    //
    // ─── EXECUTE (UPLOAD VIA CYBERDUCK FTP) ───────────────────────────────
    //

    exec: {
      uploadCSS: {
        command:
          "duck --upload ftp://cdnftp.turner.com/css/project-name.css /Users/kyle/Dropbox/CELTICS/projects/project-name/dist/css/project-name.css -existing overwrite --username 'nbcelticsa' --password '***' -y"
      },
      uploadJS: {
        command:
          "duck --upload ftp://cdnftp.turner.com/js/project-name.js /Users/kyle/Dropbox/CELTICS/projects/project-name/dist/js/project-name.js -existing overwrite --username 'nbcelticsa' --password '***' -y"
      }
    },

    //
    // ─── CACHE BUST ──────────────────────────────────────────────────
    //

    cachebreaker: {
      dev: {
        options: {
          match: ['standings.js', 'standings.css']
        },
        files: {
          src: ['dist/index.html']
        }
      }
    }
  });

  //
  // ─── LOAD TASKS ────────────────────────────────────────────────────────────────────
  //

  require('grunt-log-headers')(grunt);
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-import');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-cache-breaker');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.registerTask('default', ['watch']);
};
