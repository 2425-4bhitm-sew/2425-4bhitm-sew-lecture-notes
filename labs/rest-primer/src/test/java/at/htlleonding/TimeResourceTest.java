package at.htlleonding;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static io.restassured.RestAssured.given;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
class TimeResourceTest {

    @Test
    void test_TimeResource() {
        String response = given()
                .when().get("/api/time")
                .then()
                .statusCode(200)
                .extract().asString();
        assertThat(response).startsWith(String.valueOf(LocalDate.now().getYear()));
    }
}
