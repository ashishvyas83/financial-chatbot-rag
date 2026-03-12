import { Component, computed, inject, signal } from '@angular/core';
import { Message } from './messages.model';
import { ChatService } from '../src/app/services/chat.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  imports: [CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  standalone: true
})
export class ChatComponent {

  messages = signal<Message[]> ([]);
  userInput = signal<string>("");
  isLoading = signal<boolean>(false);
  isOnline = signal<boolean>(true);

  chatService = inject(ChatService);

  messageCount = computed(() => this.messages().length)

  constructor(){
    // Add welcome message when app loads
    this.addBotMessage(
      "Hello! I'm Surabhi, your FirstBank virtual assistant. " +
      "How can I help you today? You can ask me about our " +
      "accounts, credit cards, loans, or any banking services!"
    );
  }

  onInputChange(value:string){
    this.userInput.set(value);
  }

  sendMessage(){
    const question = this.userInput().trim();

    if(!question || this.isLoading() )
      return

    this.addUserMessage(question);
    this.userInput.set("")

    this.isLoading.set(true);

    this.chatService.sendMessage(question).subscribe({
      next : (response) => {
        this.isLoading.set(false);
        this.addBotMessage(response.answer);
        this.removeLoadingMessage();
      },
      error : () => {
        this.isLoading.set(false);
        this.addBotMessage("I'm sorry, I'm having trouble connecting. " +
          "Please call 1-800-FIRST-BK for assistance.");
        this.removeLoadingMessage();
      }
    })
  }


// Handle Enter key press
  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  private addUserMessage(userData:string){
    this.messages.update(msgs => [
      ...msgs, {
        id: Date.now(),
        sender: 'user',
        text: userData,
        timestamp: new Date()
      }
    ]);
  }


  private addBotMessage(botData:string){
    this.messages.update(msgs => [
      ...msgs, {
        id: Date.now(),
        sender: 'bot',
        text: botData,
        timestamp: new Date()
      }
    ]);
  }

   private removeLoadingMessage() {
    this.messages.update(msgs => 
      msgs.filter(m => m.id !== -1)  // remove loading message
    );
  }

  // Quick question buttons
  askQuickQuestion(question: string) {
    this.userInput.set(question);
    this.sendMessage();
  }
}
