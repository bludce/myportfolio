var gulp       = require('gulp'), // Подключаем Gulp
    sass         = require('gulp-sass'), //Подключаем Sass пакет,
    browserSync  = require('browser-sync'), // Подключаем Browser Sync
    concat       = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
    uglify       = require('gulp-uglify'), // Подключаем gulp-uglifyjs (для сжатия JS)
    cssnano      = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
    rename       = require('gulp-rename'), // Подключаем библиотеку для переименования файлов
    del          = require('del'), // Подключаем библиотеку для удаления файлов и папок
    imagemin     = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
    pngquant     = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
    cache        = require('gulp-cache'), // Подключаем библиотеку кеширования
    autoprefixer = require('gulp-autoprefixer');// Подключаем библиотеку для автоматического добавления префиксов
    spritesmith = require('gulp.spritesmith');//Подключаем библиотеку для объединения иконок в спрайты

/*Создаем спрайты*/
gulp.task('sprite', function () {
  var spriteData = gulp.src('app/img/sprites/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: '_sprite.sass'
    
  }));
    spriteData.img.pipe(gulp.dest('./app/img/')); 
    spriteData.css.pipe(gulp.dest('./app/sass/')); 
});

/*Конвертируем sass в css*/
gulp.task('sass', function(){ 
    return gulp.src('app/sass/**/*.sass') 
        .pipe(sass()) 
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) 
        .pipe(gulp.dest('app/css')) 
        .pipe(browserSync.reload({stream: true})) 
});

/*Переносим библиотеки из bower в app*/
gulp.task('scripts', function() {
    return gulp.src([ 
        'bower_components/jquery/dist/jquery.min.js', 
        ])
        .pipe(gulp.dest('app/js')); 
});

/*Создаем сервер с livereload*/
gulp.task('browser-sync', function() { 
    browserSync({ 
        server: { 
            baseDir: 'app' 
        },
        notify: false 
    });
});

/*Смотрим изменение файлов html,sass,js*/
gulp.task('watch', ['browser-sync' , 'scripts'], function() {
    gulp.watch('app/sass/**/*.sass', ['sass']); 
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);   
});


/*=========Таски сборки в продакшн===========*/

gulp.task('clear', function (callback) {
    return cache.clearAll();
})

gulp.task('clean', function() {
    return del.sync('dist'); 
});

gulp.task('script:build', function() {
    return gulp.src('app/js/main.js')
        .pipe(uglify())
        .pipe(rename({suffix: '.min'})) 
        .pipe(gulp.dest('dist/js'))
});

gulp.task('libs:build' ,function() {
     return gulp.src('app/js/libs/*.js')
        .pipe(gulp.dest('dist/js/libs'))
});

gulp.task('img:build', function() {
    return gulp.src('app/img/*') 
        .pipe(cache(imagemin({ 
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))/**/)
        .pipe(gulp.dest('dist/img')); 
});

gulp.task('css:build', function() {
    return gulp.src('app/css/*.css')
        .pipe(cssnano())
        .pipe(rename({suffix: '.min'})) 
        .pipe(gulp.dest('dist/css'))
});

gulp.task('html:build' ,function() {
    return gulp.src('app/*.html')
        .pipe(gulp.dest('dist'))
});

gulp.task('fonts:build', function() {
    return gulp.src('app/fonts/*')
        .pipe(gulp.dest('dist/fonts'))
});

gulp.task('build', ['clear','clean', 'img:build', 'script:build','libs:build', 'css:build', 'html:build', 'fonts:build'], function() {
    var htaccess = gulp.src('app/.htaccess') // Переносим HTML в продакшен
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['watch']);