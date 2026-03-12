import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';


export interface ChatRequest{
  question: string;
  session_id: string;
}

export interface ChatResponse{
  answer: string;
  session_id: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000';

  constructor() { }


  sendMessage(question:string):Observable<ChatResponse>{

    const request:ChatRequest = {
      question: question,
      session_id:"default"
    }
    return this.http.post<ChatResponse>(`${this.apiUrl}/api/chat`, request);
  }


  healthCheck():Observable<any>{
    return this.http.get(`${this.apiUrl}/api/health`)
  }
}
