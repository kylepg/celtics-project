module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    //
    //─── WATCH ──────────────────────────────────────────────────────
    // Defines tasks to be run when files are changed.

    watch: {
      html: {
        files: ['src/project-name.html', 'src/html/*.html'],
        tasks: ['import', 'cachebreaker', 'notify:done'],
      },
      js: {
        files: ['src/js/*.js'],
        tasks: ['browserify', 'cachebreaker', 'notify:done'],
      },
      css: {
        files: ['src/scss/*.scss', 'src/scss/mixins/*.scss'],
        tasks: ['sass', 'cachebreaker', 'notify:done'],
      },
    },

    //
    //─── SASS ───────────────────────────────────────────────────────
    // Compiles and minifies SCSS files. Also generates a sourcemap.

    sass: {
      min: {
        options: {
          style: 'compressed',
        },
        files: {
          'dist/css/project-name.min.css': 'src/scss/main.scss',
        },
      },
    },

    //
    //─── IMPORT ──────────────────────────────────────────────────────
    // Copies the HTML file to dist folder. Can also pull in external
    // CSS & JS file contents using '@import path/to/file'.

    import: {
      dist: {
        files: {
          'dist/index.html': 'src/project-name.html',
        },
      },
    },

    //
    //─── BROWSERIFY ────────────────────────────────────────────
    // Allows use of node's require method to bundle node-modules.
    // Also compiles ES6+ to ES5 using Babel.

    browserify: {
      dev: {
        src: ['src/js/main.js'],
        dest: 'dist/js/project-name.min.js',
        options: {
          browserifyOptions: { debug: true },
          transform: [['babelify', { presets: ['env'] }], 'uglifyify'],
        },
      },
    },

    //
    //─── NOTIFY ───────────────────────────────────────────
    // Notifies you when all tasks have completed.

    notify: {
      done: {
        options: {
          gruntLogHeader: false,
          title: 'GRUNT - project-name',
          message: 'Build complete ✅',
        },
      },
    },

    //
    //─── CACHE BREAKER ──────────────────────────────────────────────────
    // Cache busts external CSS & JS by appending a timestamp query string
    // to html tag links.

    cachebreaker: {
      dev: {
        options: {
          match: ['project-name.js', 'project-name.css'],
        },
        files: {
          src: ['dist/index.html'],
        },
      },
    },
  });

  //
  //─── LOAD TASKS ────────────────────────────────────────────────────────────────────
  // Load grunt tasks from node_modules.
  require('grunt-log-headers')(grunt);
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-import');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-cache-breaker');
  grunt.loadNpmTasks('grunt-notify');
  grunt.registerTask('default', ['watch']);
};
