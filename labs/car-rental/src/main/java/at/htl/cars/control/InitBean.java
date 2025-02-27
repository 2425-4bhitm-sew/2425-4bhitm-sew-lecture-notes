package at.htl.cars.control;

import at.htl.cars.entity.Booking;
import at.htl.cars.entity.Car;
import io.quarkus.runtime.Startup;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.time.LocalDate;
import java.time.Month;

@ApplicationScoped
public class InitBean {

    @Inject
    BookingRepository bookingRepository;

    @Startup
    @Transactional
    void initBean() {
        Car car = new Car("Opel Kapitän",13,1959,"Europe");

        Booking booking = new Booking(
                "Susi",
                LocalDate.of(2024, Month.SEPTEMBER, 10),
                LocalDate.of(2024, Month.SEPTEMBER, 14),
                car
        );
        bookingRepository.persist(booking);
    }

}
