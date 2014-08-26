/*jshint node:true */

module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      files: ['*.js', 'lib/*.js'],
    },
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('default', ['jshint']);
};
