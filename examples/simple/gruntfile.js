module.exports = function(grunt) {

    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            development: {
                options: {
                    paths: ["assets/css"],
                    cleancss: true
                },
                files: {
                    "style.css": "style.less"
                }
            }
        }
    });

    grunt.registerTask('default', []);
};