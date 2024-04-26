(function(imageproc) {
    "use strict";

    /*
     * Apply sobel edge to the input data
     */
    imageproc.sobelEdge = function(inputData, outputData, threshold) {
        console.log("Applying Sobel edge detection...");

        /* Initialize the two edge kernel Gx and Gy */
        var Gx = [
            [-1, 0, 1],
            [-2, 0, 2],
            [-1, 0, 1]
        ];
        var Gy = [
            [-1,-2,-1],
            [ 0, 0, 0],
            [ 1, 2, 1]
        ];

        /**
         * TODO: You need to write the code to apply
         * the two edge kernels appropriately
         */
        
        for (var y = 0; y < inputData.height; y++) {
            for (var x = 0; x < inputData.width; x++) {
                var rxValue = 0, gxValue = 0, bxValue = 0;
                var ryValue = 0, gyValue = 0, byValue = 0;
                for(var j = -1; j <= 1; j++){
                    for(var i = -1; i <= 1; i++){
                        var pixel = imageproc.getPixel(inputData, x + i, y + j);
                        
                        rxValue += pixel.r * Gx[1+i][1+j];
                        gxValue += pixel.g * Gx[1+i][1+j];
                        bxValue += pixel.b * Gx[1+i][1+j];

                        ryValue += pixel.r * Gy[1+i][1+j];
                        gyValue += pixel.g * Gy[1+i][1+j];
                        byValue += pixel.b * Gy[1+i][1+j];
                    }
                }

                var i = (x + y * outputData.width) * 4;
                outputData.data[i]     = Math.hypot(rxValue, ryValue)>threshold?255:0;
                outputData.data[i + 1] = Math.hypot(gxValue, gyValue)>threshold?255:0;
                outputData.data[i + 2] = Math.hypot(bxValue, byValue)>threshold?255:0;
            }
        }
    } 

}(window.imageproc = window.imageproc || {}));
