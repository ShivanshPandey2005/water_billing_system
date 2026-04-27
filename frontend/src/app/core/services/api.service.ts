import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // Flats
  getFlats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/flats`);
  }

  getFlat(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/flats/${id}`);
  }

  createFlat(flatData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/flats`, flatData);
  }

  updateFlat(id: string, flatData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/flats/${id}`, flatData);
  }

  // Usage
  addUsage(usageData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/usage`, usageData);
  }

  getFlatUsage(flatId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/usage/${flatId}`);
  }

  getAllUsage(): Observable<any> {
    return this.http.get(`${this.baseUrl}/usage`);
  }

  // Billing
  calculateBill(billingData: { flatId: string; month: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/billing/calculate`, billingData);
  }

  getFlatBills(flatId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/billing/flat/${flatId}`);
  }

  payBill(billId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/billing/${billId}/pay`, {});
  }
}
