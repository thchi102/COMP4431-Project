(function(imageproc) {
    "use strict";

    /*
     * Apply Kuwahara filter to the input data
     */
    imageproc.kuwahara = function(inputData, outputData, type, size) {

        /*
         * TODO: You need to extend the kuwahara function to include different
         * sizes of the filter
         *
         * You need to clearly understand the following code to make
         * appropriate changes
         */

        /*
         * An internal function to find the regional stat centred at (x, y)
         */
        function regionStat(x, y) {
            // Find the mean colour and brightness
            var meanR = 0, meanG = 0, meanB = 0;
            var meanValue = 0;
            for (var j = -parseInt(size/4); j <= parseInt(size/4); j++) {
                for (var i = -parseInt(size/4); i <= parseInt(size/4); i++) {
                    var pixel = imageproc.getPixel(inputData, x + i, y + j);

                    // For the mean colour
                    meanR += pixel.r;
                    meanG += pixel.g;
                    meanB += pixel.b;

                    // For the mean brightness
                    meanValue += (pixel.r + pixel.g + pixel.b) / 3;
                }
            }
            meanR /= Math.ceil(size/2)**2;
            meanG /= Math.ceil(size/2)**2;
            meanB /= Math.ceil(size/2)**2;
            meanValue /= Math.ceil(size/2)**2;

            // Find the variance
            var variance = 0;
            for (var j = -parseInt(size/4); j <= parseInt(size/4); j++) {
                for (var i = -parseInt(size/4); i <= parseInt(size/4); i++) {
                    var pixel = imageproc.getPixel(inputData, x + i, y + j);
                    var value = (pixel.r + pixel.g + pixel.b) / 3;

                    variance += Math.pow(value - meanValue, 2);
                }
            }
            variance /= Math.ceil(size/2)**2;

            // Return the mean and variance as an object
            return {
                mean: {r: meanR, g: meanG, b: meanB},
                variance: variance
            };
        }
        switch(type){

        case "original":
            console.log("Applying original Kuwahara filter...");
            for (var y = 0; y < inputData.height; y++) {
                for (var x = 0; x < inputData.width; x++) {
                    // Find the statistics of the four sub-regions
                    var a = parseInt(size/4);
                    var regionA = regionStat(x - a, y - a, inputData);
                    var regionB = regionStat(x + a, y - a, inputData);
                    var regionC = regionStat(x - a, y + a, inputData);
                    var regionD = regionStat(x + a, y + a, inputData);

                    // Get the minimum variance value
                    var minV = Math.min(regionA.variance, regionB.variance,
                                        regionC.variance, regionD.variance);

                    var i = (x + y * inputData.width) * 4;

                    // Put the mean colour of the region with the minimum
                    // variance in the pixel
                    switch (minV) {
                    case regionA.variance:
                        outputData.data[i]     = regionA.mean.r;
                        outputData.data[i + 1] = regionA.mean.g;
                        outputData.data[i + 2] = regionA.mean.b;
                        break;
                    case regionB.variance:
                        outputData.data[i]     = regionB.mean.r;
                        outputData.data[i + 1] = regionB.mean.g;
                        outputData.data[i + 2] = regionB.mean.b;
                        break;
                    case regionC.variance:
                        outputData.data[i]     = regionC.mean.r;
                        outputData.data[i + 1] = regionC.mean.g;
                        outputData.data[i + 2] = regionC.mean.b;
                        break;
                    case regionD.variance:
                        outputData.data[i]     = regionD.mean.r;
                        outputData.data[i + 1] = regionD.mean.g;
                        outputData.data[i + 2] = regionD.mean.b;
                    }
                }
            }
            break;

        case "Gaussian-circular":
            console.log("Applying Gaussian-circular Kuwahara filter...");

            //TODO: implement Gaussian circular filter

            break;
        case "Tomita-Tsuji":
            console.log("Applying Tomita-Tsuji Kuwahara filter...");
                        
            //TODO: implement Tomita-tsuji filter

            break;
        case "Nagao-Matsuyama":
            console.log("Applying Nagao-Matsuyama Kuwahara filter...");
                        
            //TODO: implement Nagao-Matsuyama filter

            break;
        case "Adaptive":
            console.log("Applying Adaptive Kuwahara filter...");
                        
            //TODO: implement Adaptive filter

            break;
    }
    }
 
}(window.imageproc = window.imageproc || {}));
