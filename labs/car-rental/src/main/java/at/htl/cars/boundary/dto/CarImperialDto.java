package at.htl.cars.boundary.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;

public record CarImperialDto (
        @JsonProperty("Name")
        String name,
        @JsonProperty("Miles_per_Gallon")
        double milesPerGallon,
//        @JsonProperty("Cylinders")
//        int cylinders,
//        @JsonProperty("Displacement")
//        int displacementInCid,          // Hubraum in ci (cubic inches)
//        @JsonProperty("Horsepower")
//        int horsepower,            // Pferdestärken
//        @JsonProperty("Weight_in_lbs")
//        int weightInLbs,
//        @JsonProperty("Acceleration")
//        int accelerationTo100Kmph, // Beschleunigung auf 100 km/h
        @JsonProperty("Year")
        LocalDate yyyymmdd,                  // Baujahr
        @JsonProperty("Origin")
        String origin                // Herkunft: zB USA, Japan, ...
){}
