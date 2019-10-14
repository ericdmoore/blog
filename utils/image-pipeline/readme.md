look at : 

- https://www.npmjs.com/package/potrace
- https://www.npmjs.com/package/imagetracerjs
- https://github.com/fogleman/primitive#golang
- https://github.com/esimov/triangle#golang
- [Size Reduciton + Color Reduciton + a Blur all via OpenCV](https://docs.opencv.org/3.0-beta/doc/py_tutorials/py_ml/py_kmeans/py_kmeans_opencv/py_kmeans_opencv.html) then would be no need for client processing.


"npm watch:images"
    - read in config file
        - dest_paths
        - re-sizes
            - [sizes]
            - filesuffix = ""
            - formats: webp | jpg | png | gif ( video for animated-primative-version ?? )
            - compression quality per format
        - placeholders
            - [types]
                - outline | triangles | rectangles | (type is a tuple of package . function) + extra config
            - file_prefix = ""
            - file_suffix = ""
    - add cache to avoid needless re-processing



[folder example]
input: /images/imagename.jpg
outputs:
/images/lqip/[type1]/imagename.svg
/images/lqip/poster/imagename.svg
/images/lqip/poster/imagename-t150.svg
/images/lqip/[type2]/imagename.svg
/images/lqip/impression/imagename.svg
/images/lqip/impression/imagename-tri-150.svg


impression:
    entry point:
    path prefix:
    default config:


How would you use those?
    template usage?
        
        <Picutre 
            src=""
            // immeidately returns placeholder srcset <img placeolder>
            oncreate={ fetchFullImgSrcset }>
        <Picture>


        var potrace = require('potrace'),
            fs = require('fs');

        var params = {
            background: '#49ffd2',
            color: 'blue',
            threshold: 120
        };

        potrace.trace('./path/to/image.png', function(err, svg) {
        if (err) throw err;
        fs.writeFileSync('./output.svg', svg);
        });

