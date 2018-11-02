
var gulp = require('gulp');
var rename = require('gulp-rename');//文件重命名
var px2rem = require('gulp-px3rem');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var spritesmith=require('gulp.spritesmith');

gulp.task('sass', function () {
  return gulp.src('./styles/*.scss')
		.pipe(px2rem(
			{
				baseDpr: 2,             // base device pixel ratio (default: 2)
				threeVersion: false,    // whether to generate @1x, @2x and @3x version (default: false)
				remVersion: false,       // whether to generate rem version (default: true)
				remUnit: 75,            // rem unit value (default: 75)
				remPrecision: 6         // rem precision (default: 6)
			}
		))
		// .pipe(px2rem())
		.pipe(autoprefixer())
		.pipe(sass({outputStyle: 'expanded'}))
		// .pipe(sass({outputStyle: 'compressed'}))
		// .pipe(rename({extname: ".css"}))
    .pipe(gulp.dest('./css'));
});
gulp.task('sprite', function () {
	return gulp.src('./images/sprite/*.png')//需要合并的图片地址
			.pipe(spritesmith({
					imgName: 'sprite.png',//保存合并后图片的地址
					cssName: 'css/sprite.css',//保存合并后对于css样式的地址
					padding:5,//合并时两个图片的间距
					algorithm: 'binary-tree'//注释1
			}))
			.pipe(gulp.dest('dist/'));
});
gulp.task('copy',function(){ // 复制css文件
	gulp.src('./styles/**/*.css')
			.pipe(gulp.dest('./css'));
	gulp.src('./styles/fonts/*')
	.pipe(gulp.dest('./css/fonts'));
});
gulp.task('watch',function(){
	// 监听sass是否变动
	gulp.watch('./styles/**/*.scss',['sass']);
	// 监听原生css是否变动，重新复制到对应目录
	gulp.watch('./styles/**/*.css',['copy']);
})
gulp.task("default",['watch'])