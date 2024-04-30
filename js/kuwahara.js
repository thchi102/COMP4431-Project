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
        function getRegionData(x, y){
            var data = [];
            for (var j = -2; j <= 2; j++) {
                for (var i = -2; i <= 2; i++) {
                    var pixel = imageproc.getPixel(inputData, x + i, y + j);
                    data.push(pixel);
                }
            }

            return data;
        }

        function calcMean(array){
            var meanR = 0, meanG = 0, meanB = 0;
            var meanValue = 0;
            for(var i = 0; i < array.length; i++){
                meanR += array[i].r;
                meanG += array[i].g;
                meanB += array[i].b;

                meanValue += (array[i].r + array[i].g + array[i].b)/3;
            }
            meanR /= array.length;
            meanG /= array.length;
            meanB /= array.length;
            meanValue /= array.length;

            return {mean: {r: meanR, g: meanG, b: meanB, total: meanValue}}
        }

        function calcVariance(array, mean){
            var variance = 0;
            for(var i = 0; i < array.length; i++){
                var value = (array[i].r + array[i].g + array[i].b)/3;
                variance += Math.pow(value - mean, 2);
            }
            variance /= array.length;

            return variance;
        }

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
            for (var y = 0; y < inputData.height; y++) {
                for (var x = 0; x < inputData.width; x++) {
                    // Find the statistics of the four sub-regions
                    var a = parseInt(size/4);
                    var regionA = regionStat(x - a, y - a, inputData);
                    var regionB = regionStat(x + a, y - a, inputData);
                    var regionC = regionStat(x - a, y + a, inputData);
                    var regionD = regionStat(x + a, y + a, inputData);
                    var regionE = regionStat(x, y, inputData);

                    // Get the minimum variance value
                    var minV = Math.min(regionA.variance, regionB.variance,
                                        regionC.variance, regionD.variance,
                                        regionE.variance);

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
                    case regionE.variance:
                        outputData.data[i]     = regionE.mean.r;
                        outputData.data[i + 1] = regionE.mean.g;
                        outputData.data[i + 2] = regionE.mean.b;
                    }
                }
            }

            break;
        case "Nagao-Matsuyama":
            console.log("Applying Nagao-Matsuyama Kuwahara filter...");
                        
            //TODO: implement Nagao-Matsuyama filter
            for (var y = 0; y < inputData.height; y++) {
                for (var x = 0; x < inputData.width; x++) {
                    var data = getRegionData(x, y, inputData);
                    /*
                    [ 0,  1,  2,  3,  4,
                      5,  6,  7,  8,  9,
                     10, 11, 12, 13, 14,
                     15, 16, 17, 18, 19,
                     20, 21, 22, 23, 24]
                    */
                    var regionA = [data[12], data[6], data[7], data[8], data[11], data[13], data[16], data[17], data[18]];
                    var regionB = [data[12], data[5], data[6], data[10], data[11], data[15], data[16]];
                    var regionC = [data[12], data[6], data[7], data[11], data[0], data[1], data[5]];
                    var regionD = [data[12], data[1], data[2], data[3], data[6], data[7], data[8]];
                    var regionE = [data[12], data[7], data[8], data[13], data[3], data[4], data[9]];
                    var regionF = [data[12], data[8], data[9], data[13], data[14], data[18], data[19]];
                    var regionG = [data[12], data[13], data[18], data[17], data[19], data[24], data[23]];
                    var regionH = [data[12], data[16], data[17], data[18], data[21], data[22], data[23]];
                    var regionI = [data[12], data[11], data[16], data[17], data[15], data[20], data[21]];

                    var regionAMean = calcMean(regionA);
                    var regionBMean = calcMean(regionB);
                    var regionCMean = calcMean(regionC);
                    var regionDMean = calcMean(regionD);
                    var regionEMean = calcMean(regionE);
                    var regionFMean = calcMean(regionF);
                    var regionGMean = calcMean(regionG);
                    var regionHMean = calcMean(regionH);
                    var regionIMean = calcMean(regionI);

                    var regionAVar = calcVariance(regionA, regionAMean.mean.total);
                    var regionBVar = calcVariance(regionB, regionBMean.mean.total);
                    var regionCVar = calcVariance(regionC, regionCMean.mean.total);
                    var regionDVar = calcVariance(regionD, regionDMean.mean.total);
                    var regionEVar = calcVariance(regionE, regionEMean.mean.total);
                    var regionFVar = calcVariance(regionF, regionFMean.mean.total);
                    var regionGVar = calcVariance(regionG, regionGMean.mean.total);
                    var regionHVar = calcVariance(regionH, regionHMean.mean.total);
                    var regionIVar = calcVariance(regionI, regionIMean.mean.total);
                    
                    var i = (x + y * inputData.width) * 4;
                    
                    var minV = Math.min(regionAVar, regionBVar, regionCVar, regionDVar, regionEVar, regionFVar, regionGVar, regionHVar, regionIVar);
                    switch (minV) {
                        case regionAVar:
                            outputData.data[i]     = regionAMean.mean.r;
                            outputData.data[i + 1] = regionAMean.mean.g;
                            outputData.data[i + 2] = regionAMean.mean.b;
                            break;
                        case regionBVar:
                            outputData.data[i]     = regionBMean.mean.r;
                            outputData.data[i + 1] = regionBMean.mean.g;
                            outputData.data[i + 2] = regionBMean.mean.b;
                            break;
                        case regionCVar:
                            outputData.data[i]     = regionCMean.mean.r;
                            outputData.data[i + 1] = regionCMean.mean.g;
                            outputData.data[i + 2] = regionCMean.mean.b;
                            break;
                        case regionDVar:
                            outputData.data[i]     = regionDMean.mean.r;
                            outputData.data[i + 1] = regionDMean.mean.g;
                            outputData.data[i + 2] = regionDMean.mean.b;
                            break;
                        case regionEVar:
                            outputData.data[i]     = regionEMean.mean.r;
                            outputData.data[i + 1] = regionEMean.mean.g;
                            outputData.data[i + 2] = regionEMean.mean.b;
                            break;
                        case regionFVar:
                            outputData.data[i]     = regionFMean.mean.r;
                            outputData.data[i + 1] = regionFMean.mean.g;
                            outputData.data[i + 2] = regionFMean.mean.b;
                            break;
                        case regionGVar:
                            outputData.data[i]     = regionGMean.mean.r;
                            outputData.data[i + 1] = regionGMean.mean.g;
                            outputData.data[i + 2] = regionGMean.mean.b;
                            break;
                        case regionHVar:
                            outputData.data[i]     = regionHMean.mean.r;
                            outputData.data[i + 1] = regionHMean.mean.g;
                            outputData.data[i + 2] = regionHMean.mean.b;
                            break;
                        case regionIVar:
                            outputData.data[i]     = regionIMean.mean.r;
                            outputData.data[i + 1] = regionIMean.mean.g;
                            outputData.data[i + 2] = regionIMean.mean.b;
                            break;
                        }
                }
            }
            break;
        case "Adaptive":
            console.log("Applying Adaptive Kuwahara filter...");
                        
            //TODO: implement Adaptive filter

            break;
    }
    }
 
}(window.imageproc = window.imageproc || {}));
