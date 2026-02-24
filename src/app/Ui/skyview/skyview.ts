import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

interface ApodItem {
  title: string;
  explanation: string;
  url: string;
  hdurl: string;
  date: string;
  media_type: string;
  copyright: string;
}

@Component({
  selector: 'app-skyview',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './skyview.html',
  styleUrls: ['./skyview.css']
})
export class Skyview implements OnInit {
  apodList: ApodItem[] = [];
  selected: ApodItem | null = null;
  loading = false;
  error: string | null = null;
  searchDate = '';
  activeTab = 'gallery';

  private readonly apiKey = 'Q0qhonILt2rqhxIax5ZHVbR6Jk5NpACkb69qYRY9';
  private readonly baseUrl = 'https://api.nasa.gov/planetary/apod';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchGallery();
  }

  fetchGallery(): void {
    this.loading = true;
    this.error = null;
    this.activeTab = 'gallery';
    this.selected = null;

    this.http.get<ApodItem[]>(
      `${this.baseUrl}?api_key=${this.apiKey}&count=12`
    ).pipe(
      catchError(() => {
        this.error = 'Failed to load gallery. Please check your API key.';
        this.loading = false;
        return of([]);
      })
    ).subscribe(data => {
      this.apodList = data.filter(item => item.media_type === 'image');
      this.loading = false;
    });
  }

  fetchByDate(): void {
    if (!this.searchDate) return;
    this.loading = true;
    this.error = null;
    this.activeTab = 'date';

    this.http.get<ApodItem>(
      `${this.baseUrl}?api_key=${this.apiKey}&date=${this.searchDate}`
    ).pipe(
      catchError(() => {
        this.error = 'No image found for this date. Try another date.';
        this.loading = false;
        return of(null);
      })
    ).subscribe(data => {
      if (data) {
        this.selected = data;
        this.apodList = [];
      }
      this.loading = false;
    });
  }

  fetchToday(): void {
    this.loading = true;
    this.error = null;
    this.activeTab = 'today';
    this.apodList = [];

    this.http.get<ApodItem>(
      `${this.baseUrl}?api_key=${this.apiKey}`
    ).pipe(
      catchError(() => {
        this.error = 'Failed to load today\'s image.';
        this.loading = false;
        return of(null);
      })
    ).subscribe(data => {
      if (data) this.selected = data;
      this.loading = false;
    });
  }

  openCard(item: ApodItem): void {
    this.selected = item;
  }

  closeCard(): void {
    this.selected = null;
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });
  }
}