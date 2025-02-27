package at.htl.cars.entity;

import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.Month;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

class BookingTest {

    @Test
    void whenCreatingThenCar_thenToStringIsValid() {
        Car car = new Car("Opel Kapitän",13,1959,"Europe");


        Booking booking = new Booking(
                "Susi",
                LocalDate.of(2024, Month.SEPTEMBER, 10),
                LocalDate.of(2024, Month.SEPTEMBER, 14),
                car
        );

        System.out.println(booking);
        assertThat(booking.toString())
                .isEqualTo("Susi rents Opel Kapitän (1959) from 10.09.2024 to 14.09.2024");
    }
}