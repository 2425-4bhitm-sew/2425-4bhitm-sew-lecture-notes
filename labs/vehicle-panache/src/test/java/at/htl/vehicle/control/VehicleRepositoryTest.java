package at.htl.vehicle.control;

import at.htl.vehicle.entity.Vehicle;
import io.agroal.api.AgroalDataSource;
import io.quarkus.logging.Log;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.assertj.db.output.Outputs;
import org.assertj.db.type.AssertDbConnection;
import org.assertj.db.type.AssertDbConnectionFactory;
import org.assertj.db.type.Table;
import org.junit.jupiter.api.*;

import static org.assertj.db.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.assertj.db.output.Outputs.output;


@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@QuarkusTest
class VehicleRepositoryTest {

    @Inject
    VehicleRepository vehicleRepository;

    @Inject
    AgroalDataSource ds;

    @Transactional
    @BeforeEach
    void setUp() {
        int deletedRows = vehicleRepository.deleteAll();
        Log.infof("%d rows deleted ...", deletedRows);
    }

    //    @Order(1000)
//    @Test
//    void givenAVehicleRepository_whenEmpty_thenReturnTrue() {
//        // arrange
//
//        // act
//        boolean actualIsEmpty = vehicleRepository.isEmpty();
//
//        // assert
//        assertThat(actualIsEmpty).isTrue();
//    }

//    @Transactional
//    @Order(1010)
//    @Test
//    void givenAVehicleRepository_whenAddingAVehicle_thenVehicleIsPersistedInRepo() {
//
//        // arrange
//        Vehicle kadett = new Vehicle("Opel", "Kadett");
//
//        // act
//        vehicleRepository.persist(kadett);
//
//        // assert
//        assertThat(vehicleRepository.isEmpty()).isFalse();
//
//    }

//    @Order(1030)
//    @Test
//    void givenAVehicleRepository_whenAddingAVehicleTwice_thenVehicleIsNotPersistedInRepo() {
//
//        // arrange
//        vehicleRepository.deleteAll();
//        Vehicle blitz = new Vehicle("Opel", "Blitz");
//        Vehicle blitz2 = new Vehicle("Opel", "Blitz");
//
//        // act
//        vehicleRepository.persist(blitz);
//        vehicleRepository.persist(blitz2);
//
//        // assert
//        System.out.println(vehicleRepository.getAll());
//        assertThat(vehicleRepository.isEmpty()).isFalse();
//        assertThat(vehicleRepository.getAll()).hasSize(1);
//
//    }

    @Test
    @Transactional
    @Order(1040)
    void givenEmptyDb_whenInvokingCreateData_thenFourRecordsArePersisted() {

        vehicleRepository.createData();

        AssertDbConnection conn = AssertDbConnectionFactory.of(ds).create();
        Table vehicleTable = conn.table("V_VEHICLE").build();

        Outputs.output(vehicleTable).toConsole();

        assertThat(vehicleTable).hasNumberOfRows(4);
    }
}