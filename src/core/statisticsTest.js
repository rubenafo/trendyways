test ("Max value in a simple serie", function () {
   var serie = [0,6,2,7,8,9]
   deepEqual (max (serie), 9, "Correct max value of a sample serie");
});

test ("Min value in a simple serie", function () {
   var serie = [0,6,2,7,8,9]
   deepEqual (min (serie), 0, "Correct min value of a sample serie");
});

test ("Mean of zero is zero", function () {
   var serie = [];
   deepEqual (mean(serie), 0, "Mean of zeor values is zero");
});

test ("Mean of a simple serie", function () {
   var serie = [2,6,5,7,10,9,12,5]
   deepEqual (mean(serie), 7, "Mean value of a sample serie");
});

// Values from the wikipedia for an example of Standard Deviation:
// http://en.wikipedia.org/wiki/Standard_deviation 
test ("Standard deviation of a serie", function () {
   var serie = [2,4,4,4,5,5,7,9]
   deepEqual (sd(serie), 2, "Correct standard deviation of a sample serie");
});


