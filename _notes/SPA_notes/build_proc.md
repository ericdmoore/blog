Add Image Optimization to the build process
    1. Maybe add a "watch" proc on `rawimages` pumps a variety of "preset" sizes into `source/images/**`
        in: <\file.jpg> out: [ <\file_1220w.jpg>, <\file_660w.jpg>, <\file_480w.jpg>, <\file__320w.jpg> ]
    2. Add an `image-min`step to the build process
        1. Add a file cache to remove already processed images from getting reminimized
        1. use `gulp-imagemin` or `gulp-sharp` or 
