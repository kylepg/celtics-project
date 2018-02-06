module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    //
    //─── CONFIGURATION ─────────────────────────────────────────────
    //Set variables used in grunt-exec. These will be configured
    //automatically is using Alfred "project" workflow.

    directory: {
      rootPath: 'replace-directoryPath' /*path/to/directory */,
      jsPath: {
        development: 'replace-jsPath.js' /*/js/main.js */,
        production: 'replace-jsPath.min.js' /*/js/main.min.js */
      },
      cssPath: {
        development: 'replace-cssPath.css' /*/js/main.css */,
        production: 'replace-cssPath.min.css' /*/js/main.min.css */
      }
    },
    ftp: {
      rootPath: 'replace-ftpPath' /*ftp://ftpurl.com */,
      jsPath: {
        development: 'replace-ftpJsPath.js' /*/js/main.js */,
        production: 'replace-ftpJsPath.min.js' /*/js/main.min.js */
      },
      cssPath: {
        development: 'replace-ftpCssPath.css' /*/js/main.css */,
        production: 'replace-ftpCssPath.min.css' /*/js/main.min.css */
      },
      user: 'replace-ftpUser',
      pw: 'replace-ftpPw'
    },

    //
    //─── WATCH ──────────────────────────────────────────────────────
    //Defines tasks to be run when files are changed.

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
    //─── SASS ───────────────────────────────────────────────────────
    //Compiles and minifies SCSS files. Also generates a sourcemap.

    sass: {
      dist: {
        options: {
          gruntLogHeader: false,
          sourcemap: 'auto'
        },
        files: {
          'dist/css/project-name.css': 'src/scss/main.scss'
        }
      },
      min: {
        options: {
          gruntLogHeader: false,
          sourcemap: 'none',
          style: 'compressed'
        },
        files: {
          'dist/css/project-name.min.css': 'src/scss/main.scss'
        }
      }
    },

    //
    //─── UGLIFY ───────────────────────────────────────────
    //Minifies JS.

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
    //─── IMPORT ──────────────────────────────────────────────────────
    //Copies the HTML file to dist folder. Can also pull in external
    //CSS & JS file contents using '@import path/to/file'.

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
    //─── BROWSERIFY ────────────────────────────────────────────
    //Allows use of node's require method to bundle node-modules.
    //Compiles ES6+ to ES5 using Babel.

    browserify: {
      dev: {
        src: ['src/js/main.js'],
        dest: 'dist/js/project-name.js',
        options: {
          browserifyOptions: { debug: true },
          transform: [['babelify', { presets: ['env'] }]]
        }
      }
    },

    //
    //─── NOTIFY ───────────────────────────────────────────
    //Notifies you when all tasks have completed.

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
    //─── EXECUTE ────────────────────────────────────────────────────
    //Executes command line script. Uploads unminified CSS & JS +
    //CSS.map to ftp via cyberduck.
    //
    //**** REQUIRES CYBERDUCK CLI ****
    //Homebrew installation: brew install duck

    exec: {
      uploadCSS: {
        command:
          "duck --parallel --upload <%= ftp.rootPath %><%= ftp.cssPath.development %> <%= directory.rootPath %><%= directory.cssPath.development %> -existing overwrite --username '<%= ftp.user %>' --password '<%= ftp.pw %>' -y && duck --parallel --upload <%= ftp.rootPath %><%= ftp.cssPath.development %>.map <%= directory.rootPath %><%= directory.cssPath.development %>.map -existing overwrite --username '<%= ftp.user %>' --password '<%= ftp.pw %>' -y"
      },
      uploadJS: {
        command:
          "duck --parallel --upload <%= ftp.rootPath %><%= ftp.jsPath.development %> <%= directory.rootPath %><%= directory.jsPath.development %> -existing overwrite --username '<%= ftp.user %>' --password '<%= ftp.pw %>' -y"
      },
      publish: {
        command:
          "duck --parallel --upload <%= ftp.rootPath %><%= ftp.cssPath.production %> <%= directory.rootPath %><%= directory.cssPath.production %> -existing overwrite --username '<%= ftp.user %>' --password '<%= ftp.pw %>' -y && duck --parallel --upload <%= ftp.rootPath %><%= ftp.cssPath.production %>.map <%= directory.rootPath %><%= directory.cssPath.production %>.map -existing overwrite --username '<%= ftp.user %>' --password '<%= ftp.pw %>' -y && duck --parallel --upload <%= ftp.rootPath %><%= ftp.jsPath.production %> <%= directory.rootPath %><%= directory.jsPath.production %> -existing overwrite --username '<%= ftp.user %>' --password '<%= ftp.pw %>' -y"
      }
    },

    //
    //─── CACHE BREAKER ──────────────────────────────────────────────────
    //Cache busts external CSS & JS by appending a timestamp query string
    //to html tag links.

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
  //─── LOAD TASKS ────────────────────────────────────────────────────────────────────
  //Load grunt tasks from node_modules.

  require('grunt-log-headers')(grunt); //OPTIONAL: Hides grunt task from logging in terminal.
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
