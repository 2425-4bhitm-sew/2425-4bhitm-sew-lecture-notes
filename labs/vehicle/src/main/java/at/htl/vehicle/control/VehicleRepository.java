package at.htl.vehicle.control;

import at.htl.vehicle.entity.Vehicle;
import io.quarkus.logging.Log;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;

import java.util.Collections;
import java.util.List;

@ApplicationScoped
public class VehicleRepository {

    @Inject
    EntityManager em;



    public void save(Vehicle vehicle) {
        em.persist(vehicle);
    }

    public void save(String brand, String model) {
        save(new Vehicle(brand, model));
    }

    public Vehicle findById(long id) {
        return em.find(Vehicle.class, id);
    }

    public List<Vehicle> getAll() {
        return em.createNamedQuery("Vehicle.findAll", Vehicle.class).getResultList();
    }

    public int deleteAll() {
        int deletedRows = em.createNamedQuery("Vehicle.deleteAll").executeUpdate();
        return deletedRows;
    }



    public boolean isEmpty() {

        TypedQuery<Vehicle> query = em.createNamedQuery("Vehicle.findAll", Vehicle.class);
        List<Vehicle> vehicles = query.getResultList();

        return vehicles.isEmpty();
    }

    @Transactional
    void createData() {
        Log.info("Create Example Data ...");
        save(new Vehicle("Opel", "Kadett"));
        save(new Vehicle("Opel", "Kapitän"));
        save(new Vehicle("VW", "Käfer"));
        save(new Vehicle("Ford", "Mustang"));
    }



}
