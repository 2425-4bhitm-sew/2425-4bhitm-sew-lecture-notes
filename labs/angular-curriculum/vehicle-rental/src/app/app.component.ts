import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { VehicleComponent } from './vehicle/vehicle.component';
import { DUMMY_VEHICLES } from './dummy-vehicles';
import { RentalsComponent } from './rentals/rentals.component';

@Component({
  selector: 'app-root',
  imports: [
    HeaderComponent,
    VehicleComponent,
    RentalsComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  title = 'vehicle-rental';
  vehicles = DUMMY_VEHICLES
  selectedVehicleId = 'v1'

  get selectedVehicle() {
    return this.vehicles.find(vehicle => vehicle.id === this.selectedVehicleId)!
  }

  onSelectVehicle(id: string) {
    this.selectedVehicleId = id;
  }
}
