package at.htl.vehicle.boundary;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
class VehicleResourceTest {

    @Test
    void givenXXX_whenYYY_thenZZZ() {
        given()
                .when().get("/vehicles")
                .then()
                .statusCode(200)
                .body(is(
                        """
                                [{"id":1,"brand":"VW","model":"Käfer 1400","pricePerDay":30.0},{"id":2,"brand":"Opel","model":"Blitz","pricePerDay":50.0}]"""
                ));
    }
}