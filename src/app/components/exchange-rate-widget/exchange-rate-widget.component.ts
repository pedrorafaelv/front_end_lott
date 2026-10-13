import { Component, OnInit } from '@angular/core';
import { ExchangeRateService } from '../../services/exchange-rate.service';

@Component({
  selector: 'app-exchange-rate-widget',
  standalone: true,
  imports: [],
  templateUrl: './exchange-rate-widget.component.html',
  styleUrl: './exchange-rate-widget.component.css'
})

export class ExchangeRateWidgetComponent implements OnInit {
  rate: number | null = null;
  loading = false;

  constructor(private exchangeService: ExchangeRateService) {}

  ngOnInit() {
    this.loadRate();
  }

  loadRate() {
    this.exchangeService.getLatestRate().subscribe({
      next: (data) => this.rate = data.rate,
      error: (err) => console.error('Error cargando tasa', err),
    });
  }

  refresh() {
    this.loading = true;
    this.exchangeService.refreshRate().subscribe({
      next: () => {
        this.loading = false;
        this.loadRate();
      },
      error: () => this.loading = false,
    });
  }
}