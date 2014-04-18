module.exports = function(grunt) {

    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            dev: {
                options: {
                    mangle: false,
                    compress: false,
                    beautify: true
                },
                files: {
                    'safe.js': [
                        'src/jquery.history.js',
                        'src/jquery.ajax_url.js',
                        'src/jquery.tappable.js',
                        'src/Page.js',
                        'src/SiteFramework.js'
                    ]
                }
            },
            prod: {
                options: {
                    mangle: true,
                    compress: true,
                    beautify: false
                },
                files: {
                    'safe.min.js': 'safe.js'
                }
            }
        }
    });

    grunt.registerTask('default', ["uglify"]);
};