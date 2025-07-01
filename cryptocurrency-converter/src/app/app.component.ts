import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './component/header/header.component';
import { ConverterComponent } from './component/converter/converter.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, ConverterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'cryptocurrency-converter';
}
