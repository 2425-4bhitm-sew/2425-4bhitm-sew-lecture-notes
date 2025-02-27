package at.htl.cars.entity;

import org.assertj.core.data.Offset;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;


import static org.assertj.core.api.Assertions.assertThat;

class CarTest {

    @Test
    void convert44MilesPerGallonToliterPer100km() {
        double mpg = 44;

        var lPer100km = Car.convertMilesPerGallonToLiterPer100Km(mpg);
        System.out.println(Car.MPG_TO_LITERPERKM_CONVERSION_FACTOR);
        System.out.printf("%.1f l/100km", lPer100km);

        assertThat(lPer100km)
                .isCloseTo(5.3, Offset.offset(0.09));
    }

    @Test
    void convert17MilesPerGallonToliterPer100km() {
        double mpg = 17;

        var lPer100km = Car.convertMilesPerGallonToLiterPer100Km(mpg);
        System.out.println(Car.MPG_TO_LITERPERKM_CONVERSION_FACTOR);
        System.out.printf("%.1f l/100km", lPer100km);

        assertThat(lPer100km)
                .isCloseTo(13.8, Offset.offset(0.09));
    }

    @ParameterizedTest
    @CsvSource({"17,13.8", "44,5.3", "88,2.7"})
    void convertMilesPerGallonToLiterPer100Km(double mpg, double expected) {
        var lPer100km = Car.convertMilesPerGallonToLiterPer100Km(mpg);
        System.out.printf("%n%3.3f%n",Car.MPG_TO_LITERPERKM_CONVERSION_FACTOR);
        System.out.printf("%.3f l/100km", lPer100km);

        assertThat(lPer100km)
                .isCloseTo(expected, Offset.offset(0.09));
    }

}