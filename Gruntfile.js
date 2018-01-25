module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    //
    // ─── FTP CONFIGURATION ───────────────────────────────────────────
    // Set variables used in grunt-exec.

    directory: {
      rootPath: 'replace-directoryPath' /* path/to/directory */,
      jsPath: 'replace-jsPath' /* /js/main.js */,
      cssPath: 'replace-cssPath' /* /css/main.css */
    },
    ftp: {
      rootPath: 'replace-ftpPath' /* ftp://ftpurl.com */,
      jsPath: 'replace-ftpPathJs' /* /js/main.css */,
      cssPath: 'replace-ftpPathCss' /* /css/main.css */,
      ftpUser: 'replace-ftpUser',
      ftpPw: 'replace-ftpPw'
    },

    //
    // ─── WATCH ──────────────────────────────────────────────────────
    // Defines tasks to be run when files are changed.

    watch: {
      html: {
        files: ['src/project-name.html', 'src/html/*.html'],
        tasks: ['import', 'cachebreaker', 'notify:done']
      },
      js: {
        files: ['src/js/*.js'],
        tasks: ['browserify', 'uglify', 'cachebreaker', 'exec:uploadJS', 'notify:done']
      },
      css: {
        files: ['src/scss/*.scss', 'src/scss/mixins/*.scss'],
        tasks: ['sass', 'exec:uploadCSS', 'cachebreaker', 'notify:done']
      }
    },

    //
    // ─── SASS ───────────────────────────────────────────────────────
    // Compiles and minifies SCSS files. Also generates a sourcemap.

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
    // Minifies JS.

    uglify: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          'dist/js/project-name.min.js': 'dist/js/project-name.js'
        }
      }
    },

    //
    // ─── IMPORT ──────────────────────────────────────────────────────
    // Copies the HTML file to dist folder. Can also pull in external
    // CSS & JS file contents using '@import path/to/file'.

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
          title: 'GRUNT - project-name',
          message: 'Build complete ✅'
        }
      }
    },

    //
    // ─── EXECUTE ────────────────────────────────────────────────────
    // Executes command line script. Uploads unminified CSS & JS +
    // CSS.map & JS.map to ftp via cyberduck.
    //
    // **** REQUIRES CYBERDUCK CLI ****
    // Homebrew installation: brew install duck

    exec: {
      uploadCSS: {
        command:
          "duck --parallel --upload <%= ftp.rootPath %><%= ftp.cssPath %> <%= directory.rootPath %>/<%= directory.cssPath %> -existing overwrite --username '<%= ftpUser %>' --password '<%= ftpPw %>' -y && duck --parallel --upload <%= ftp.rootPath %><%= ftp.cssPath %>.map <%= directory.rootPath %>/<%= directory.cssPath %>.map -existing overwrite --username '<%= ftpUser %>' --password '<%= ftpPw %>' -y"
      },
      uploadJS: {
        command:
          "duck --parallel --upload <%= ftp.rootPath %><%= ftp.jsPath %> <%= directory.rootPath %>/<%= directory.jsPath %> -existing overwrite --username '<%= ftpUser %>' --password '<%= ftpPw %>' -y && duck --parallel --upload <%= ftp.rootPath %><%= ftp.jsPath %>.map <%= directory.rootPath %>/<%= directory.jsPath %>.map -existing overwrite --username '<%= ftpUser %>' --password '<%= ftpPw %>' -y"
      }
    },

    //
    // ─── CACHE BREAKER ──────────────────────────────────────────────────
    // Cache busts external CSS & JS by appending a timestamp query string
    // to html tag links.

    cachebreaker: {
      dev: {
        options: {
          match: ['project-name.js', 'project-name.css']
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
