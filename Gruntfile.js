module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    //
    // ─── SET VARIABLES ───────────────────────────────────────────────
    //

    projectPath: 'replacedirPath',
    ftpPathCSS: 'replaceftpPathCSS',
    ftpPathJS: 'replaceftpPathJS',
    ftpUser: 'replaceftpUser',
    ftpPw: 'replaceftpPw',

    //
    // ─── WATCH ──────────────────────────────────────────────────────
    // Defines tasks to be run when files are changed.

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
    // ─── SASS ───────────────────────────────────────────────────────
    // Compiles and minifies scss files. Also generates a sourcemap.

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
    // ─── UGLIFY ───────────────────────────────────────────
    // Minifies javascript.

    uglify: {
      dist: {
        files: {
          'dist/js/project-name.min.js': 'dist/js/project-name.js'
        }
      }
    },

    //
    // ─── IMPORT ──────────────────────────────────────────────────────
    // Copies the html file to dist folder. Can also pull in external
    // css/js file contents using '@import path/to/file'.

    import: {
      options: {
        gruntLogHeader: false
      },
      dist: {
        files: {
          'dist/index.html': 'src/project-name.html'
        }
      }
    },

    //
    // ─── BROWSERIFY ────────────────────────────────────────────
    // Allows use of node's require method to bundle node-modules.
    // Compiles ES6+ to ES5 using Babel.

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
    // ─── NOTIFY ───────────────────────────────────────────
    // Notifies you when all tasks have completed.

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
    // ─── EXECUTE ────────────────────────────────────────────────────
    // Executes command line script. Uploads css/js development
    // files to ftp via cyberduck.
    //
    // Homebrew installation: brew install duck

    exec: {
      uploadCSS: {
        command: "duck --upload <%= ftpPathCSS %> <%= projectPath %>/dist/css/project-name.css -existing overwrite --username '<%= ftpUser %>' --password '<%= ftpPw %>' -y"
      },
      uploadJS: {
        command: "duck --upload <%= ftpPathJS %> <%= projectPath %>/dist/js/project-name.js -existing overwrite --username '<%= ftpUser %>' --password '<%= ftpPw %>' -y"
      }
    },

    //
    // ─── CACHE BREAKER ──────────────────────────────────────────────────
    // Cache busts external css/js by appending a timestamp query string
    // to html tag links.

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
  // Load grunt tasks from node_modules.

  require('grunt-log-headers')(grunt); // OPTIONAL: Hides grunt task from logging in terminal.
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
