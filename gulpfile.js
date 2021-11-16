const { series, src, dest, watch, parallel } = require("gulp");
const sass = require("gulp-sass");
const imagemin = require("gulp-imagemin");
const notify = require("gulp-notify");
const webp = require("gulp-webp");
const concat = require("gulp-concat");
//paths
const paths = {
  imagenes: "src/img/**/*",
  scss: "src/scss/**/*.scss",
  js: "src/js/**/*.js",
};

// Utilidades CSS
const autoprefixer = require("autoprefixer");
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");
const sourcemaps = require("gulp-sourcemaps");

// Utilidades JS
const terser = require("gulp-terser-js");
const rename = require("gulp-rename");

//funcion que compila SASS

function css() {
  return src(paths.scss)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()])) //son para escribir codigo de css de ultima generacion
    .pipe(sourcemaps.write(".")) //mantiene la referencia ya que el codigo css de ultima generacion es dificil de leer
    .pipe(dest("./build/css"));
}

function javascript() {
  return src(paths.js)
    .pipe(sourcemaps.init())
    .pipe(concat("bundle.js"))
    .pipe(terser())
    .pipe(sourcemaps.write("."))
    .pipe(rename({ suffix: ".min" }))
    .pipe(dest("./build/js"));
}

function imagenes() {
  return src(paths.imagenes) //el path son declaraciones de ruta para mayor facilidad  "src/img/**/*")
    .pipe(imagemin())
    .pipe(dest("./build/img"))
    .pipe(notify({ message: "Imagen Minificada" }));
}

function versionWebp() {
  return src("src/img/**/*")
    .pipe(webp())
    .pipe(dest("./build/img"))
    .pipe(notify({ message: "Versión webP lista" }));
}
function watchArchivos() {
  watch("src/**/*.scss", css); //*= es usado para buscar cualquier archivo en ese nivel ** = todos los archivos del nivel
  watch(paths.js, javascript);
}
exports.css = css;
exports.watchArchivos = watchArchivos;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.javascript = javascript;
exports.default = series(css, imagenes, javascript, versionWebp, watchArchivos); //correr dos tareas al tiempo en gulp
