import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Loader2, MessageSquare, Minimize2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SYSTEM_CONTEXT = `Você é o assistente virtual da 3DKPRINT, uma empresa especializada em impressão 3D profissional localizada no Brasil. Seu nome é "3DK Assistente". Você atende 24 horas por dia, 7 dias por semana.

SOBRE A EMPRESA:
- A 3DKPRINT é especializada em impressão 3D, modelagem 3D, pintura de peças e manutenção de impressoras 3D.
- Oferecemos serviços de impressão 3D em diversos materiais: PLA, PETG, ABS, Nylon e Resina.
- Trabalhamos com prototipagem industrial, peças decorativas, colecionáveis, acessórios e peças de reposição para impressoras 3D.
- Aceitamos arquivos nos formatos STL, OBJ, 3MF e STEP.

PRODUTOS DISPONÍVEIS:
- Suporte de Headset Premium (R$ 89,90) - PETG
- Vaso Geométrico Moderno (R$ 59,90) - PLA
- Action Figure Personalizado (R$ 249,90) - Resina
- Organizador de Mesa (R$ 79,90) - PLA
- Luminária Low Poly (R$ 149,90) - PLA
- Protótipo Industrial (R$ 399,90) - ABS
- Porta-Celular Articulado (R$ 39,90) - PETG
- Estatueta Dragão (R$ 189,90) - Resina
- PEI Magnética Ender 3 (R$ 89,90) - PEI
- Hotend All Metal CR-10 (R$ 149,90) - Metal
- Kit Correias GT2 6mm (R$ 29,90)
- Motor Nema 17 42-40 (R$ 59,90)
- Bico Hardened Steel 0.4mm (R$ 39,90)

SERVIÇOS:
1. Impressão 3D: Envie seu arquivo 3D e receba um orçamento personalizado.
2. Modelagem 3D: Criamos modelos 3D a partir de fotos, desenhos ou descrições.
3. Pintura: Pintura profissional de peças impressas em 3D.
4. Manutenção: Reparo e manutenção de impressoras 3D.

CONTATO:
- WhatsApp: (43) 99174-1518
- Site: www.3dkprint.com.br
- Para orçamentos, acesse: www.3dkprint.com.br/orcamento

INSTRUÇÕES:
- Seja sempre educado, profissional e prestativo.
- Responda em português brasileiro.
- Se o cliente perguntar sobre preços de serviços personalizados, oriente a solicitar um orçamento pelo site ou WhatsApp.
- Se não souber a resposta, oriente o cliente a entrar em contato pelo WhatsApp.
- Mantenha respostas concisas e objetivas (máximo 3-4 frases quando possível).
- Use emojis com moderação para tornar a conversa mais amigável.`;

const INITIAL_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: 'Olá! 👋 Sou o assistente virtual da **3DKPRINT**. Estou aqui para ajudar com dúvidas sobre nossos produtos, serviços de impressão 3D, orçamentos e muito mais. Como posso ajudar você?',
  timestamp: new Date(),
};

