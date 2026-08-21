import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Conversation {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  online: boolean;
  messages: Message[];
}

interface Message {
  text: string;
  time: string;
  sent: boolean;
}

@Component({
  selector: 'app-message',
  standalone: true,
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
  imports: [CommonModule]

})
export class MessageComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  conversations: Conversation[] = [];
  activeConversationId: number | null = null;
  activeConversation: Conversation | null = null;
  newMessage: string = '';
  
  // Datos de ejemplo para las conversaciones
  sampleConversations: Conversation[] = [
    {
      id: 1,
      name: 'Soporte Técnico',
      avatar: 'assets/avatars/support.png',
      lastMessage: 'Hemos resuelto el problema con tu transacción',
      time: '10:30',
      unreadCount: 2,
      online: true,
      messages: [
        { text: 'Hola, tengo un problema con mi última transacción', time: '09:15', sent: true },
        { text: 'Hola, cuéntame más sobre el problema que experimentas', time: '09:20', sent: false },
        { text: 'La transferencia que hice ayer aún no aparece en el destino', time: '09:22', sent: true },
        { text: 'Vamos a verificar el estado de tu transacción. Por favor compárteme el ID de la operación', time: '09:30', sent: false },
        { text: 'El ID es TX-789456123', time: '09:32', sent: true },
        { text: 'Gracias. Hemos identificado el problema y lo estamos resolviendo. Te avisaremos cuando esté solucionado.', time: '10:00', sent: false },
        { text: 'Perfecto, gracias por la ayuda', time: '10:05', sent: true },
        { text: 'Hemos resuelto el problema con tu transacción. Ya deberías ver el dinero en tu cuenta de destino.', time: '10:30', sent: false }
      ]
    },
    {
      id: 2,
      name: 'Ana García',
      avatar: 'assets/avatars/ana.png',
      lastMessage: '¿Podrías enviarme los detalles de la cuenta?',
      time: 'Ayer',
      unreadCount: 0,
      online: false,
      messages: [
        { text: 'Hola, necesito transferirte dinero para el pago del alquiler', time: '15:45', sent: false },
        { text: 'Claro, te paso mis datos bancarios', time: '15:50', sent: true },
        { text: '¿Podrías enviarme los detalles de la cuenta?', time: '16:20', sent: false }
      ]
    },
    {
      id: 3,
      name: 'Carlos Mendoza',
      avatar: 'assets/avatars/carlos.png',
      lastMessage: 'Te envié la solicitud de pago',
      time: '12/05',
      unreadCount: 1,
      online: true,
      messages: [
        { text: 'Hola, ¿me puedes pagar lo que te debo?', time: '11:30', sent: false },
        { text: 'Sí, claro. ¿Cuánto era?', time: '11:35', sent: true },
        { text: 'Eran $75 por la cena del viernes', time: '11:40', sent: false },
        { text: 'Ah sí, ya mismo te lo envío', time: '11:42', sent: true },
        { text: 'Te envié la solicitud de pago', time: '11:45', sent: false }
      ]
    },
    {
      id: 4,
      name: 'Miguel Torres',
      avatar: 'assets/avatars/miguel.png',
      lastMessage: 'Gracias por la ayuda con la transferencia',
      time: '10/05',
      unreadCount: 0,
      online: false,
      messages: [
        { text: 'Hola, ¿cómo estás?', time: '14:20', sent: false },
        { text: 'Muy bien, ¿y tú?', time: '14:25', sent: true },
        { text: 'Bien también. Oye, necesito ayuda con una transferencia internacional', time: '14:26', sent: false },
        { text: 'Claro, dime en qué puedo ayudarte', time: '14:30', sent: true },
        { text: '¿Sabes qué comisiones aplican para enviar dinero a Europa?', time: '14:32', sent: false },
        { text: 'Sí, es un 1.5% con un mínimo de $5. Te recomiendo hacerlo entre martes y jueves que el tipo de cambio suele ser mejor', time: '14:40', sent: true },
        { text: 'Perfecto, muchas gracias por la información', time: '14:45', sent: false },
        { text: 'De nada, ¡para eso estamos!', time: '14:46', sent: true },
        { text: 'Gracias por la ayuda con la transferencia', time: '15:30', sent: false }
      ]
    }
  ];

  constructor() { }

  ngOnInit(): void {
    // Cargar conversaciones (en una app real, esto vendría de un servicio)
    this.conversations = this.sampleConversations;
    
    // Seleccionar la primera conversación por defecto si existe
    if (this.conversations.length > 0) {
      this.selectConversation(this.conversations[0].id);
    }
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  // Seleccionar una conversación
  selectConversation(conversationId: number): void {
    this.activeConversationId = conversationId;
    this.activeConversation = this.conversations.find(conv => conv.id === conversationId) || null;
    
    // Marcar mensajes como leídos al abrir la conversación
    if (this.activeConversation) {
      this.activeConversation.unreadCount = 0;
    }
    
    this.scrollToBottom();
  }

  // Enviar un mensaje
  sendMessage(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    
    if (!this.newMessage.trim() || !this.activeConversation) return;

    const currentTime = new Date();
    const timeString = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const newMsg: Message = {
      text: this.newMessage,
      time: timeString,
      sent: true
    };
    
    this.activeConversation.messages.push(newMsg);
    this.activeConversation.lastMessage = this.newMessage;
    this.activeConversation.time = 'Ahora';
    
    this.newMessage = '';
    
    // Simular respuesta después de un tiempo
    setTimeout(() => {
      if (this.activeConversation) {
        const responses = [
          "Gracias por tu mensaje. ¿En qué más puedo ayudarte?",
          "Entendido. Procesaremos tu solicitud shortly.",
          "He registrado tu consulta, te contactaremos pronto.",
          "¿Necesitas ayuda con algo más?",
          "Perfecto, ha sido un placer ayudarte."
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const responseMsg: Message = {
          text: randomResponse,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sent: false
        };
        
        this.activeConversation!.messages.push(responseMsg);
        this.activeConversation!.lastMessage = randomResponse;
        this.scrollToBottom();
      }
    }, 1000 + Math.random() * 2000);
  }

  // Iniciar una nueva conversación
  startNewConversation(): void {
    // En una aplicación real, esto abriría un modal para seleccionar un contacto
    // Por ahora, simplemente seleccionamos una conversación existente aleatoria
    const randomIndex = Math.floor(Math.random() * this.conversations.length);
    this.selectConversation(this.conversations[randomIndex].id);
    
    // Mostrar mensaje de demo
    setTimeout(() => {
      if (this.activeConversation) {
        this.newMessage = "Hola, me gustaría consultar sobre...";
        this.sendMessage();
      }
    }, 300);
  }

  // Desplazar el contenedor de mensajes al fondo
  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Error al desplazar el contenedor de mensajes:', err);
    }
  }

  // Formatear la fecha para mostrar de manera más legible
  formatDate(dateString: string): string {
    // Lógica para formatear fechas (simplificada para este ejemplo)
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const inputDate = new Date(dateString);
    
    if (inputDate.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (inputDate.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    } else {
      return dateString; // En una app real, formatearíamos esto mejor
    }
  }
}