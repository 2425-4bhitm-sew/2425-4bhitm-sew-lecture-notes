import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { VehicleComponent } from './vehicle/vehicle.component';

@Component({
  selector: 'app-root',
  imports: [
    HeaderComponent,
    VehicleComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'vehicle-rental';
}