// Respostas locais para perguntas frequentes (fallback sem API)
function getLocalResponse(question: string): string | null {
  const q = question.toLowerCase().trim();
  
  if (q.includes('horário') || q.includes('horario') || q.includes('funcionamento') || q.includes('aberto')) {
    return 'Nosso atendimento online funciona 24 horas! Para atendimento presencial ou via WhatsApp, entre em contato pelo (43) 99174-1518. 😊';
  }
  if (q.includes('preço') || q.includes('preco') || q.includes('quanto custa') || q.includes('valor')) {
    return 'Os preços variam conforme o produto e serviço. Temos produtos a partir de R$ 29,90. Para serviços personalizados como impressão 3D, modelagem ou pintura, solicite um orçamento em nosso site: www.3dkprint.com.br/orcamento ou pelo WhatsApp (43) 99174-1518.';
  }
  if (q.includes('material') || q.includes('materiais') || q.includes('pla') || q.includes('petg') || q.includes('abs') || q.includes('resina')) {
    return 'Trabalhamos com diversos materiais: **PLA** (biodegradável, ideal para decoração), **PETG** (resistente e flexível), **ABS** (industrial, alta resistência), **Nylon** (durável e leve) e **Resina** (alta definição para miniaturas e colecionáveis). Cada material tem características únicas para diferentes aplicações!';
  }
  if (q.includes('orçamento') || q.includes('orcamento') || q.includes('cotação') || q.includes('cotacao')) {
    return 'Para solicitar um orçamento, você pode:\n\n1. Acessar nosso site: **www.3dkprint.com.br/orcamento**\n2. Enviar seu arquivo 3D (STL, OBJ, 3MF ou STEP)\n3. Ou falar diretamente pelo WhatsApp: **(43) 99174-1518**\n\nResponderemos o mais rápido possível! 🚀';
  }
  if (q.includes('entrega') || q.includes('prazo') || q.includes('frete') || q.includes('envio')) {
    return 'O prazo de entrega varia conforme o tamanho e complexidade do projeto. Peças simples podem ser entregues em 3-5 dias úteis. Para projetos maiores, o prazo é informado no orçamento. Enviamos para todo o Brasil! 📦';
  }
  if (q.includes('arquivo') || q.includes('formato') || q.includes('stl') || q.includes('obj')) {
    return 'Aceitamos arquivos nos formatos: **STL**, **OBJ**, **3MF** e **STEP**. Você pode enviar seu arquivo diretamente pelo nosso site em www.3dkprint.com.br/enviar-arquivo ou pelo WhatsApp (43) 99174-1518.';
  }
  if (q.includes('whatsapp') || q.includes('contato') || q.includes('telefone') || q.includes('falar')) {
    return 'Você pode entrar em contato conosco pelo **WhatsApp: (43) 99174-1518** ou acessar nosso site **www.3dkprint.com.br/contato**. Estamos sempre prontos para atender! 📱';
  }
  if (q.includes('impressora') || q.includes('manutenção') || q.includes('manutencao') || q.includes('reparo') || q.includes('conserto')) {
    return 'Oferecemos serviços de **manutenção e reparo** de impressoras 3D! Trabalhamos com diversas marcas e modelos. Para solicitar um orçamento de manutenção, acesse: www.3dkprint.com.br/orcamento-manutencao ou entre em contato pelo WhatsApp (43) 99174-1518. 🔧';
  }
  if (q.includes('modelagem') || q.includes('modelo 3d') || q.includes('criar modelo') || q.includes('desenho')) {
    return 'Sim! Oferecemos serviços de **modelagem 3D**. Podemos criar modelos a partir de fotos, desenhos ou descrições. Solicite um orçamento em: www.3dkprint.com.br/orcamento-modelagem 🎨';
  }
  if (q.includes('pintura') || q.includes('pintar') || q.includes('acabamento')) {
    return 'Oferecemos **pintura profissional** de peças impressas em 3D! Fazemos acabamento de alta qualidade para dar vida às suas peças. Solicite um orçamento em: www.3dkprint.com.br/orcamento-pintura 🎨';
  }
  if (q.includes('obrigado') || q.includes('obrigada') || q.includes('valeu') || q.includes('agradeço')) {
    return 'De nada! 😊 Fico feliz em ajudar. Se tiver mais alguma dúvida, estou por aqui 24 horas! Você também pode falar com nossa equipe pelo WhatsApp: (43) 99174-1518.';
  }
  if (q.includes('oi') || q.includes('olá') || q.includes('ola') || q.includes('bom dia') || q.includes('boa tarde') || q.includes('boa noite') || q.includes('hey') || q.includes('eae') || q.includes('e aí')) {
    return 'Olá! 👋 Bem-vindo à **3DKPRINT**! Como posso ajudar você hoje? Posso tirar dúvidas sobre nossos produtos, serviços de impressão 3D, orçamentos e muito mais!';
  }
  
  return null;
}

