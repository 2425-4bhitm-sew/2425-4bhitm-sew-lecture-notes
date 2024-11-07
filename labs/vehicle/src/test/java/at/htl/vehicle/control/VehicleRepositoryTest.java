package at.htl.vehicle.control;

import at.htl.vehicle.entity.Vehicle;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@QuarkusTest
class VehicleRepositoryTest {

    @Inject
    VehicleRepository vehicleRepository;

    @Order(1000)
    @Test
    void givenAVehicleRepository_whenEmpty_thenReturnTrue() {
        // arrange

        // act
        boolean actualIsEmpty = vehicleRepository.isEmpty();

        // assert
        assertThat(actualIsEmpty).isTrue();
    }

    @Order(1010)
    @Test
    void givenAVehicleRepository_whenAddingAVehicle_thenVehicleIsPersistedInRepo() {

        // arrange
        Vehicle kadett = new Vehicle("Opel", "Kadett");

        // act
        vehicleRepository.persist(kadett);

        // assert
        assertThat(vehicleRepository.isEmpty()).isFalse();

    }

    @Order(1030)
    @Test
    void givenAVehicleRepository_whenAddingAVehicleTwice_thenVehicleIsNotPersistedInRepo() {

        // arrange
        vehicleRepository.deleteAll();
        Vehicle blitz = new Vehicle("Opel", "Blitz");
        Vehicle blitz2 = new Vehicle("Opel", "Blitz");

        // act
        vehicleRepository.persist(blitz);
        vehicleRepository.persist(blitz2);

        // assert
        System.out.println(vehicleRepository.getAll());
        assertThat(vehicleRepository.isEmpty()).isFalse();
        assertThat(vehicleRepository.getAll()).hasSize(1);


    }
}