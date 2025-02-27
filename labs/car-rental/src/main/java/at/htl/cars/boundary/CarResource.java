package at.htl.cars.boundary;

import at.htl.cars.control.CarRepository;
import at.htl.cars.entity.Car;
import at.htl.cars.boundary.dto.CarImperialDto;
import io.quarkus.logging.Log;
import io.quarkus.panache.common.Sort;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("car")
@Produces(MediaType.APPLICATION_JSON)
public class CarResource {

    @Inject
    CarRepository carRepository;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response listAll() {
        return Response.ok(
                carRepository.listAll()
        ).build();
    }

    @Transactional
    @POST
    @Path("imperial")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response importCars(List<CarImperialDto> cars) {
        Log.info(cars);

        cars.stream()
                .peek(car -> Log.info(car.name()))
                .forEach(car -> carRepository.persist(
                        new Car(
                                car.name(),
                                Car.convertMilesPerGallonToLiterPer100Km(car.milesPerGallon()),
                                car.yyyymmdd().getYear(),
                                car.origin())
                        )
                );



        return Response.ok().build();
    }

    @GET
    @Path("name-origin")
    @Produces(MediaType.APPLICATION_JSON)
    public Response queryParam(
            @QueryParam("name") String name,
            @QueryParam("origin") String origin
    ) {
        List<Car> cars = carRepository.list("name = ?1 and origin = ?2", name, origin);
        return Response.ok(cars).build();
    }

    @GET
    @Path("{origin}")
    public Response findByOrigin(
            @PathParam("origin") String origin
    ) {
        Log.infof("Looking for cars in (the) %s", origin);

        List<Car> cars = carRepository.list("origin = ?1", origin);


        return Response.ok(cars).build();
    }

}