// Função para chamar a API de IA
async function getAIResponse(messages: Message[]): Promise<string> {
  try {
    const apiMessages = [
      { role: 'system', content: SYSTEM_CONTEXT },
      ...messages.map(m => ({ role: m.role, content: m.content }))
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY || ''}`,
      },
      body: JSON.stringify({
        model: 'gpt-4.1-nano',
        messages: apiMessages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('API error');
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'Desculpe, não consegui processar sua pergunta. Por favor, tente novamente ou entre em contato pelo WhatsApp (43) 99174-1518.';
  } catch {
    return '';
  }
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Esconder pulse após 10 segundos
  useEffect(() => {
    const timer = setTimeout(() => setShowPulse(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Tentar resposta local primeiro
      const localResponse = getLocalResponse(text);
      
      let responseText: string;
      
      if (localResponse) {
        // Usar resposta local
        responseText = localResponse;
      } else {
        // Tentar API de IA
        const allMessages = [...messages, userMessage];
        const aiResponse = await getAIResponse(allMessages);
        
        if (aiResponse) {
          responseText = aiResponse;
        } else {
          // Fallback genérico
          responseText = 'Obrigado pela sua pergunta! Para uma resposta mais detalhada, recomendo entrar em contato com nossa equipe pelo **WhatsApp: (43) 99174-1518** ou solicitar um orçamento em nosso site: **www.3dkprint.com.br/orcamento**. Estamos prontos para ajudar! 😊';
        }
      }

      // Simular delay para parecer natural
      await new Promise(resolve => setTimeout(resolve, localResponse ? 800 : 300));

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Desculpe, tive um problema ao processar sua mensagem. Por favor, tente novamente ou entre em contato pelo WhatsApp: (43) 99174-1518.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatMessage = (content: string) => {
    // Converter markdown básico para HTML
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br />');
  };

  const quickQuestions = [
    'Quais materiais vocês trabalham?',
    'Como solicitar um orçamento?',
    'Qual o prazo de entrega?',
    'Vocês fazem modelagem 3D?',
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => { setIsOpen(true); setShowPulse(false); }}
        className="fixed bottom-24 right-6 z-50 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all hover:scale-110 group"
        aria-label="Abrir chat de atendimento"
      >
        {showPulse && (
          <span className="absolute inset-0 rounded-full bg-blue-600 animate-ping opacity-40" />
        )}
        <MessageSquare className="h-6 w-6 text-white relative z-10" />
        <span className="absolute right-full mr-3 px-3 py-2 bg-white text-gray-800 text-sm font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Atendimento 24h
        </span>
      </button>
    );
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-24 right-6 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all"
        >
          <Bot className="h-5 w-5" />
          <span className="text-sm font-medium">3DK Assistente</span>
          {messages.length > 1 && (
            <span className="w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
              {messages.filter(m => m.role === 'assistant').length - 1}
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[550px] max-h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">3DK Assistente</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white/80 text-xs">Online 24h</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Minimizar"
          >
            <Minimize2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Fechar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2.5 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              message.role === 'user' 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
            }`}>
              {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>
            <div
              className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-md'
                  : 'bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-100'
              }`}
              dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
            />
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-100">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {/* Quick Questions - mostrar apenas no início */}
        {messages.length === 1 && !isLoading && (
          <div className="space-y-2">
            <p className="text-xs text-gray-500 font-medium px-1">Perguntas frequentes:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setInputValue(question);
                    setTimeout(() => {
                      const fakeEvent = { key: 'Enter', shiftKey: false, preventDefault: () => {} } as React.KeyboardEvent;
                      handleKeyDown(fakeEvent);
                    }, 100);
                  }}
                  className="text-xs px-3 py-1.5 bg-white border border-blue-200 text-blue-600 rounded-full hover:bg-blue-50 transition-colors shadow-sm"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua mensagem..."
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
        <p className="text-center text-[10px] text-gray-400 mt-2">
          Assistente virtual 3DKPRINT - Atendimento 24h
        </p>
      </div>
    </div>
  );
}
