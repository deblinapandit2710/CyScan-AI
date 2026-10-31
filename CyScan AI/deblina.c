#include <stdio.h>

void main() {

   int arr1[50], n, i, j = 0, Irg, Irg2nd;
   printf("Find the second largest element in an array :\n");
   printf("Input the size of the array: ");
   scanf("%d", &n);
   
   
   printf("Input %d elements in the array :\n", n); 
   for (i = 0; i < n; i++) {

}

     printf("element - %d: ", i); 
     scanf("%d", &arr1[i]);

// Find the location of the largest element in the array

Irg = 0;

for (i = 0; i < n; i++) { 
    if (Irg < arr1[i]) { 
        Irg = arr1[i];

         j= i;

    }

}

// Ignore the largest element and find the second largest element in the array
 Irg2nd = 0;
for (i = 0; i <n; i++) {

   if (i == j) {
       i++; // Ignore the largest element
       i--;

    } else {

       if (Irg2nd < arr1[i]) {

           Irg2nd = arr1[i];
        }
    }
}

// Display the second largest element 
printf("The Second largest element in the array is: %d \n\n", Irg2nd);
}