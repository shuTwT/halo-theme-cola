const gulp = require("gulp");
const named = require("vinyl-named");
const webpack = require("webpack-stream");
const environments = require("gulp-environments");
const postcss = require("gulp-postcss");
const sass = require("gulp-sass")(require("sass"));
const browserSync = require("browser-sync");
const uglify=require("gulp-uglify");

browserSync.create();
const development = environments.development;
const production = environments.production;

// Our gulp's task will update the folder targetClassesDestination
const targetClassesDestination = "target/classes/";

const htmlSource = ["templates/**/*.html"];
/// CSS & scss tasks
const scssSources = [
    "src/styles/**/*.css",
   // "src/styles/**/*.scss",
];
const scssOutput="templates/assets/css";
function copyScssTask(done) {
    gulp
        .src(scssSources)
        .pipe(postcss())
        //.pipe(sass())
        .pipe(gulp.dest(scssOutput));
    done();
}

/// JS tasks
const jsSources = ["src/js/**/*.js"];

const jsOutput = "templates/assets/js";
function copyJsModern(done) {
    gulp
        .src(jsSources)
        .pipe(named())
        // .pipe(
        //     webpack({
        //         devtool: development() ? "inline-source-map" : false,
        //         mode: development() ? "development" : "production",
        //         module: {
        //             rules: [
        //                 {
        //                     test: /\.js$/,
        //                     exclude: /node_modules/,
        //                     loader: "babel-loader",
        //                     options: { presets: ["@babel/preset-env"] },
        //                 },
        //             ],
        //         },
        //     })
        // )
        .pipe(uglify())
        .pipe(gulp.dest(jsOutput));
    done();
}

function watching_files() {
    browserSync.init({
        //server:'./templates',
        proxy: "localhost:8090", // default location for spring boot
        injectChanges: false,
        files: [
            "templates",
        ],
    });
    gulp.watch(htmlSource, gulp.series(copyScssTask));
    gulp.watch(scssSources, gulp.series(copyScssTask));
    gulp.watch(jsSources, gulp.series(copyJsModern));
}
gulp.task("watch", watching_files);
gulp.task("default", gulp.series("watch"));
gulp.task("build", gulp.series(copyScssTask, copyJsModern));