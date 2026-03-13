import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatRequest {
  question: string;
  session_id: string;
}

export interface ChatResponse {
  answer: string;
  session_id: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000';

  // Generate unique session ID when service loads
  // Like JSESSIONID in Spring Boot!
  private sessionId = `session_${Date.now()}`;

  getSessionId(): string {
    return this.sessionId;
  }

  sendMessage(question: string): Observable<ChatResponse> {
    const request: ChatRequest = {
      question: question,
      session_id: this.sessionId    // ← use session ID!
    };
    return this.http.post<ChatResponse>(
      `${this.apiUrl}/api/chat`,
      request
    );
  }

  // Clear chat — call when user clicks "New Chat"
  clearChat(): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/api/chat/${this.sessionId}`
    );
  }

  // Start fresh session
  newSession(): void {
    this.sessionId = `session_${Date.now()}`;
  }

  healthCheck(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health`);
  }
}