
var gulp = require('gulp');
var rename = require('gulp-rename');//文件重命名
var spritesmith=require('gulp.spritesmith');

var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var pxtorem = require('postcss-pxtorem');
var postcssSass = require("postcss-sass");
var atImport = require("postcss-import");
var simpleVars=require('postcss-simple-vars');
var mixins=require('postcss-mixins');
var extend=require('postcss-simple-extend');
var nested=require('postcss-nested');
var calc = require("postcss-calc")
var precss=require('precss')

gulp.task('postcss', function () {
	var plugins = [
		atImport(),
		mixins(),
		simpleVars(),
		calc(),
		extend(),
		nested(),
		precss(),
		pxtorem({
			rootValue: 75,
			unitPrecision: 5,
			propList: ['*', '!font*'],
			selectorBlackList: [],
			replace: true,
			mediaQuery: false,
			minPixelValue: 0		
		}),
		autoprefixer({browsers: ["iOS >= 7","Android >= 4",'last 4 versions']})
		
    ];
  return gulp.src('./styles/*.postcss')
  		.pipe(postcss(plugins))
		.pipe(rename({extname: ".css"}))
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
	// 监听postcss是否变动
	gulp.watch('./styles/**/*.postcss',['postcss']);
	// 监听原生css是否变动，重新复制到对应目录
	gulp.watch('./styles/**/*.css',['copy']);
})
gulp.task("default",['watch'])