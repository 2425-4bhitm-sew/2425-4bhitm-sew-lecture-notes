package at.htl.vehicle.control;

import at.htl.vehicle.entity.Vehicle;
import io.quarkus.logging.Log;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.inject.Singleton;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;

import java.util.Collections;
import java.util.LinkedList;
import java.util.List;

@ApplicationScoped
public class VehicleRepository {

    @Inject
    EntityManager em;


    public boolean isEmpty() {

        TypedQuery<Vehicle> query = em.createNamedQuery("Vehicle.findAll", Vehicle.class);
        List<Vehicle> vehicles = query.getResultList();

        return vehicles.isEmpty();
    }

    public void persist(Vehicle vehicle) {
        em.persist(vehicle);
    }

//    public List<Vehicle> getAll() {
//        return Collections.unmodifiableList(vehicles);
//        //return List.copyOf(vehicles);
//    }

    public int deleteAll() {
        int deletedRows = em.createNamedQuery("Vehicle.deleteAll").executeUpdate();
        return deletedRows;
    }



    @Transactional
    void createData() {
        Log.info("Create Example Data ...");
        persist(new Vehicle("Opel", "Kadett"));
        persist(new Vehicle("Opel", "Kapitän"));
        persist(new Vehicle("VW", "Käfer"));
        persist(new Vehicle("Ford", "Mustang"));
    }



}
