package at.htl.vehicle.control;

import at.htl.vehicle.entity.Vehicle;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;

@QuarkusTest
public class EntityManagerTest {

    @Inject
    EntityManager em;

    @Test
    @Transactional
    void testPersist() {
        var opel = new Vehicle("Opel", "Kadett B");
        em.persist(opel);
        opel.setModel("Kadett C");
    }
}
