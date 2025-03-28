package at.htl.vehicle.boundary;

import at.htl.vehicle.control.VehicleRepository;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("vehicles")
public class VehicleResource {

    @Inject
    VehicleRepository vehicleRepository;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response findAll() {
        return Response.ok(vehicleRepository.getAll()).build();
    }
}
