(function(imageproc) {
    "use strict";

    /*
     * Apply blur to the input data
     */
    imageproc.blur = function(inputData, outputData, kernelSize) {
        console.log("Applying blur...");

        // You are given a 3x3 kernel but you need to create a proper kernel
        // using the given kernel size
        switch(kernelSize){
            case 3:
                var kernel = [ [1, 1, 1], 
                               [1, 1, 1], 
                               [1, 1, 1] ];
                break;
            case 5:
                var kernel = [ [1, 1, 1, 1, 1], 
                               [1, 1, 1, 1, 1], 
                               [1, 1, 1, 1, 1], 
                               [1, 1, 1, 1, 1],
                               [1, 1, 1, 1, 1]];
                break;
            case 7:
                var kernel = [ [1, 1, 1, 1, 1, 1, 1], 
                               [1, 1, 1, 1, 1, 1, 1], 
                               [1, 1, 1, 1, 1, 1, 1], 
                               [1, 1, 1, 1, 1, 1, 1], 
                               [1, 1, 1, 1, 1, 1, 1], 
                               [1, 1, 1, 1, 1, 1, 1], 
                               [1, 1, 1, 1, 1, 1, 1]];
                break;
            case 9:
                var kernel = [ [1, 1, 1, 1, 1, 1, 1, 1, 1], 
                               [1, 1, 1, 1, 1, 1, 1, 1, 1], 
                               [1, 1, 1, 1, 1, 1, 1, 1, 1], 
                               [1, 1, 1, 1, 1, 1, 1, 1, 1], 
                               [1, 1, 1, 1, 1, 1, 1, 1, 1], 
                               [1, 1, 1, 1, 1, 1, 1, 1, 1], 
                               [1, 1, 1, 1, 1, 1, 1, 1, 1],
                               [1, 1, 1, 1, 1, 1, 1, 1, 1],
                               [1, 1, 1, 1, 1, 1, 1, 1, 1]];
                break;

        }
        var divisor = kernelSize**2;
        /**
         * TODO: You need to extend the blur effect to include different
         * kernel sizes and then apply the kernel to the entire image
         */

        // Apply the kernel to the whole image
        for (var y = 0; y < inputData.height; y++) {
            for (var x = 0; x < inputData.width; x++) {
                // Use imageproc.getPixel() to get the pixel values
                // over the kernel
                var rValue = 0, gValue = 0, bValue = 0, aValue = 0;
                for(var j = -parseInt(kernelSize/2); j <= parseInt(kernelSize/2); j++){
                    for(var i = -parseInt(kernelSize/2); i <= parseInt(kernelSize/2); i++){
                        rValue += imageproc.getPixel(inputData, x+i, y+j).r;
                        gValue += imageproc.getPixel(inputData, x+i, y+j).g;
                        bValue += imageproc.getPixel(inputData, x+i, y+j).b;
                    }
                }
                rValue /= divisor; gValue /= divisor; bValue /= divisor;
                // Then set the blurred result to the output data
                
                var i = (x + y * outputData.width) * 4;
                outputData.data[i]     = rValue;
                outputData.data[i + 1] = gValue;
                outputData.data[i + 2] = bValue;
            }
        }
    } 

}(window.imageproc = window.imageproc || {}));
