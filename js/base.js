(function(imageproc) {
    "use strict";

    /*
     * Apply negation to the input data
     */
    imageproc.negation = function(inputData, outputData) {
        console.log("Applying negation...");

        for (var i = 0; i < inputData.data.length; i += 4) {
            outputData.data[i]     = 255 - inputData.data[i];
            outputData.data[i + 1] = 255 - inputData.data[i + 1];
            outputData.data[i + 2] = 255 - inputData.data[i + 2];
        }
    }

    /*
     * Convert the input data to grayscale
     */
    imageproc.grayscale = function(inputData, outputData) {
        console.log("Applying grayscale...");

        /**
         * TODO: You need to create the grayscale operation here
         */

        for (var i = 0; i < inputData.data.length; i += 4) {
            // Find the grayscale value using simple averaging
            var value = (inputData.data[i]+inputData.data[i + 1]+inputData.data[i + 2])/3;
            // Change the RGB components to the resulting value

            outputData.data[i]     = value;
            outputData.data[i + 1] = value;
            outputData.data[i + 2] = value;
        }
    }

    /*
     * Applying brightness to the input data
     */
    imageproc.brightness = function(inputData, outputData, offset) {
        console.log("Applying brightness...");

        /**
         * TODO: You need to create the brightness operation here
         */

        for (var i = 0; i < inputData.data.length; i += 4) {
            // Change the RGB components by adding an offset

            outputData.data[i]     = inputData.data[i] + offset;
            outputData.data[i + 1] = inputData.data[i + 1] + offset;
            outputData.data[i + 2] = inputData.data[i + 2] + offset;

            // Handle clipping of the RGB components
            for(var j = 0; j < 3; j++){
                if(outputData.data[i+j] > 255)
                    outputData.data[i+j] = 255;
                if(outputData.data[i+j] < 0)
                    outputData.data[i+j] = 0;
            }
        }
    }

    /*
     * Applying contrast to the input data
     */
    imageproc.contrast = function(inputData, outputData, factor) {
        console.log("Applying contrast...");

        /**
         * TODO: You need to create the brightness operation here
         */

        for (var i = 0; i < inputData.data.length; i += 4) {
            // Change the RGB components by multiplying a factor

            outputData.data[i]     = inputData.data[i] * factor;
            outputData.data[i + 1] = inputData.data[i + 1] * factor;
            outputData.data[i + 2] = inputData.data[i + 2] * factor;

            // Handle clipping of the RGB components
            for(var j = 0; j < 3; j++){
                if(outputData.data[i+j] > 255)
                    outputData.data[i+j] = 255;
                if(outputData.data[i+j] < 0)
                    outputData.data[i+j] = 0;
            }
        }
    }

    /*
     * Make a bit mask based on the number of MSB required
     */
    function makeBitMask(bits) {
        var mask = 0;
        for (var i = 0; i < bits; i++) {
            mask >>= 1;
            mask |= 128;
        }
        return mask;
    }

    /*
     * Apply posterization to the input data
     */
    imageproc.posterization = function(inputData, outputData,
                                       redBits, greenBits, blueBits) {
        console.log("Applying posterization...");

        /**
         * TODO: You need to create the posterization operation here
         */

        // Create the red, green and blue masks
        // A function makeBitMask() is already given
        var red_mask = makeBitMask(redBits);
        var green_mask = makeBitMask(greenBits);
        var blue_mask = makeBitMask(blueBits);
        for (var i = 0; i < inputData.data.length; i += 4) {
            // Apply the bitmasks onto the RGB channels

            outputData.data[i]     = inputData.data[i] & red_mask;
            outputData.data[i + 1] = inputData.data[i + 1] & blue_mask;
            outputData.data[i + 2] = inputData.data[i + 2] & green_mask;
        }
    }

    /*
     * Apply threshold to the input data
     */
    imageproc.threshold = function(inputData, outputData, thresholdValue) {
        console.log("Applying thresholding...");

        /**
         * TODO: You need to create the thresholding operation here
         */

        for (var i = 0; i < inputData.data.length; i += 4) {
            // Find the grayscale value using simple averaging
            // You will apply thresholding on the grayscale value
            // Change the colour to black or white based on the given threshold
            var value = (inputData.data[i]+inputData.data[i + 1]+inputData.data[i + 2])/3;

            outputData.data[i]     = value<thresholdValue?0:255;
            outputData.data[i + 1] = value<thresholdValue?0:255;
            outputData.data[i + 2] = value<thresholdValue?0:255;
        }
    }

    /*
     * Build the histogram of the image for a channel
     */
    function buildHistogram(inputData, channel) {
        var histogram = [];
        for (var i = 0; i < 256; i++)
            histogram[i] = 0;

        /**
         * TODO: You need to build the histogram here
         */

        // Accumulate the histogram based on the input channel
        // The input channel can be:
        // "red"   - building a histogram for the red component
        // "green" - building a histogram for the green component
        // "blue"  - building a histogram for the blue component
        // "gray"  - building a histogram for the intensity
        //           (using simple averaging)
        for(var i = 0; i < inputData.data.length; i+=4){
            switch(channel){
                case "red":
                    for(var i = 0; i < inputData.data.length; i+=4){
                        var redValue = inputData.data[i];
                        histogram[parseInt(redValue)] += 1;
                    }
                    break;
                case "green":
                    for(var i = 0; i < inputData.data.length; i+=4){
                        var greenValue = inputData.data[i+1];
                        histogram[parseInt(greenValue)] += 1;
                    }
                    break;
                case "blue":
                    for(var i = 0; i < inputData.data.length; i+=4){
                        var blueValue = inputData.data[i+2];
                        histogram[parseInt(blueValue)] += 1;
                    }
                    break;
                case "gray":
                    for(var i = 0; i < inputData.data.length; i+=4){
                        var grayValue = (inputData.data[i]+inputData.data[i+1]+inputData.data[i+2])/3;
                        histogram[parseInt(grayValue)] += 1;
                    }
                    break;
            }

        return histogram;
        }
    }

    /*
     * Find the min and max of the histogram
     */
    function findMinMax(histogram, pixelsToIgnore) {
        var min = 0, max = 255;

        /**
         * TODO: You need to build the histogram here
         */
        
        // Find the minimum in the histogram with non-zero value by
        // ignoring the number of pixels given by pixelsToIgnore
        var histAccu = 0;
        for(var i = 0; i < 256; i++){
            histAccu += histogram[i];
            if(histAccu > pixelsToIgnore){
                min = i;
                break;
            }
        }
        // Find the maximum in the histogram with non-zero value by
        // ignoring the number of pixels given by pixelsToIgnore
        histAccu = 0;
        for(var i = 255; i > 0; i--){
            histAccu += histogram[i];
            if(histAccu > pixelsToIgnore){
                max = i;
                break;
            }
        }
        return {"min": min, "max": max};
    }

    /*
     * Apply automatic contrast to the input data
     */
    imageproc.autoContrast = function(inputData, outputData, type, percentage) {
        console.log("Applying automatic contrast...");

        // Find the number of pixels to ignore from the percentage
        var pixelsToIgnore = (inputData.data.length / 4) * percentage;

        var histogram, minMax;
        if (type == "gray") {
            // Build the grayscale histogram
            histogram = buildHistogram(inputData, "gray");
            
            // Find the minimum and maximum grayscale values with non-zero pixels
            minMax = findMinMax(histogram, pixelsToIgnore);  
            var min = minMax.min, max = minMax.max, range = max - min;

            /**
             * TODO: You need to apply the correct adjustment to each pixel
             */

            for (var i = 0; i < inputData.data.length; i += 4) {
                // Adjust each pixel based on the minimum and maximum values

                outputData.data[i]     = (inputData.data[i] - min)/range * 255;
                if(outputData.data[i] > 255)
                    outputData[i] = 255;
                else if(outputData.data[i] < 0)
                    outputData.data[i] = 0;

                outputData.data[i+1]     = (inputData.data[i+1] - min)/range * 255;
                if(outputData.data[i+1] > 255)
                    outputData[i+1] = 255;
                else if(outputData.data[i+1] < 0)
                    outputData.data[i+1] = 0;

                outputData.data[i+2]     = (inputData.data[i+2] - min)/range * 255;
                if(outputData.data[i+2] > 255)
                    outputData[i+2] = 255;
                else if(outputData.data[i+2] < 0)
                    outputData.data[i+2] = 0;
            }
        }
        else {

            /**
             * TODO: You need to apply the same procedure for each RGB channel
             *       based on what you have done for the grayscale version
             */
            var redHistogram = buildHistogram(inputData, "red");
            var greenHistogram = buildHistogram(inputData, "green");
            var blueHistogram = buildHistogram(inputData, "blue");

            var redMinMax  = findMinMax(redHistogram, pixelsToIgnore);
            var greenMinMax  = findMinMax(greenHistogram, pixelsToIgnore);
            var blueMinMax  = findMinMax(blueHistogram, pixelsToIgnore);

            var redMin = redMinMax.min, redMax = redMinMax.max, redRange = redMax - redMin;
            var greenMin = greenMinMax.min, greenMax = greenMinMax.max, greenRange = greenMax - greenMin;
            var blueMin = blueMinMax.min, blueMax = blueMinMax.max, blueRange = blueMax - blueMin;
            
            for (var i = 0; i < inputData.data.length; i += 4) {
                // Adjust each channel based on the histogram of each onegreenM
                outputData.data[i]     = (inputData.data[i] - redMin)/redRange * 255;
                if(outputData.data[i] > 255)
                    outputData[i] = 255;
                else if(outputData.data[i] < 0)
                    outputData.data[i] = 0;

                outputData.data[i+1]     = (inputData.data[i+1] - greenMin)/greenRange * 255;
                if(outputData.data[i+1] > 255)
                    outputData[i+1] = 255;
                else if(outputData.data[i+1] < 0)
                    outputData.data[i+1] = 0;

                outputData.data[i+2]     = (inputData.data[i+2] - blueMin)/blueRange * 255;
                if(outputData.data[i+2] > 255)
                    outputData[i+2] = 255;
                else if(outputData.data[i+2] < 0)
                    outputData.data[i+2] = 0;
            }
        }
    }

    imageproc.addPepperSalt = function(inputData, outputData, percentage){
        console.log("Adding pepper and salt noise...");
        for (var i = 0; i < inputData.data.length; i += 4) {
            // Adjust each pixel based on the minimum and maximum values
            var n = Math.random();
            if(n < percentage/2){
                outputData.data[i] = 0;
                outputData.data[i+1] = 0;
                outputData.data[i+2] = 0;
                outputData.data[i+3] = 255;
            }
            else if(n > (1-percentage/2)){
                outputData.data[i] = 255;
                outputData.data[i+1] = 255;
                outputData.data[i+2] = 255;
                outputData.data[i+3] = 255;
            }
            else{
                outputData.data[i] = inputData.data[i];
                outputData.data[i+1] = inputData.data[i+1];
                outputData.data[i+2] = inputData.data[i+2];
                outputData.data[i+3] = inputData.data[i+3];
            }
        }
    }

}(window.imageproc = window.imageproc || {}));
