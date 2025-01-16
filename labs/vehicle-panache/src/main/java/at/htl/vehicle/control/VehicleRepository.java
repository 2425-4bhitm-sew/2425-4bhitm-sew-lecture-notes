package at.htl.vehicle.control;

import at.htl.vehicle.entity.Vehicle;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import io.quarkus.logging.Log;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;

import java.util.Collections;
import java.util.List;

@ApplicationScoped
public class VehicleRepository implements PanacheRepository<Vehicle> {






//    @Transactional
//    void createData() {
//        Log.info("Create Example Data ...");
//        save(new Vehicle("Opel", "Kadett"));
//        save(new Vehicle("Opel", "Kapitän"));
//        save(new Vehicle("VW", "Käfer"));
//        save(new Vehicle("Ford", "Mustang"));
//    }



}
